const multer= require("multer");
const fs=require("fs/promises");
const cloudinary = require("../config/cloudinary.config");

//Ensuring existence of file dir
const ensureDir = async(dirPath) =>{
    try{
     await fs.mkdir(dirPath,{recursive:true});
    }catch (err){
        console.error("Failed to create upload Directory:",err);
        throw new Error("Couldn't prepapre upload folder");
    }
};

//Image uploads
const imgStorage = multer.diskStorage({
    destination: async(req,file,cb)=>{
        const folder="uploads/product-images";
        try{
            await ensureDir(folder);
            cb(null,folder);
        }catch(error){
            cb(error,folder);
        }
    },
    filename:(req,file,cb)=>{
        const fileName =Date.now()+'-'+file.originalname;
        cb(null,fileName);
    }
});

const imgFilter = (req,file,cb) =>{
    const allowedtypes =["image/jpeg","image/jpg","image/png"];
    if(allowedtypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Only JPEG,JPG and PNG files are allowed"),false);
    }
};

const imgUpload = multer({
    storage:imgStorage,
    fileFilter: imgFilter,
    limits:{fileSize:5*1024*1024},//5MB
});

const fileUpload = async(filePath,folderName) =>{
    if (!filePath) throw new Error("No file path provided")
    try{
        const file= await cloudinary.uploader.upload(filePath,{resource_type:"auto",
            folder:folderName });
        
        // if(!file?.secure_url) {
        //     return res.status(500).json({error:"File upload failed"});
        // }
        
        return{ public_id:file.public_id, url: file.secure_url}
        
    }catch(error){
        console.error("Upload FIle Util Error",error);
        throw error;
    }
    finally{
        console.log("File path=",filePath)
        try{
            await fs.unlink(filePath);
            console.log("File cleared");
        }catch (err){
            console.warn("Local file cleanup failed:",err)
        }
        
    }
}

const deleteFile = async(publicId) => {
    try{
        if(!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    }catch (err){
        console.error("Cloudinary Delete Error");
        throw new Error("Internal Sever Error")
    }
}


module.exports= {imgUpload,fileUpload,deleteFile}

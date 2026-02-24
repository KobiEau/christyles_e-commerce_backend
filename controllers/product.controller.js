const productModel = require("../models/product.model");
const cloudinaryConfig = require("../config/cloudinary.config");
const cloudinary = require("cloudinary").v2;

//Creating new product entry

const createProduct = async (req, res) => {
    let result;

    try {
        //checking for uploaded file details
        console.log("req.file=", req.file)
        console.log("req.file.path", req.file.path);


        //destructuring variables
        const { productName, productDetail, productPrice, productStock, productSizes } = req.body

        result = await cloudinaryConfig.uploader.upload(req.file.path, { folder: "Christyles" });

        // debugging 
        console.log("result=", result);

        //Saving product
        const newProduct = new productModel({
            productName: productName,
            productDetail,
            productPrice,
            productStock,
            productSizes,
            imageUrl: result.secure_url,
            imagePublicId: result.public_id
        });

        const saved = await newProduct.save();

        res.status(201).json(saved);

    } catch (error) {
        console.error("Error creating product", error);
        console.log("public_id=", result.public_id)
        if (result && result.public_id) {
            await cloudinary.uploader.destroy(result.public_id);
            console.log("deleted uploaded file");
        }
        res.status(500).json({ message: "Failed to create product", error: error || error.messsage });
    }
}

// const createProduct2 = async (req, res) => {
//     let uploadedImagePublicId = null;

//     try {
//         // Checking for uploaded file details
//         console.log("req.file=", req.file);
//         console.log("req.file.path", req.file.path);

//         // Destructuring variables
//         const { productName, productDetail, productPrice, productStock, productSizes } = req.body;

//         const result = await cloud
// uploader.upload(req.file.path, { folder: "Christyles" });
//         uploadedImagePublicId = result.public_id; // Store public_id for cleanup

//         // Debugging
//         console.log("result=", result);

//         // Saving product
//         const newProduct = new productModel({
//             productName: productName,
//             productDetail,
//             productPrice,
//             productStock,
//             productSizes,
//             imageUrl: result.secure_url,
//             imagePublicId: result.public_id
//         });

//         const saved = await newProduct.save();

//         res.status(201).json(saved);

//     } catch (error) {
//         console.error("Error creating product", error);

//         // If an error occurred and an image was uploaded, delete it from Cloudinary
//         if (uploadedImagePublicId) {
//             try {
//                 await cloudinaryConfig.uploader.destroy(uploadedImagePublicId);
//                 console.log(`Deleted uploaded image with public_id: ${uploadedImagePublicId}`);
//             } catch (deleteError) {
//                 console.error("Error deleting uploaded image:", deleteError);
//             }
//         }

//         res.status(500).json({ message: "Failed to create product", error: error.message });
//     }
// };

const viewProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        /* console.log("Products=", products);*/
        if (products === 0) {
            return res.status(404).json({ message: "No products available" });
        }
        return res.status(200).json({ message: "Products retrieved", products });
    } catch (error) {
        console.error("Error in viewProducts", error);
        return res.status(500).json({ message: "Failed to view Products", error: error.message || error })
    }
}

const viewProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findById(productId)

        if (!product) {
            return res.status(404).json({ error: "No Products Found" })
        }
        return res.status(200).json({ message: "Products Retrieved Successfully", product });
    } catch (error) {
        console.error("Error viewing products by Id", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

const editProduct = async (req, res) => {
    const { productId } = req.params;
    const { productName, productDetail, productPrice, productStock, productSizes } = req.body;

    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product Not found" });
        }

        const updates = {};
        
        // Use a simple loop or manual check now that they are defined
        if (productName) updates.productName = productName;
        if (productDetail) updates.productDetail = productDetail;
        if (productPrice) updates.productPrice = productPrice;
        if (productStock) updates.productStock = productStock;
        if (productSizes) updates.productSizes = productSizes;

        // Handle Image Update
        if (req.file) {
            // 1. Delete old image from Cloudinary
            if (product.imagePublicId) {
                await cloudinary.uploader.destroy(product.imagePublicId);
            }
            // 2. Assign new image details (assuming multer-storage-cloudinary)
            updates.imageUrl = req.file.path;
            updates.imagePublicId = req.file.filename;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId, 
            { $set: updates }, 
            { new: true, runValidators: true }
        );

        return res.status(200).json({ 
            message: "Product Edited Successfully", 
            product: updatedProduct 
        });

    } catch (error) {
        console.error("Error editing product", error);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
}

const deleteProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findByIdAndDelete(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        
        //deleting image
        await cloudinary.uploader.destroy(product.imagePublicId)
        
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error Deleting Product", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message || error });
    }
}

const searchProducts = async (req,res) =>{
     const { productName,maxPrice,minPrice,productSizes } = req.query || {};
    
     try{
        let filter = {}

        if(productName) filter.productName = {$regex:productName,$options:"i"};
        // if(maxPrice) filter.maxProductPrice = {$lte:Number(maxPrice)};
        // if(minPrice) filter.minProductPrice = {$gte:Number(minPrice)};
        // Initialize the productPrice filter if either exists
        if (minPrice || maxPrice) {
            filter.productPrice = {}; 

            if (minPrice) {
                filter.productPrice.$gte = Number(minPrice); // Greater than or equal to
            }
            if (maxPrice) {
                filter.productPrice.$lte = Number(maxPrice); // Less than or equal to
            }
        }
        if(productSizes) filter.productSizes = {$regex:productSizes,$options:"i"};

        const products = await productModel.find(filter);

        if(products.length === 0) return res.status(404).json({message:"No Products found"});

        return res.status(200).json({message:"Products found", count:products.length , products});
     }
     catch(error){
        console.error("Error Searching for product",error);
        res.status(500).json({message:"Internal Server error",error: error.message || error })
     }
}

module.exports = { createProduct, viewProducts, viewProductById, deleteProductById, editProduct,searchProducts };

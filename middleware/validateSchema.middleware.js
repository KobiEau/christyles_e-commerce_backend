const validateJoiSchema = (schema) =>{
    return (req,res,next) =>{
        //destructuring values
        const {error,value} = schema.validate(req.body,{abortEarly:false});

        if (error){
            const errorDetails = error.details.map((err)=>err.message);
            return res.status(400).json({
                message:"Validation failed",
                errors: errorDetails
            });
        }

        console.log("value",value);

        req.validateBody = value; //Passing sanitized, validated body forward
        next();
    };
};


module.exports =validateJoiSchema;
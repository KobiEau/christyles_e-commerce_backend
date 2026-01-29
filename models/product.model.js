const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    imageUrl:{type:String},
    imagePublicId:{type:String},
    productName:{type:String,required:true},
    productDetail:{type:String,required:true},
    productPrice:{type:Number,required:true},
    productStock:{type:Number,required:true},
    productSizes:{type:[String],required:true,enum:['XS','S','M','L','XL','XXL']}
},{timestamps:true});

module.exports =mongoose.model("Product",productSchema)
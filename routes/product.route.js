const { Router } = require("express");
const router = Router();
//const router = express.Router()
const validateJoiSchema = require("../middleware/validateSchema.middleware");
const products = require("../controllers/product.controller");
const createProductSchema = require("../validation/product.schema")
const imageUpload = require("../utils/imageUpload.util")

// Products
router.get("/view-all-products",
// #swagger.tags=['Users','Admin']
// #swagger.summary='View All Products'
products.viewProducts);

router.get("/view-product/:productId", 
// #swagger.tags = ['Users','Admin']
// #swagger.summary = 'View Specific Products'
products.viewProductById);

router.post("/add-product", validateJoiSchema(createProductSchema), imageUpload.single("image"),
// #swagger.tags=['Admin'] 
// #swagger.summary='Create and Add New Product'
products.createProduct);

router.patch("/edit-product/:productId", imageUpload.single("image"),
//#swagger.tags=['Admin']
//#swagger.summary='Edit Product Details By Id'
products.editProduct);

router.delete("/delete-product/:productId",
//#swagger.tags=['Admin']
//#swagger.summary = 'Delete Product By Id'
products.deleteProductById);


module.exports = router;
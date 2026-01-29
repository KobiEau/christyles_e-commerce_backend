const express = require ("express");
const app = express();
const PORT = process.env.PORT || 8000 ;
const DBConnect = require("./config/db.config");
const cors= require("cors");
const productRoutes = require("./routes/product.route");

const swaggerUi = require("swagger-ui-express");
const swaggerdocument = require("./swagger-output.json");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//routes
app.get("/",async(req,res)=>{
    res.send("Server Is Active");
});
app.use('/api/v1/products',productRoutes);
app.use('/api/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerdocument));

// app.listen(PORT,()=>console.log(`Server is running on http://localhost:${PORT}`))

const startServer = async ()=>{
    try {
        await DBConnect();
        app.listen(PORT,()=>console.log(`Server is running on http://localhost:7000`));
    } catch (error) {
        console.log("Failed to Connect to MongoDB",error.message);
        process.exit(1);
    }
};

startServer();
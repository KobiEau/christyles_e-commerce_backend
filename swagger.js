const swaggerAutogen = require("swagger-autogen")

const doc ={
    info:{
        title: "Boutique E-commerce Platform",
        description: ``
    },
    host: `christyles-e-commerce-backend.onrender.com`,
    schemes:["https"]
}

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen(outputFile,routes,doc);

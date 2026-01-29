const swaggerAutogen = require("swagger-autogen");

const doc ={
    info:{
        title: "Boutique E-commerce Platform",
        description: ``
    },
    host: `localhost:7000`,
    schemes:["http"]
}

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen(outputFile,routes,doc);

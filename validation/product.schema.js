const Joi= require("joi");

const createProductSchema = Joi.object({
    name:Joi.string().trim().required(),
    detail:Joi.string().trim().required(),
    price:Joi.number().min(1).required(),
    stock:Joi.number().min(0).required(),
    sizes:Joi.string().required().valid('XS','S','M','L','XL','XXL')
});

module.exports = createProductSchema;

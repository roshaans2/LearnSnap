const Joi = require("joi")
module.exports.LearnSnapSchema = Joi.object({
        title:Joi.string().required(),
        content:Joi.string().required(),
        category:Joi.string().required(),
    }).required()

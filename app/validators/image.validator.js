const Joi = require('@hapi/joi');

function validateImage(user) {
    let schema = Joi.object({
        tags: Joi.array().items(Joi.object({ tag: Joi.string() })).min(1).required(),
    })
    let result = schema.validate(user)
    console.log(result);
    return result
}







module.exports.validateImage = validateImage



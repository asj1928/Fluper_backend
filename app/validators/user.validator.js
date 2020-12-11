const Joi = require('@hapi/joi');

function validateuser(user) {
    let schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().max(255),
    })
    let result = schema.validate(user)
    console.log(result);
    return result
}
function authenticateUser(user) {
    let schema = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().max(255).required()
    })
    let result = schema.validate(user)
    console.log(result);
    return result
}


function validateUpdateuser(user) {
    let schema = Joi.object({
        username: Joi.string().min(3).max(50),
        name: Joi.string().min(3).max(50),
        email: Joi.string().max(255).email(),
        password: Joi.string().max(255),
    })
    let result = schema.validate(user)
    console.log(result);
    return result
}






module.exports.validateUser = validateuser
module.exports.authenticateUser = authenticateUser
module.exports.validateUpdateuser = validateUpdateuser


const Joi = require('joi');

//Joi is npm package used for validation Schema for server side........................

module.exports. listingSchema = Joi.object({
    listing :   Joi.object(
        {
            title : Joi.string().required(),
            description : Joi.string().required(),
            location : Joi.string().required(),
            country : Joi.string().required(),
            price : Joi.number().required().min(0),
            image : Joi.string().allow("",null),
        }
    ).required() ,
});

//validator for rview server side.......................................................

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
})
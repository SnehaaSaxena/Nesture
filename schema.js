const Joi=require("joi");
module.exports.listingSchema=Joi.object({ // an obj comes under Joi and its name is listing
    listing:Joi.object({ // means acc to joi and schema validation it needs to be object and required
        title: Joi.string().required(), // the type of title should be string and it must be present
        description:Joi.string().required(),
        price:Joi.number().required().min(0), // type should be number
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null)
    }).required()
});

module.exports.reviewSchema=Joi.object({ //ye ek object hone waali hai
    review:Joi.object({ // ye bhi ek object honi chahiye
       rating:Joi.number().required().min(1).max(5),
       comment:Joi.string().required(),
    }).required(),
});
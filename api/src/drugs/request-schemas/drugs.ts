import Joi from "joi";

export const createDrugIndicationSchema = Joi.object({
    indication: Joi.string().required().messages({
        'string.base': `"indication" needs to be string`,
        'string.empty': `"indication" should not be empty`,
        'any.required': `"indication" is required`
    }),
    icd10Code: Joi.string().required().messages({
        'string.base': `"indication" needs to be string`,
        'string.empty': `"indication" should not be empty`,
        'any.required': `"indication" is required`
    }),
})

export const updateDrugIndicationSchema = Joi.object({
    indication: Joi.string().optional().messages({
        'string.base': `"indication" needs to be string`,
        'string.empty': `"indication" should not be empty`,
    }),
    icd10Code: Joi.string().optional().messages({
        'string.base': `"indication" needs to be string`,
        'string.empty': `"indication" should not be empty`,
    }),
})
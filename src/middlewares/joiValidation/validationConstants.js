import Joi from "joi"

export const FNAME = Joi.string().required().max(20)
export const LNAME = Joi.string().required().max(20)
export const EMAIL = Joi.string().email({ minDomainSegments: 2 }).required()
export const PASSWORD = Joi.string().required().min(7)
export const ROLE = Joi.string().required()
export const DATE = Joi.date()
export const PHOTO = Joi.string().alphanum()
export const PRICE = Joi.number().max(100000)
export const SHORTSTR = Joi.string().alphanum().max(20)
export const LONGSTR = Joi.string().alphanum().max(100000)
export const RATING = Joi.number().min(1).max(5).required()

export const validator = (schema, req, res, next) => {
  const { error } = schema.validate(req.body)
  if (error) {
    error.status = 200
    return next(error)
  }

  next(error)
}

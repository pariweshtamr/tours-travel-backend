import Joi from "joi"
import {
  EMAIL,
  FNAME,
  LNAME,
  LONGSTR,
  PASSWORD,
  RATING,
  SHORTSTR,
  validator,
} from "./validationConstants.js"

export const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: FNAME,
    lName: LNAME,
    email: EMAIL,
    password: PASSWORD,
    username: SHORTSTR,
  })

  validator(schema, req, res, next)
}

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    password: PASSWORD,
  })
  validator(schema, req, res, next)
}

export const reviewValidation = (req, res, next) => {
  const schema = Joi.object({
    username: SHORTSTR,
    reviewText: LONGSTR.required(),
    rating: RATING,
  })

  validator(schema, req, res, next)
}

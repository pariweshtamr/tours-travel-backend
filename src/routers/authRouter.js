import express from "express"
import { comparePassword, hashPassword } from "../helpers/bcryptHelper.js"
import { signJWT } from "../helpers/jwtHelper.js"
import { newUserValidation } from "../middlewares/joiValidation/formValidations.js"
import { createUser, getUserByFilter } from "../models/User/UserModel.js"

const router = express.Router()

// register user
router.post("/register", newUserValidation, async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await getUserByFilter({ email })

    if (user?._id) {
      return res.json({
        status: "error",
        message: "An account with this email already exists. Please log in!",
      })
    }

    // hash password
    const hashPass = hashPassword(password)
    req.body.password = hashPass

    const newUser = await createUser(req.body)

    if (newUser?._id) {
      return res.status(200).json({
        status: "success",
        message: "User has been created successfully!",
      })
    }
    return res.json({
      status: "error",
      message: "Unable to crteate user. Please try again later!",
    })
  } catch (error) {
    next(error)
  }
})

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await getUserByFilter({ email })

    if (user?._id) {
      const isPassMatched = comparePassword(password, user.password)

      if (isPassMatched) {
        user.password = undefined
        user.__v = undefined

        const token = await signJWT({ _id: user._id, role: user.role })
        // set token in browser cookies and send response to the client
        return res
          .cookie("acccesToken", token, {
            httpOnly: true,
          })
          .status(200)
          .json({
            status: "success",
            message: "Login Successful",
            token,
            user,
          })
      }
    }

    res.json({
      status: "error",
      message: "Invalid login details!",
    })
  } catch (error) {
    next(error)
  }
})

export default router

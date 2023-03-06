import express from "express"
import { comparePassword, hashPassword } from "../helpers/bcryptHelper.js"
import {
  createJwts,
  signAccessJwt,
  verifyRefreshJwt,
} from "../helpers/jwtHelper.js"
import { verifyUser } from "../middlewares/authMiddleware.js"
import { newUserValidation } from "../middlewares/joiValidation/formValidations.js"
import {
  createUser,
  getUserByFilter,
  getUserById,
} from "../models/User/UserModel.js"

const router = express.Router()

// get user
router.get("/", verifyUser, (req, res, next) => {
  try {
    const user = req.user

    res.json({
      status: "success",
      user,
    })
  } catch (error) {
    next(error)
  }
})

// return new accessJwt
router.get("/accessJwt", async (req, res, next) => {
  try {
    const refreshJwt = req.headers.authorization
    const decoded = verifyRefreshJwt(refreshJwt)

    if (!decoded?._id) return

    // check if refreshJwt exists in db
    const user = await getUserById({ _id: decoded._id })

    // if refreshJwt is valid, create new accessJwt and send to client
    if (user?._id) {
      const accessJwt = await signAccessJwt({
        _id: decoded._id,
        role: decoded.role,
      })

      return res.json({
        status: "success",
        accessJwt,
      })
    }

    res.status(401).json({
      status: "error",
      message: "Invalid refreshJwt.",
    })
  } catch (error) {
    next(error)
  }
})

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

// login user
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await getUserByFilter({ email })

    if (user?._id) {
      const isPassMatched = comparePassword(password, user.password)

      if (isPassMatched) {
        user.password = undefined
        user.__v = undefined
        user.refreshJwt = undefined

        const tokens = await createJwts({ _id: user._id, role: user.role })
        // set token in browser cookies and send response to the client
        return res
          .cookie("acccesToken", tokens.accessJwt, {
            httpOnly: true,
          })
          .status(200)
          .json({
            status: "success",
            message: "Login Successful",
            tokens,
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

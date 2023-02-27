import express from "express"
import { verifyAdmin, verifyUser } from "../middlewares/authMiddleware.js"
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../models/User/UserModel.js"
import { hashPassword, comparePassword } from "../helpers/bcryptHelper.js"

const router = express.Router()

// get all users
router.get("/", verifyAdmin, async (req, res, next) => {
  try {
    const users = await getAllUsers()

    let u = []

    users.map((user) => {
      const { password, __v, ...rest } = user._doc

      u = [...u, rest]
      return u
    })

    res.status(200).json({ status: "success", u })
  } catch (error) {
    next(error)
  }
})

// get single user
router.get("/:_id", verifyUser, async (req, res, next) => {
  const { _id } = req.params
  try {
    const user = await getUserById(_id)
    const { password, role, __v, ...rest } = user._doc

    user?._id
      ? res.status(200).json({ status: "success", rest })
      : res.status(400).json({ status: "error", message: "User not found" })
  } catch (error) {
    next(error)
  }
})

// update user password
router.patch("/update-password", verifyUser, async (req, res, next) => {
  const userId = req.user._id
  const { currentPassword, password } = req.body

  try {
    const user = await getUserById(userId)

    if (!user._id) {
      res.json({
        status: "error",
        message: "User not found!",
      })
      return
    }

    const isPassMatched = comparePassword(currentPassword, user?.password)

    if (isPassMatched) {
      const hashedPass = hashPassword(password)

      const updatedUser = await updateUser(user._id, { password: hashedPass })

      if (updatedUser._id) {
        res.json({
          status: "success",
          message: "Password updated successfully!",
        })
        return
      }
      res.json({
        status: "error",
        message:
          "Error!, Unable to update the password, please try again later.",
      })
    }
  } catch (error) {
    next(error)
  }
})

// delete user
router.delete("/:_id", verifyUser, async (req, res, next) => {
  const { _id } = req.params
  try {
    await deleteUser(_id)

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

export default router

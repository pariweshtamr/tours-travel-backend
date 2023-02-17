import express from "express"
import { verifyAdmin, verifyUser } from "../helpers/jwtHelper.js"
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByFilter,
  getUserById,
  updateUser,
} from "../models/User/UserModel.js"

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

// update user
router.put("/:_id", verifyUser, async (req, res, next) => {
  const { _id } = req.params
  try {
    const user = await updateUser(_id, {
      $set: req.body,
    })
    user._id
      ? res.status(200).json({
          status: "success",
          message: "User information updated successfully",
          tour,
        })
      : res.status(500).json({
          status: "error",
          message: "Failed to update User information",
        })
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

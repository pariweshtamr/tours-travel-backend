import express from "express"
import { verifyAdmin, verifyUser } from "../middlewares/authMiddleware.js"
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByFilter,
} from "../models/Booking/BookingModel.js"
import Stripe from "stripe"

const router = express.Router()

// get all bookings
router.get("/", verifyAdmin, async (req, res, next) => {
  try {
    const bookings = await getAllBookings()
    bookings.length
      ? res.status(200).json({ status: "success", bookings })
      : res.status(500).json({ status: "error", message: "No bookings found!" })
  } catch (error) {
    next(error)
  }
})

// get single booking
router.get("/:_id", verifyUser, async (req, res, next) => {
  const { _id } = req.params
  try {
    const booking = await getBookingById(_id)
    booking?._id
      ? res.status(200).json({ status: "success", booking })
      : res.status(500).json({ status: "error", message: "Booking not found" })
  } catch (error) {
    next(error)
  }
})

// get bookings by user
router.get("/userBookings/tour", verifyUser, async (req, res, next) => {
  const { _id } = req.user

  try {
    const bookings = await getBookingsByFilter({ userId: _id })

    bookings.length
      ? res.status(200).json({
          status: "success",
          message: `${bookings.length} bookings found!`,
          bookings,
        })
      : res
          .status(200)
          .json({ status: "success", message: "No bookings found!" })
  } catch (error) {
    next(error)
  }
})

// create booking
router.post("/", verifyUser, async (req, res, next) => {
  try {
    const booking = await createBooking({
      fName,
      lName,
      phone,
      tourName,
      guestSize,
      userEmail,
      userId,
      bookAt,
    })

    booking?._id
      ? res
          .status(200)
          .json({ status: "success", message: "Your tour is booked!", booking })
      : res
          .status(500)
          .json({ status: "error", message: "Unable to book your tour!" })
  } catch (error) {
    next(error)
  }
})

export default router

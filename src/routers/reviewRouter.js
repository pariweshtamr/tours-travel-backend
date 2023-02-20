import express from "express"
import { verifyUser } from "../middlewares/authMiddleware.js"
import { createReview } from "../models/Review/ReviewModel.js"
import { updateTour } from "../models/Tour/TourModel.js"

const router = express.Router()

// create review
router.post("/:_id", verifyUser, async (req, res, next) => {
  const { _id } = req.params

  try {
    const review = await createReview(req.body)

    // after creating new review, update the reviews array of the tour

    if (review?._id) {
      await updateTour(_id, {
        $push: { reviews: review._id },
      })

      return res.status(200).json({
        status: "success",
        message: "Review submitted successfully!",
        review,
      })
    }
    res.status(500).json({
      status: "error",
      message: "Failed to submit review!",
    })
  } catch (error) {
    next(error)
  }
})

export default router

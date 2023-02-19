import express from "express"
import { verifyAdmin } from "../helpers/jwtHelper.js"
import {
  createTour,
  deleteTour,
  getAllTours,
  getATour,
  getTourCount,
  getToursByFilter,
  updateTour,
} from "../models/Tour/TourModel.js"

const router = express.Router()

// get All tours
router.get("/", async (req, res, next) => {
  // for pagination
  const page = parseInt(req.query.page)

  try {
    const tours = await getAllTours()
      .populate("reviews") // populate return all the data related to the id that is in the property (reviews)
      .skip(page * 8)
      .limit(8)
    res.status(200).json({ count: tours.length, status: "success", tours })
  } catch (error) {
    next(error)
  }
})

// get single tour
router.get("/:_id", async (req, res, next) => {
  const { _id } = req.params
  try {
    const tour = await getATour(_id).populate("reviews")

    tour._id
      ? res.status(200).json({
          status: "success",
          tour,
        })
      : res.status(404).json({
          status: "error",
          message: "Tour not found!",
        })
  } catch (error) {
    next(error)
  }
})

// get tours by search
router.get("/search/getToursBySearch", async (req, res, next) => {
  console.log(req.query)
  const city = new RegExp(req.query.city, "i")
  const distance = parseInt(req.query.distance)
  const maxGroupSize = parseInt(req.query.maxGroupSize)

  try {
    // gte means greater than equal
    const tours = await getToursByFilter({
      city,
      distance: { $gte: distance },
      maxGroupSize: { $gte: maxGroupSize },
    }).populate("reviews")
    res.status(200).json({
      status: "success",
      tours,
    })
  } catch (error) {
    next(error)
  }
})

// get featured tour
router.get("/search/featuredTour", async (req, res, next) => {
  try {
    const tours = await getToursByFilter({ featured: true })
      .populate("reviews")
      .limit(8)

    res.status(200).json({
      status: "success",
      tours,
    })
  } catch (error) {
    next(error)
  }
})

// get tour counts

router.get("/search/tourCount", async (req, res, next) => {
  try {
    const tourCount = await getTourCount()

    res.status(200).json({
      status: "success",
      tourCount,
    })
  } catch (error) {
    next(error)
  }
})

// Create new tour
router.post("/", verifyAdmin, async (req, res, next) => {
  try {
    const tour = await createTour(req.body)

    tour._id
      ? res.status(200).json({
          status: "success",
          message: "Tour created successfully",
          tour,
        })
      : res.status(500).json({
          status: "error",
          message: "Failed to create Tour",
        })
  } catch (error) {
    next(error)
  }
})

// update tour
router.put("/:_id", verifyAdmin, async (req, res, next) => {
  const { _id } = req.params
  try {
    const tour = await updateTour(_id, {
      $set: req.body,
    })
    tour._id
      ? res.status(200).json({
          status: "success",
          message: "Tour updated successfully",
          tour,
        })
      : res.status(500).json({
          status: "error",
          message: "Failed to update Tour",
        })
  } catch (error) {
    next(error)
  }
})

// delete tour
router.delete("/:_id", verifyAdmin, async (req, res, next) => {
  const { _id } = req.params
  try {
    await deleteTour(_id)

    res.status(200).json({
      status: "success",
      message: "Tour deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

export default router

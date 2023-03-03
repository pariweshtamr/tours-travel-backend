import Review from "./ReviewSchema.js"

export const createReview = (obj) => {
  return Review(obj).save()
}

export const deleteReview = (_id) => {
  return Review.findByIdAndDelete(_id)
}

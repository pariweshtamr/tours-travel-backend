import Review from "./ReviewSchema.js"

export const createReview = (obj) => {
  return Review(obj).save()
}

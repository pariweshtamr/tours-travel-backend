import TourSchema from "./TourSchema.js"

export const createTour = (obj) => {
  return TourSchema(obj).save()
}

export const updateTour = (filter, obj) => {
  return TourSchema.findOneAndUpdate(filter, obj, { new: true })
}

export const deleteTour = (_id) => {
  return TourSchema.findByIdAndDelete(_id)
}

export const getATour = (_id) => {
  return TourSchema.findById(_id)
}

export const getAllTours = () => {
  return TourSchema.find()
}

export const getToursByFilter = (filter) => {
  return TourSchema.find(filter)
}

export const getTourCount = () => {
  return TourSchema.estimatedDocumentCount()
}

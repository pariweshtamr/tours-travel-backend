import Booking from "./BookingSchema.js"

export const createBooking = (obj) => {
  return Booking(obj).save()
}

export const getBookingById = (_id) => {
  return Booking.findById(_id)
}

export const getAllBookings = () => {
  return Booking.find()
}

export const getBookingsByFilter = (filter) => {
  return Booking.find(filter)
}

export const getBookingAndUpdate = (id, obj) => {
  return Booking.findByIdAndUpdate(id, obj, { new: true })
}

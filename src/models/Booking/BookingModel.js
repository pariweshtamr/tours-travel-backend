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

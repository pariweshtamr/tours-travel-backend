import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    customerId: {
      type: String,
    },
    paymentIntentId: { type: String },
    userEmail: {
      type: String,
    },
    tour: {
      type: Object,
      tourId: { type: String, required: true },
      tourName: {
        type: String,
        required: true,
      },
      tourPrice: {
        type: String,
        required: true,
      },
      guestSize: {
        type: Number,
        required: true,
      },
      bookAt: {
        type: Date,
        required: true,
      },
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Booking", bookingSchema)

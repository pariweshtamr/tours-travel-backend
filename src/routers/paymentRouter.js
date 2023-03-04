import express from "express"
import Stripe from "stripe"
import { verifyUser } from "../middlewares/authMiddleware.js"
import {
  createBooking,
  getBookingAndUpdate,
} from "../models/Booking/BookingModel.js"

const router = express.Router()

router.post("/create-checkout-session", async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { tourPrice, tourId, guestSize, tourName, userId, phone, bookAt } =
    req.body

  const totalPrice = tourPrice * guestSize

  const customer = await stripe.customers.create({
    metadata: {
      userId,
      phone,
      tour: JSON.stringify({
        tourName,
        totalPrice,
        tourId,
        guestSize,
        bookAt,
      }),
    },
  })
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: tourName,
            },
            unit_amount: tourPrice * 100,
          },
          quantity: guestSize,
        },
      ],
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/thank-you`,
      cancel_url: `${process.env.CLIENT_URL}/tours/${tourId}`,
      // consent_collection: {
      //   terms_of_service: "required",
      // },
    })
    res.json({ url: session.url })
  } catch (error) {
    next(error)
  }
})

//  create booking
const createOrder = async (customer, data) => {
  const tour = JSON.parse(customer.metadata.tour)

  try {
    const newBooking = await createBooking({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      userEmail: customer.email,
      name: data.customer_details.name,
      phone: customer.metadata.phone,
      tour,
      paymentStatus: data.payment_status,
    })

    // email
  } catch (error) {
    console.log(error)
  }
}

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res, next) => {
    let endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    let event = req.body

    try {
      if (endpointSecret) {
        const sig = req.headers["stripe-signature"]

        // this step is important to ensure the event is coming from stripe and not from any third party
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
        } catch (error) {
          res.status(400).json(`Webhook Error: ${error.message}`)
        }
      }

      let data = event.data.object

      // // Handle the checkout.session.completed event
      if (event.type === "checkout.session.completed") {
        try {
          const customer = await stripe.customers.retrieve(data.customer)
          customer && createOrder(customer, data)
        } catch (error) {
          console.log(error.message)
        }
      }
      res.status(200).end()
    } catch (error) {
      next(error)
    }
  }
)

router.post("/refund", verifyUser, async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { paymentIntentId, tour, _id } = req.body
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: tour.totalPrice * 100,
    })

    if (refund.status === "succeeded") {
      await getBookingAndUpdate(_id, {
        paymentStatus: "Refunded",
      })

      return res.json({
        status: "success",
        message:
          "Payment refunded. It may take a few days for the money to reach your account!",
      })
    }
    res.json({ status: "error", message: "Unable to process refund!" })
  } catch (error) {
    next(error)
  }
})

export default router

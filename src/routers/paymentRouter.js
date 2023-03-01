import express from "express"
import Stripe from "stripe"
import { createBooking } from "../models/Booking/BookingModel.js"

const router = express.Router()

router.post("/create-checkout-session", async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const {
    tourPrice,
    tourId,
    guestSize,
    tourName,
    userId,
    phone,
    bookAt,
    serviceFee,
  } = req.body

  const price = tourPrice + serviceFee
  const totalPrice = tourPrice * guestSize + serviceFee

  const customer = await stripe.customers.create({
    metadata: {
      userId,
      phone,
      tour: JSON.stringify({ tourName, totalPrice, tourId, guestSize, bookAt }),
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
            unit_amount: price * 100,
          },
          quantity: guestSize,
        },
      ],
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/thank-you`,
      cancel_url: `${process.env.CLIENT_URL}/tours/${tourId}`,
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

let endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const sig = req.headers["stripe-signature"]

    let event
    // this step is important to ensure the event is coming from stripe and not from any third party
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (error) {
      res.status(400).json(`Webhook Error: ${error.message}`)
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
  }
)

export default router

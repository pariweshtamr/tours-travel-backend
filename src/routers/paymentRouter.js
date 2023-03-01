import express from "express"
import Stripe from "stripe"
import { buffer } from "micro"

const router = express.Router()

router.post("/create-checkout-session", async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { tourPrice, guestSize, tourName, userEmail, userId } = req.body

  const customer = await stripe.customers.create({
    metadata: {
      userId,
      tour: JSON.stringify({ tourName, tourPrice, guestSize }),
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
      cancel_url: `${process.env.CLIENT_URL}`,
    })
    res.json({ url: session.url })
  } catch (error) {
    next(error)
  }
})

const fulfillOrder = (lineItems) => {
  console.log("Fulfilling order", lineItems)
}

let endpointSecret =
  "whsec_736240ac8fb2f5cb2d4bc8135ce9639010265ca3af1f5c1805c15b07da32b7eb"

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const sig = req.headers["stripe-signature"]

    let event
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (error) {
      console.log(error.message)
      res.status(400).json(`Webhook Error: ${error.message}`)
    }

    let data = event.data.object

    // // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          console.log(customer)
          console.log("data:", data)
        })
        .catch((err) => console.log(err.message))
    }
    res.status(200).end()
  }
)

// router.post("/create", async (req, res) => {
//   const secret = process.env.STRIPE_SECRET_KEY
//   const stripe = new Stripe(secret)
//   const {
//     fName,
//     lName,
//     phone,
//     tourName,
//     guestSize,
//     userEmail,
//     tourPrice,
//     userId,
//   } = req.body

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: tourPrice * guestSize * 100,
//       currency: "aud",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     })

//     console.log(paymentIntent)
//     res.status(200).json({ clientSecret: paymentIntent.client_secret })
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     })
//   }
// })

export default router

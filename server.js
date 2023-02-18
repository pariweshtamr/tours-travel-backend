import dotenv from "dotenv"
dotenv.config()
import express from "express"
const app = express()
import cors from "cors"
import mongoClient from "./src/config/db.js"
import cookieParser from "cookie-parser"

const PORT = process.env.PORT || 8000

// Connect DB
mongoClient()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// import routers

import authRouter from "./src/routers/authRouter.js"
import userRouter from "./src/routers/userRouter.js"
import tourRouter from "./src/routers/tourRouter.js"
import reviewRouter from "./src/routers/reviewRouter.js"
import bookingRouter from "./src/routers/bookingRouter.js"

// use routers
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/tour", tourRouter)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/booking", bookingRouter)

// Global error handler
app.use((error, req, res, next) => {
  const errorStatus = error.status || 500
  const errorMsg = error.message || "Something went wrong!"

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMsg,
    stack: error.stack,
  })
})

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Backend server is running at http://localhost:${PORT}`)
})

import mongoose from "mongoose"

const mongoClient = () => {
  if (!process.env.MONGO_URL) {
    console.log(
      "MONGO_CLIENT is not defined. Please create MONGO_CLIENT and provide a MongoDB connection string"
    )
  }

  try {
    mongoose.set("strictQuery", false)
    const connectionString = mongoose.connect(process.env.MONGO_URL)
    if (connectionString) {
      return console.log("MongoDB Connected")
    }
    console.log("Failed to connect to MongoDB")
  } catch (error) {
    console.log(error)
  }
}

export default mongoClient

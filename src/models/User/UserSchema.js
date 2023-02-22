import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      Type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    refreshJwt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("User", userSchema)

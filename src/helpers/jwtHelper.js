import jwt from "jsonwebtoken"
import { updateUser } from "../models/User/UserModel.js"

export const signAccessJwt = async (payload) => {
  const accessJwt = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
    expiresIn: "1d",
  })

  return accessJwt
}

export const signRefreshJwt = async (payload) => {
  const refreshJwt = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "15d",
  })

  await updateUser({ _id: payload._id }, { refreshJwt })

  return refreshJwt
}

export const createJwts = async (payload) => {
  return {
    accessJwt: await signAccessJwt(payload),
    refreshJwt: await signRefreshJwt(payload),
  }
}

export const verifyAccessJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY)
  } catch (error) {
    return error.message
  }
}

export const verifyRefreshJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY)
  } catch (error) {
    return error.message
  }
}

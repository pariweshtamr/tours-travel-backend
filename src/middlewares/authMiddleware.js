import { verifyAccessJwt } from "../helpers/jwtHelper.js"
import { getUserById } from "../models/User/UserModel.js"

export const verifyUser = async (req, res, next) => {
  try {
    // get accessJwt from headers
    const accessJwt = req.headers.authorization
    if (accessJwt) {
      // check validity
      const decoded = verifyAccessJwt(accessJwt)
      if (decoded === "jwt expired") {
        return res.status(403).json({
          status: "error",
          message: "jwt expired!",
        })
      }
      const user = await getUserById({ _id: decoded._id }).select("-password")

      if (user.role === "user" || user.role === "admin") {
        req.user = user
        return next()
      }
    }
    res.status(401).json({
      status: "error",
      message: "Unauthorized! jwt expired",
    })
  } catch (error) {
    next(error)
  }
}

export const verifyAdmin = async (req, res, next) => {
  try {
    // get token from headers
    const accessJwt = req.headers.authorization
    // check validity
    const decoded = verifyAccessJwt(accessJwt)
    if (decoded === "jwt expired") {
      return res.status(403).json({
        status: "error",
        message: "jwt expired!",
      })
    }
    const user = await getUserById({ _id: decoded._id }).select("-password")
    if (user?.role === "admin") {
      req.user = user
      return next()
    }

    res.status(401).jason({
      error: "error",
      message: "You are not authorized!",
    })
  } catch (error) {
    next(error)
  }
}

import { verifyAccessJwt } from "../helpers/jwtHelper.js"
import { getUserById } from "../models/User/UserModel.js"

export const verifyUser = async (req, res, next) => {
  try {
    // get accessJwt from headers
    const accessJwt = req.headers.authorization
    if (accessJwt) {
      // check validity
      const decoded = verifyAccessJwt(accessJwt)
      console.log(decoded)
      if (decoded === "jwt expired") {
        return res.status(403).json({
          status: "error",
          message: "jwt expired!",
        })
      }
      const user = await getUserById({ _id: decoded._id })

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

  // verifyAccessJwt(req, res, next, () => {
  //   if (req.user._id === req.params._id || req.user.role === "admin") {
  //     next()
  //   } else {
  //     return res.status(401).json({
  //       status: "error",
  //       message: "You are not authenticated",
  //     })
  //   }
  // })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role === "admin") {
      next()
    } else {
      return res.status(401).json({
        status: "error",
        message: "You are not authorized",
      })
    }
  })
}

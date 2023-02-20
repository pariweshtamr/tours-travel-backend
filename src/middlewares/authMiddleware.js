import { verifyToken } from "../helpers/jwtHelper.js"

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user._id === req.params._id || req.user.role === "admin") {
      next()
    } else {
      return res.status(401).json({
        status: "error",
        message: "You are not authenticated",
      })
    }
  })
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

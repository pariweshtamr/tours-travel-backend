import jwt from "jsonwebtoken"

export const signJWT = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  })

  return token
}

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "You're not authorized" })
  }

  // if token exists then verify the token

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(401).json({ status: "error", message: "Inavlid token" })
    }
    req.user = user
    next()
  })
}

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

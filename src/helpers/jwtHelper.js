import jwt from "jsonwebtoken"

export const signJWT = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  })

  return token
}

export const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res
      .status(401)
      .json({ status: "error", message: "Authentication failed!" })
  }

  // if token exists then verify the token

  jwt.verify(authorization, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(401).json({ status: "error", message: "Inavlid token" })
    }

    req.user = user
    next()
  })
}

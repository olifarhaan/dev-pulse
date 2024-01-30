import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/errors.js"
import { UNAUTHORIZED_MESSAGE } from "../utils/constants.js"

export const verifyToken = (req, res, next) => {
  
  const token = req.cookies.auth_token
  if (!token) {    
    return next(errorHandler(401, UNAUTHORIZED_MESSAGE))
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, UNAUTHORIZED_MESSAGE))
    }
    console.log("Verify Token",user, "---------------------->")

    req.user = user
    next()
  })
}

import { errorHandler } from "../utils/errors.js"
import { UNAUTHORIZED_MESSAGE, roles } from "../utils/constants.js"

export const verifyAdmin = (req, res, next) => {
  console.log("here---------------")

  if (req.user && req.user.role === roles.ADMIN) {
    console.log("first")

    next()
  } else {
    console.log("second")

    return next(errorHandler(401, UNAUTHORIZED_MESSAGE))
  }
}

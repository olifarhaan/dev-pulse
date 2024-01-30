import { errorHandler } from "../utils/errors.js"
import { UNAUTHORIZED_MESSAGE, roles } from "../utils/constants.js"

export const verifyAuthor = (req, res, next) => {
  console.log("inside verify author outside--------------------");
  if (
    req.user &&
    (req.user.role === roles.AUTHOR || req.user.role === roles.ADMIN)
  ) {
    console.log("inside verify author--------------------");
    next()
  } else {
    return next(errorHandler(401, UNAUTHORIZED_MESSAGE))
  }
}

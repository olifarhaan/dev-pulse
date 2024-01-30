const errorHandlerMiddleware = (err, req, res, next) => {
  if (err.name === "MongoError") {
    err.message = "Database error"
  }

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
}
export default errorHandlerMiddleware

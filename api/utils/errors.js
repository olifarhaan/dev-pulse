export const errorHandler = (statusCode, message) => {
    console.log("Inside errorhandler--------------->");
    
  const error = new Error()
  error.statusCode = statusCode
  error.message = message
  return error
}

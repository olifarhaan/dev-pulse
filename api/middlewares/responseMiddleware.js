const responseMiddleware = (req, res, next) => {
  res.jsonResponse = (success, statusCode, message, data = null) => {
    const response = { success, statusCode, message }

    if (data !== null) {
      response.data = data
    }

    return res.json(response)
  }

  next()
}

export default responseMiddleware

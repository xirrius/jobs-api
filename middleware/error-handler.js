const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || `Something went wrong.`
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.message = `Duplicate value entered for field ${Object.keys(err.keyValue)}. Please choose a unique value.`
  }
  if(err.name && err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(err.errors).map(item => item.message).join(', ');
  }
  if(err.name && err.name === 'CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = `No item found with ID ${err.value}`
  }
    return res.status(customError.statusCode).json({msg : customError.message})
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err})
}

module.exports = errorHandlerMiddleware

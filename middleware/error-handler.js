const { StatusCodes } = require('http-status-codes');


const errorMiddlewareHandler = (err, req, res, next) => {
    const customErr = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later'
    }

    if (err.name && err.name === 'ValidationError') {
        customErr.msg = Object.values(err.errors).map((item) => item.message).join(',');
        customErr.statusCode = StatusCodes.BAD_REQUEST;
        
    }

    if (err.code && err.code === 11000) {
        customErr.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
        customErr.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.name && err.name === 'CastError') {
        customErr.msg = `No Item found for id: ${err.value}`
        customErr.statusCode = StatusCodes.NOT_FOUND;
    }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    return res.status(customErr.statusCode).json({ msg: customErr.msg })
}

module.exports = errorMiddlewareHandler;

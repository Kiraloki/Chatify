const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const asyncHandlerPromise = (requestHandler) => {
  // This middleware function wraps the provided requestHandler in a Promise
  // and catches any errors that may occur during its execution.
  return (req, res, next) => {
    // Resolve the Promise with the result of the requestHandler
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // Catch any errors and pass them to the next middleware
  };
};

const asyncHandlerAsyncAwait = (fn) => async (req, res, next) => {
  try {
    // Execute the provided asynchronous function (fn) with the Express request, response, and next parameters
    await fn(req, res, next);
  } catch (error) {
    next(error);
    // If an error occurs during execution, handle it by sending an error response
    //   res.status(error.code || 500).json({
    //     success: false,
    //     message: error.message || "Internal Server Error",
    //   });
  }
};

const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: true,
    });

    // console.log(connection)
    // console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    console.log(`MongoDB Connection Successful `);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  connectToDb,
  generateToken,
  asyncHandlerPromise,
  asyncHandlerAsyncAwait,
};

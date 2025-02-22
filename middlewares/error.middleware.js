const erroMiddleWare = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.messsage = err.messsage;

    console.error(err);

    //Mongoose bad objectID
    if (err.name === "CastError") {
      const messsage = "Resource not found";

      error = new Error(messsage);
      error.statusCode = 404;
    }

    //Mongoose duplicate key
    if (err.code === 11000) {
      const messsage = "Duplicate value enterd";
      error = new Error(messsage);
      error.statusCode = 400;
    }

    //Mongoose validation error
    if (err.name === "ValidationError") {
      const messsage = Object.values(err.errors).map((val) => val.message);
      error = new Error(messsage.join(", "));
      error.statusCode = 400;
    }
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  } catch (error) {
    next(error);
  }
};

export default erroMiddleWare;

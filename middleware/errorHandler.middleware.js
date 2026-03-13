const errorHandler = (err,req,res,next)=>{
  //Determine status code
  const status = err.status || err.statusCode || 500;

  const message= err.message || "Internal Server Error";

  // logging error for dev (in terminal)
  console.error(`[ERROR][${status}]${message}`);
  if(process.env.NODE_ENV !== 'production'){
    console.error(err.stack);
  }

  const errorResponse ={
    success:false,
    status,
    message,
  }

  //only send details when not in prod
  if(process.env.NODE_ENV === 'development'){
    errorResponse.errorDetails = err.details || err.stack
  }
  console.log(message);
  return res.status(status).json(errorResponse);
}

module.exports= errorHandler
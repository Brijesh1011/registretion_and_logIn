const asyncHandler=(requestHandlerfunc)=>{
    return (req,res,next)=>{
      Promise.resolve(requestHandlerfunc(req,res,next))
             .catch((err)=>next(err))
     }
  }
  
  
  export {asyncHandler}
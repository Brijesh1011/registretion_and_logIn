class ApiError extends Error{
    constructor(
        statusCode,
        message="Somthing want wrong",
        errors=[],
        stack=""

    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors

        if(stack){
            this.stack=stack

        }else{
            Error.captureStackTrace(this,this.cnstructor)
        }
    }
}
export {ApiError}
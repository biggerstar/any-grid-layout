import ErrorType from "./ErrorType"

export default class ErrorTypeIndex{
    static index(errName){
        return errName ? ErrorType[errName] : Error
    }
}




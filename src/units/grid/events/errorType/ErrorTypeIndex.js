import ErrorType from "./ErrorType.js"

export default class ErrorTypeIndex{
    static index(errName){
        return errName ? ErrorType[errName] : Error
    }
}




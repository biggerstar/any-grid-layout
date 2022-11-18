import ErrorTypeIndex from "@/units/grid/events/errorType/ErrorTypeIndex.js";

export default class EventCallBack {
    error = null

    constructor(eventCB) {
        //  直接将外部传入的相关事件回调函数挂载到该类中进行管理
        Object.assign(this, eventCB)
    }

    /** 出现错误的回调钩子接口，所有的错误都能由error这个函数接受处理，如果外部没有传入error函数，将会直接抛出错误 */
    _errback_(errName, ...args) {
        if ((typeof this['error']) !== 'function') {
            throw new (ErrorTypeIndex.index(errName))
        } else {
            const errInfo = new (ErrorTypeIndex.index(errName))
            this.error.call(this.error, new (ErrorTypeIndex.index(errName)), ...args)
        }
    }

    /** 成功执行的回调钩子接口 */
    _callback_(cbName, ...args) {
        if (typeof this[cbName] === 'function') {
            this[cbName](...args)
            return true
        } else return false
    }

    /** 不会抛出错误中止执行，使用系统控制台的error方法，可附带对象参数 */
    _error_(errName, msg = '',data = '', ...args) {
        if ((typeof this['error']) === 'function') {
            this.error.call(this.error, {
                name: errName,
                msg: 'getErrAttr=>[name|message|data]  ' + msg,
                data: data
            }, ...args)
        } else console.error(errName,msg,data)
    }
}


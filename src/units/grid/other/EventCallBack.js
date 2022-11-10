import {merge} from "@/units/grid/other/tool.js";
import ErrorTypeIndex from "@/units/grid/errorType/ErrorTypeIndex.js";

export default class EventCallBack {
    type = null
    error = null

    constructor(eventCB) {
        merge(this, eventCB)
    }

    _errback_(errName, ...args) {
        if (typeof this['error'] !== 'function') {
            throw new (ErrorTypeIndex.index(errName))
        } else {
            this.error.call(this.error, new (ErrorTypeIndex.index(errName)), ...args)
        }
    }

    _callback_(cbName, ...args) {
        if (typeof this[name] === 'function') {
            this[name](...args)
            return true
        } else return false
    }


}


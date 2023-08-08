export class EventCallBack {
  error = null
  warn = null

  // emitter = new Emitter()
  constructor(eventCBS: Record<string, Function>) {
    //  直接将外部传入的相关事件回调函数挂载到该类中进行管理
    Object.assign(<object>this, eventCBS)
  }

  /** 成功执行的回调钩子接口 */
  _callback_(cbName: string, ...args: any[]) {
    if (typeof this[cbName] === 'function') {
      return this[cbName](...args)
    }
  }

  /** 不会抛出错误中止执行，使用系统控制台的error方法，可附带对象参数 */
  _error_(errName: string, msg = '', fromData = '', ...args: any[]) {
    if ((typeof this['error']) === 'function') {
      this.error.call(this.error, {
        type: 'error',
        name: errName,
        msg: 'getErrAttr=>[name|type|msg|from]  ' + msg,
        from: fromData    //  来自哪个数据或者实例
      }, ...args)
    } else console.error(errName, msg + '(你可以用error事件函数来接受处理该错误使其不在控制台显示)', fromData)
  }

  /** 不会抛出错误中止执行，使用系统控制台的warn方法，可附带对象参数 */
  _warn_(warnName: string, msg = '', fromData = '', ...args: any[]) {
    if ((typeof this['warn']) === 'function') {
      this.warn.call(this.warn, {
        type: 'warn',
        name: warnName,
        msg: 'getWarnAttr=>[name|type|msg|from]  ' + msg,
        from: fromData    //  来自哪个数据或者实例
      }, ...args)
    } else console.warn(warnName, msg + '(你可以用warn事件函数来接受处理或者忽略该警告使其不在控制台显示)', fromData)
  }
}


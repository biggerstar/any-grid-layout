import {BaseEvent} from "@/plugins";

export class ThrowMessageEvent extends BaseEvent {
  /**
   * 错误类型
   * */
  type: string

  /**
   * 错误信息
   * */
  message: string

  /**
   * 错误来源
   * */
  from: any

  constructor(...args) {
    super(...args);
    const info = args[1] || {}
    const options = info.args?.[0] || {}
    Object.assign(<object>this,options)
  }

}

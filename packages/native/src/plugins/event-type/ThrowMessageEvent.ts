import {BaseEvent} from "@/plugins";

export class ThrowMessageEvent extends BaseEvent {
  /**
   * 错误类型
   * */
  type: string

  /**
   * 错误信息
   * */
  message: string = ''

  /**
   * 错误来源
   * */
  from: any = null
}

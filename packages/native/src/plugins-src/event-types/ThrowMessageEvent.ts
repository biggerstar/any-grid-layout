import {BaseEvent} from "@/plugins-src";

export class ThrowMessageEvent extends BaseEvent {
  /**
   * 错误类型
   * */
  public readonly type?: string

  /**
   * 错误信息
   * */
  public readonly message: string | number = ''

  /**
   * 错误来源
   * */
  public readonly from?: any = null
}

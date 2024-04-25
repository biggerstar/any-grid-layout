import {Container} from "@/main";
import {CustomEventOptions} from "@/types";

export class InstanceBaseEvent {
  [key: string]: any

  public readonly name: keyof CustomEventOptions | '' = ''
  public readonly declare instance: Container    // 当前操作所在的container
  constructor(options: any) {
    Object.assign(this, options || {})   // 合并外部emit发射的参数2对象
  }
}

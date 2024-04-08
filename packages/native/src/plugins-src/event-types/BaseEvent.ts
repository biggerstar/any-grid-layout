import {Container, Item} from "@/main";
import {CustomEventOptions} from "@/types";
import {tempStore} from "@/global";

export class BaseEvent {
  [key: string]: any

  public readonly name: keyof CustomEventOptions | '' = ''

  constructor(options: any) {
    this.item = tempStore.fromItem
    Object.assign(<object>this, options || {})   // 合并外部emit发射的参数2对象
  }

  public readonly container: Container   // 当前操作所在的container
  public declare item: Item | null  // 操作item的时候的目标item
}

import {tempStore} from "@/global";
import {BaseEvent} from "@/plugins-src";
import {Container} from "@/main";

export class MouseGridEvent extends BaseEvent {
  public readonly mousemoveEvent: MouseEvent
  public readonly declare container: Container | null   // 当前操作所在的container

  constructor(opt: any) {
    super(opt)
    this.mousemoveEvent = tempStore.mousemoveEvent
  }
}

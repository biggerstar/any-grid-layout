import {Container} from "@/main";
import {CustomEventOptions} from "@/types";
import {LayoutManager} from "@/algorithm";

export class BaseEvent {
  public name: keyof CustomEventOptions

  constructor(name, options = {}) {
    this.name = name
    Object.assign(<object>this, options)
  }

  public container: Container
  public layoutManager: LayoutManager
  public target: Container
  public isPrevent: boolean = false

  prevent() {
    this.isPrevent = true
  }
}

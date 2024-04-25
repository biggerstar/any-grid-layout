import {InstanceBaseEvent} from "@/plugins-src";
import {Container} from "@/main";

export class ContainerBaseEvent extends InstanceBaseEvent {
  public declare container: Container

  constructor(opt: any) {
    super(opt);
    this.container = this.instance
  }
}

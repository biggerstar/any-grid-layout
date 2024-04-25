import {Item} from "@/main";
import {ContainerBaseEvent} from "@/plugins-src/event-types/base/ContainerBaseEvent";

export class OnItemUnmounted extends ContainerBaseEvent{
  public readonly declare item: Item
}


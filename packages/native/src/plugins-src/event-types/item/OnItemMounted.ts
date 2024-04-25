import {Item} from "@/main";
import {ContainerBaseEvent} from "@/plugins-src/event-types/base/ContainerBaseEvent";


export class OnItemMounted extends ContainerBaseEvent {
  public readonly declare item: Item
}

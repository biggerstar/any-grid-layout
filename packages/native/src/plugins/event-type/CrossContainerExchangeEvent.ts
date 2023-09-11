import {BaseEvent} from "@/plugins";
import {Container} from "@/main";
import {tempStore} from "@/events";

export class CrossContainerExchangeEvent extends BaseEvent {
  fromContainer: Container
  toContainer: Container

  constructor(...args) {
    super(...args);
    const {fromContainer, toContainer} = tempStore
    this.fromContainer = <Container>fromContainer
    this.toContainer = <Container>toContainer
  }
}


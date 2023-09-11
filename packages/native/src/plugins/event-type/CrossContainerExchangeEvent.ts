// noinspection JSUnusedGlobalSymbols

import {ItemLayoutEvent} from "@/plugins";
import {Container} from "@/main";
import {tempStore} from "@/events";

export class CrossContainerExchangeEvent extends ItemLayoutEvent {
  public fromContainer: Container
  public toContainer: Container
  public toGridX: number   // 鼠标位于目标容器内的网格位置
  public toGridY: number   // 同上

  constructor(options) {
    super(options);
    const {fromContainer, toContainer} = tempStore
    this.fromContainer = <Container>fromContainer
    this.toContainer = <Container>toContainer
  }

  public rule?(): void
}


// noinspection JSUnusedGlobalSymbols

import {ItemLayoutEvent} from "@/plugins";
import {Container} from "@/main";
import {CustomItemPos} from "@/types";
import {analysisCurPositionInfo} from "@/algorithm/common/tool";
import {tempStore} from "@/global";

export class CrossContainerExchangeEvent extends ItemLayoutEvent {
  public fromContainer: Container
  public toContainer: Container
  public toGridX: number   // 鼠标位于目标容器内的网格位置
  public toGridY: number   // 同上
  public spacePos: CustomItemPos | null = null   // 当前有空位的pos
  public mousePos: CustomItemPos | null = null   // 当前鼠标所在位置的pos

  constructor(options) {
    super(options);
    const {fromContainer, fromItem, toContainer} = tempStore
    this.fromContainer = <Container>fromContainer
    this.toContainer = <Container>toContainer
    if (!toContainer || !fromItem) return
    const res = analysisCurPositionInfo(toContainer)
    this.toGridX = res.gridX
    this.toGridY = res.gridY
    const manager = toContainer.layoutManager
    let toPos = {
      w: fromItem.pos.w,
      h: fromItem.pos.h,
      x: this.toGridX,
      y: this.toGridY,
    }
    this.mousePos = toPos
    if (!manager.isBlank(toPos)) {
      this.spacePos = <any>this.layoutManager.findBlank({
        w: fromItem.pos.w,
        h: fromItem.pos.h,
      }, {auto: true})
    }
  }

  /**
   * 外部可以修改替换该函数，返回false将不会执行本次跨容器交换行为
   * */
  public rule() {
    return this.mousePos && this.layoutManager.isBlank(this.mousePos)
  }
}


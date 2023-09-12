// noinspection JSUnusedGlobalSymbols

import {CrossContainerExchangeEvent, definePlugin} from "@/plugins";
import {tempStore} from "@/events";
import {isFunction} from "is-what";
import {updateCloneElementSize} from "@/plugins/common";

export const crossContainerExchangeBehavior = definePlugin({
  cross(ev: CrossContainerExchangeEvent) {
    const {fromItem, toContainer, cloneElement, toItem} = tempStore
    if (!toContainer || !fromItem || !cloneElement) return
    const gridItemContent = fromItem.element.querySelector('.grid-item-content')
    if (!fromItem['_mounted'] || !gridItemContent || !ev.mousePos) return
    if (isFunction(ev.rule)) {
      let isMoveTo = ev.rule?.() // 是否移动
      if (isMoveTo === false) return
    }
    const newOptions = {
      ...fromItem.customOptions,
      el: gridItemContent,
    }
    const newItem = toContainer.add(newOptions)
    fromItem.unmount(true)
    if (fromItem.element.isConnected) {
      // 如果fromItem没还载则将新挂载到目标容器的成员移除
      newItem.remove?.()
      return
    }
    newItem.pos.x = ev.mousePos.x
    newItem.pos.y = ev.mousePos.y
    newItem.mount()
    updateCloneElementSize(newItem)
    // console.log(cloneElement.clientWidth , newItem.element.clientWidth);
    fromItem.container.bus.emit('updateLayout')
    if (toItem) toContainer.bus.emit('updateLayout')
    tempStore.fromContainer = toContainer
    tempStore.fromItem = newItem
  },
})

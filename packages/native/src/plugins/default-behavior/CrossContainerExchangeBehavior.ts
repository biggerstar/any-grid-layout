// noinspection JSUnusedGlobalSymbols

import {CrossContainerExchangeEvent, definePlugin} from "@/plugins";
import {tempStore} from "@/events";
import {isFunction} from "is-what";
import {analysisCurPositionInfo} from "@/algorithm/common/tool";

export const crossContainerExchangeBehavior = definePlugin({
  /**
   * 执行cross事件的用户插件前的处理
   * */
  $cross(ev: CrossContainerExchangeEvent) {
    const {toContainer, fromItem} = tempStore
    if (!toContainer || !fromItem) return
    const res = analysisCurPositionInfo(toContainer)
    ev.toGridX = res.gridX
    ev.toGridY = res.gridY
    // console.log(res.gridX, res.gridY)
    ev.rule = function () {  // 外部可以修改替换该函数，返回false将不会执行本次跨容器交换行为
      const manager = toContainer.layoutManager
      if (!manager.isBlank({
        ...fromItem.pos,
        x: res.gridX,
        y: res.gridY,
      })) {
        return false
      }
    }
  },
  cross(ev: CrossContainerExchangeEvent) {
    const {fromItem, toContainer, cloneElement, toItem} = tempStore
    if (!toContainer || !fromItem || !cloneElement) return
    const gridItemContent = fromItem.element.querySelector('.grid-item-content')
    if (!fromItem['_mounted'] || !gridItemContent) return
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

    newItem.pos.x = ev.toGridX
    newItem.pos.y = ev.toGridY
    newItem.mount()
    newItem.domImpl.updateStyle({
      width: `${newItem.element.clientWidth}px`,
      height: `${newItem.element.clientHeight}px`,
      transitionDuration: '0.3s',
      transitionProperty: 'width,height'
    }, cloneElement)
    // console.log(cloneElement.clientWidth , newItem.element.clientWidth);
    fromItem.container.bus.emit('updateLayout')
    if (toItem) {
      toContainer.bus.emit('updateLayout')
    }
    tempStore.fromContainer = toContainer
    tempStore.fromItem = newItem
  },
})

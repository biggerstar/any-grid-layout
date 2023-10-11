// noinspection JSUnusedGlobalSymbols

import {definePlugin, tempStore} from "@/global";
import {BaseEvent} from "@/plugins";
import {isNumber} from "is-what";
import {CustomEventOptions} from "@/types";

const excludeNames: (keyof CustomEventOptions)[] = [
  'config',
  "configResolved",
]

/**
 * every 事件无任何$前缀或后缀等衍生事件
 * */
export const EveryBehavior = definePlugin({
  every(_: BaseEvent & Record<any, any>) {
  },
  everyDone(ev: BaseEvent & Record<any, any>) {
    if (excludeNames.includes(ev.name)) return
    const {container} = ev
    const bus = container.bus
    if (ev.prevented) {
      tempStore.preventedDragging = ev.name === 'dragging'
      tempStore.preventedResizing = ev.name === 'resizing'
    }
    /*-------------检测本次事件之后是否改变了col或者row------------*/
    if (ev.name === 'itemPosChanged') {  // 只有当pos位置发生变化
      const temp = container.__ownTemp__
      const {oldCol, oldRow} = temp
      const col = container.getConfig("col")
      const row = container.getConfig("row")
      if (isNumber(oldCol) && isNumber(oldRow) && isNumber(col) && isNumber(row)) {
        const isColChanged = oldCol !== col
        const isRowChanged = oldRow !== row
        if (ev.name !== 'colChanged' && isColChanged) {
          bus.emit('colChanged')
          temp.oldCol = col
        }
        if (ev.name !== 'rowChanged' && isRowChanged) {
          bus.emit('rowChanged')
          temp.oldRow = row
        }
      }
    }
    /*------------------检测是否改变了pos-------------------------*/
    const {fromItem, lastPosX, lastPosY, lastPosW, lastPosH} = tempStore
    if (fromItem && ev.name !== 'itemPosChanged') {
      if (
        fromItem.pos.x !== lastPosX
        || fromItem.pos.y !== lastPosY
        || fromItem.pos.w !== lastPosW
        || fromItem.pos.h !== lastPosH
      ) {
        bus.emit('itemPosChanged')
      }
    }
  }
})

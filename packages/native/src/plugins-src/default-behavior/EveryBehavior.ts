// noinspection JSUnusedGlobalSymbols

import {definePlugin, tempStore} from "@/global";
import {BaseEvent} from "@/plugins-src";
import {isNumber} from "is-what";
import {CustomEventOptions} from "@/types";

/**
 * 排除暂时不会运行every，everyDone的事件，单纯为了少量性能优化，excludeNames可根据实际情况修改而非固定
 * */
const excludeNames: (keyof CustomEventOptions)[] = [
  'config',
  "configResolved",
  "containerMountBefore",
  "containerMounted",
  "containerUnmounted",
  "addItemSuccess",
  "each",
]

/**
 * every 相关事件无任何$前缀或后缀等衍生事件
 * */
export const EveryBehavior = definePlugin({
  every(_: BaseEvent & Record<any, any>) {
  },
  everyDone(ev: BaseEvent & Record<any, any>) {
    if (excludeNames.includes(ev.name)) {
      return
    }
    const {container} = ev
    const bus = container.bus
    if (ev.prevented) {
    }
    /*-------------检测某次事件之后是否改变了col或者row------------*/
    if (!['colChanged', 'rowChanged'].includes(ev.name)) {  // 只有当pos位置发生变化
      const temp = container.__ownTemp__
      const {oldCol, oldRow} = temp
      const col = container.getConfig("col")
      const row = container.getConfig("row")
      // console.log(col, row)
      if (isNumber(oldCol) && isNumber(oldRow) && isNumber(col) && isNumber(row)) {
        const isColChanged = oldCol !== col
        const isRowChanged = oldRow !== row
        if (isColChanged) {
          bus.emit('colChanged')
        }
        if (isRowChanged) {
          bus.emit('rowChanged')
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

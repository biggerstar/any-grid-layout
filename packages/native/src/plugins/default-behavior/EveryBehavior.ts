// noinspection JSUnusedGlobalSymbols

import {definePlugin, tempStore} from "@/global";
import {BaseEvent, ContainerSizeChangeEvent} from "@/plugins";
import {isNumber} from "is-what";
import {CustomEventOptions} from "@/types";
import {updateContainerSize} from "@/plugins/common";

const excludeNames: (keyof CustomEventOptions)[] = [
  'config',
  "configResolved",
  'colChanged',
  'rowChanged'
]

/**
 * every 事件无任何$前缀或后缀等衍生事件
 * */
export const EveryBehavior = definePlugin({
  every(_: BaseEvent & Record<any, any>) {
  },
  everyDone(ev: BaseEvent & Record<any, any>) {
    if (excludeNames.includes(ev.name)) return
    const {container: ct, col, row} = ev
    if (ev.prevented) {
      tempStore.preventedDragging = ev.name === 'dragging'
      tempStore.preventedResizing = ev.name === 'resizing'
    }
    /*-------------检测本次事件之后是否改变了col或者row------------*/
    const preCol = ct.__ownTemp__.preCol
    const preRow = ct.__ownTemp__.preRow
    if (preCol && preCol && col && row) {
      if (!col || !row) return
      const isColChanged = isNumber(preCol) && preCol !== col
      const isRowChanged = isNumber(preRow) && preRow !== row
      if (isColChanged) {
        ct.bus.emit('colChanged')
        ct.__ownTemp__.preCol = col
      }
      if (isRowChanged) {
        ct.bus.emit('rowChanged')
        ct.__ownTemp__.preRow = row
      }
    }
  },
  colChanged(ev: ContainerSizeChangeEvent) {
    updateContainerSize(ev.container)
  },
  rowChanged(ev: ContainerSizeChangeEvent) {
    updateContainerSize(ev.container)
  }
})

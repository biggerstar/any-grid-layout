// noinspection JSUnusedGlobalSymbols

import {definePlugin, tempStore} from "@/global";
import {ContainerSizeChangeEvent, InitOptionsEvent} from "@/plugins-src";
import {isNumber} from "is-what";
import {getContainerConfigs} from "@/utils";

export const OtherEventBehavior = definePlugin({
  containerMounted$$(ev: InitOptionsEvent) {
    const container = ev.container
    const layout = ev.container.layout
    const col = container.layout.col || container.global.col
    const row = container.layout.row || container.global.row
    const autoGrow = getContainerConfigs(ev.container, "autoGrow")
    let msg = ''
    if (isNumber(col) && autoGrow?.horizontal) {
      msg += '您明确设置了col, autoGrow.horizontal 将不会生效\n'
    }
    if (isNumber(row) && autoGrow?.vertical) {
      msg += '您明确设置了row, autoGrow.vertical 将不会生效\n'
    }
    if (msg) {
      ev.container.bus.emit('warn', {
        message: msg,
        from: layout
      })
    }
  },
  colChanged(ev: ContainerSizeChangeEvent) {
    (ev.container || tempStore.fromContainer)?.updateContainerSizeStyle?.()
  },
  colChanged$$(ev: ContainerSizeChangeEvent) {
    ev.container.__ownTemp__.oldCol = ev.curCol
  },
  rowChanged(ev: ContainerSizeChangeEvent) {
    (ev.container || tempStore.fromContainer)?.updateContainerSizeStyle?.()
  },
  rowChanged$$(ev: ContainerSizeChangeEvent) {
    ev.container.__ownTemp__.oldRow = ev.curRow
  }
})

import {
  BaseEvent,
  ContainerSizeChangeEvent,
  definePlugin,
  GridClickEvent,
  ItemDragEvent,
  ItemLayoutEvent,
  ItemPosChangeEvent,
  ThrowMessageEvent
} from "@biggerstar/layout";
import {isString} from "is-what";
import {insertItemContent} from "./index";
import {reactive} from "vue";

export const createLogController = () => {
  const log = reactive({
    logList: [],
    add(type: string, logText: string | number) {
      if (log.logList.length >= 20) log.logList.shift()
      log.logList.push({
        type,
        log: logText
      })
    },
    reset() {
      log.logList = []
    }
  })
  return log
}

export const createLogPlugin = (logController: ReturnType<typeof createLogController>) => {
  return definePlugin({
    warn(ev: ThrowMessageEvent) {
      logController.add('warn', `${ev.type ? `'[${ev.type}]` : ''}${ev.message}`)
    },
    error(ev: ThrowMessageEvent) {
      logController.add('error', `${ev.type ? `'[${ev.type}]` : ''}${ev.message}`)
    },
    containerMounted(ev: BaseEvent) {
      let selector = ev.container.el
      if (isString(selector)) selector = ''
      logController.add('container-mounted', `容器${selector}已挂载`)
    },
    containerUnmounted(ev: BaseEvent) {
      let selector = ev.container.el
      if (isString(selector)) selector = ''
      logController.add('container-unmounted', `容器${selector}已卸载`)
    },
    containerResizing(ev: BaseEvent) {
      let selector = ev.container.el
      if (isString(selector)) selector = ''
      logController.add('container-resizing', `容器${selector}dom元素调整大小中...`)
    },
    itemMounted(ev: BaseEvent) {
      insertItemContent(ev)
      logController.add('item-mounted', '序号为 ' + ev.item.i + ' 已挂载')
    },
    itemUnmounted(ev: BaseEvent) {
      logController.add('item-unmounted', '序号为 ' + ev.item.i + ' 已卸载')
    },
    itemPosChanged(ev: ItemPosChangeEvent) {
      const {oldX, oldY, item, oldW, oldH} = ev
      let log = ''
      if (ev.type === 'position') log = `x:${oldX},y:${oldY} -> x:${item.pos.x},y:${item.pos.y}`
      else if (ev.type === 'size') log = `w:${oldW},h:${oldH} -> w:${item.pos.w},h:${item.pos.h}`
      logController.add('pos-changed', log)
    },
    dragend(ev: ItemDragEvent) {
      logController.add('dragend', `拖动结束 ${ev.item.i}`)
    },
    resized(ev: ItemDragEvent) {
      logController.add('resized', `resize结束 ${ev.item.i}`)
    },
    closing(ev: ItemLayoutEvent) {
      logController.add('closing', `尝试关闭 ${ev.item.i}`)
    },
    closed(ev: ItemLayoutEvent) {
      logController.add('closed', '已移除item,索引为 ' + ev.item.i)
    },
    colChanged(ev: ContainerSizeChangeEvent) {
      logController.add('col-changed', `oldCol ${ev.oldCol} -> curCol ${ev.curCol}`)
    },
    rowChanged(ev: ContainerSizeChangeEvent) {
      logController.add('row-changed', `oldRow ${ev.oldRow} -> curRow ${ev.curRow}`)
    },
    click(ev: GridClickEvent) {
      logController.add('click', `点击目标为 ${ev.type}, 点击意图 ${ev.action ? ev.action : '无'}`)
    }
  })
}



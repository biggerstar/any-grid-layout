// noinspection JSUnusedGlobalSymbols

import {parseContainer} from "@/utils";
import {TempStore} from '@/store'

const tempStore = TempStore.store
export const prevent = {
  default: (ev) => ev.preventDefault(),
  false: () => false,
  defaultAndFalse: (ev) => {
    ev.preventDefault()
    return false
  },
  contextmenu: (ev) => ev.preventDefault()
}
export const check = {
  resizeOrDrag: (ev: MouseEvent) => {
    const container = parseContainer(ev)
    if (!container) return
    if (tempStore.fromItem?.draggable && tempStore.dragOrResize === 'drag') {
      tempStore.isDragging = true
      tempStore.isResizing = false
      return 'drag'
    } else if (tempStore.fromItem?.resize && tempStore.dragOrResize === 'resize') {
      tempStore.isResizing = true
      tempStore.isDragging = false
      return 'resize'
    } else if (tempStore.dragOrResize === 'slidePage') {
      return 'slidePage'
    }
  }
}
export const windowResize = {
  setResizeFlag: () => tempStore.isWindowResize = true,
  removeResizeFlag: () => tempStore.isWindowResize = false,
}
export const cursor = {
  cursor: 'notFound',
  removeAllCursors: () => {
    document.body.classList.forEach(className => {
      if (className.includes('grid-cursor')) {
        document.body.classList.remove(className)
      }
    })
  },
  default: function () {
    this.removeAllCursors()
    document.body.classList.add('grid-cursor-default')
    this.cursor = 'default'
  },
  inContainer: function () { // 正常是grab才好看
    this.removeAllCursors()
    document.body.classList.add('grid-cursor-in-container')
    this.cursor = 'in-container'
  },
  mousedown: function () { // 正常是grabbing才好看
    this.removeAllCursors()
    document.body.classList.add('grid-cursor-mousedown')
    this.cursor = 'mousedown'
  },
  notDrop: function () {
    this.removeAllCursors()
    document.body.classList.add('grid-cursor-no-drop')
    this.cursor = 'no-drop'
  },
  staticItemNoDrop: function () {
    this.removeAllCursors()
    document.body.classList.add('grid-cursor-static-item')
    this.cursor = 'static-no-drop'
  },
  dragToItemNoDrop: function () {
    this.removeAllCursors()
    document.body.classList.add('grid-cursor-drag-to-item')
    this.cursor = 'drag-to-item-no-drop'
  },
  itemClose: function () {
    this.removeAllCursors()
    document.body.classList.add('grid-cursor-item-close')
    this.cursor = 'item-close'
  },
  itemResize: function () {
    this.removeAllCursors()
    document.body.classList.add('grid-cursor-item-resize')
    this.cursor = 'item-resize'
  },
  removeAllCursor: function () {
    this.removeAllCursors()
    this.cursor = 'notFound'
  },
}

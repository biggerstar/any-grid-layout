// noinspection JSUnusedGlobalSymbols

import {
  cursor_type_default,
  cursor_type_drag_to_item_no_drop,
  cursor_type_in_container,
  cursor_type_item_close,
  cursor_type_item_resize,
  cursor_type_mousedown,
  cursor_type_no_drop,
  cursor_type_not_found,
  cursor_type_static_no_drop,
  grid_cursor_default,
  grid_cursor_drag_to_item,
  grid_cursor_in_container,
  grid_cursor_item_close,
  grid_cursor_item_resize,
  grid_cursor_mousedown,
  grid_cursor_no_drop,
  grid_cursor_PREFIX_HEADER,
  grid_cursor_static_item
} from "@/constant";

export const prevent = {
  default: (ev) => ev.preventDefault(),
  false: () => false,
  defaultAndFalse: (ev) => {
    ev.preventDefault()
    return false
  },
  contextmenu: (ev) => ev.preventDefault()
}

export const cursor = {
  cursor: '',
  removeAllCursors: () => {
    document.body.classList.forEach(className => {
      if (className.includes(grid_cursor_PREFIX_HEADER)) {
        document.body.classList.remove(className)
      }
    })
  },
  default: function () {
    this.removeAllCursors()
    document.body.classList.add(grid_cursor_default)
    this.cursor = cursor_type_default
  },
  inContainer: function () { // 正常是grab才好看
    this.removeAllCursors()
    document.body.classList.add(grid_cursor_in_container)
    this.cursor = cursor_type_in_container
  },
  mousedown: function () { // 正常是grabbing才好看
    this.removeAllCursors()
    document.body.classList.add(grid_cursor_mousedown)
    this.cursor = cursor_type_mousedown
  },
  notDrop: function () {
    this.removeAllCursors()
    document.body.classList.add(grid_cursor_no_drop)
    this.cursor = cursor_type_no_drop
  },
  staticItemNoDrop: function () {
    this.removeAllCursors()
    document.body.classList.add(grid_cursor_static_item)
    this.cursor = cursor_type_static_no_drop
  },
  dragToItemNoDrop: function () {
    this.removeAllCursors()
    document.body.classList.add(grid_cursor_drag_to_item)
    this.cursor = cursor_type_drag_to_item_no_drop
  },
  itemClose: function () {
    this.removeAllCursors()
    document.body.classList.add(grid_cursor_item_close)
    this.cursor = cursor_type_item_close
  },
  itemResize: function () {
    this.removeAllCursors()
    document.body.classList.add(grid_cursor_item_resize)
    this.cursor = cursor_type_item_resize
  },
  removeAllCursor: function () {
    this.removeAllCursors()
    this.cursor = cursor_type_not_found
  },
}

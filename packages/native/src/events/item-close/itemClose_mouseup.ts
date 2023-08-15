import {parseItem} from "@/utils";
import {tempStore} from "@/store";

/** 点击关闭按钮 */
export function itemClose_mouseup(ev) {
  const {mouseDownElClassName, fromItem} = tempStore
  const downTagClassName = mouseDownElClassName
  if (downTagClassName && downTagClassName.includes('grid-item-close-btn')) {
    const target = ev.touchTarget ? ev.touchTarget : ev.target
    if (target.classList.contains('grid-item-close-btn')) {
      const evItem = parseItem(ev)
      if (evItem && evItem === fromItem) {
        const isClose = evItem.container.eventManager._callback_('itemClosing', evItem)
        if (!(isClose === null || isClose === false)) {  // 返回false或者null移除关闭按钮
          evItem.remove(true)
          evItem.container.engine.updateLayout(true)
          evItem.container.eventManager._callback_('itemClosed', evItem)
        }
      }
    }
  }
}

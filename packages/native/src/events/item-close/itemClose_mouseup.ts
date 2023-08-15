import {parseItem} from "@/utils";
import {tempStore} from "@/store";

/** 点击关闭按钮 */
export function itemClose_mouseup(ev) {
  const {fromItem} = tempStore
  const target = ev.touchTarget ? ev.touchTarget : ev.target
  if (target.classList.contains('grid-item-close-btn')) {  // 必须鼠标按下在close元素域内，鼠标抬起也是该元素才允许关闭
    const evItem = parseItem(ev)
    if (evItem && evItem === fromItem) {  // 按下和抬起要同一个item才能关闭
      const isClose = evItem.container.eventManager._callback_('itemClosing', evItem)
      if (!(isClose === null || isClose === false)) {  // 返回false或者null移除关闭按钮
        evItem.remove(true)
        evItem.container.engine.updateLayout(true)
        evItem.container.eventManager._callback_('itemClosed', evItem)
      }
    }
  }
}

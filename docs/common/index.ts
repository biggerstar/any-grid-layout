import {BaseEvent, updateStyle} from "@biggerstar/layout";

export function insertItemContent(ev: BaseEvent) {
  const item = ev.item
  if (!item) return
  if (item.contentElement.innerHTML) return
  item.contentElement.innerHTML = item.i.toString()
  updateStyle({
    fontSize: `${Math.max(30, <number>item.size[0] / 4)}px`,
    fontWeight: '800',
    color: '#6b798e'
  }, item.contentElement)
}

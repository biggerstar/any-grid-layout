import {Container, Item} from "@/main";
import {tempStore} from "@/store";

export function mousemoveExchange(container: Container, itemPositionMethod: Function = null) {
  const fromItem: Item = tempStore.fromItem
  const moveItem: Item = tempStore.moveItem
  if (!tempStore.isDragging || !fromItem || !container || !tempStore.isLeftMousedown) return
  const dragItem: Item = tempStore.moveItem ? moveItem : fromItem
  // console.log(container);
  // console.log(fromItem,fromItem.container.exchange,dragItem.container.exchange,dragItem.exchange);
  // TODO  exchange getConfig
  if (!dragItem.exchange   /* 要求item和容器都允许交换才能继续 */
    || (
      !container.getConfig('exchange')
      || !fromItem.container.getConfig('exchange')
      || !dragItem.container.getConfig('exchange')
    )
  ) return
  try {
    delete dragItem.pos.el
    let dragItemElement = fromItem.element
    const newItem = new Item({
      pos: dragItem.pos,
      el: dragItemElement,  //  将原本pos中的对应文档清除掉换克隆后的
      name: dragItem.name,
      type: dragItem.type,
      draggable: dragItem.draggable,
      resize: dragItem.resize,
      close: dragItem.close,
      transition: dragItem.transition,
      static: dragItem.static,
      follow: dragItem.follow,
      dragOut: dragItem.dragOut,
      resizeOut: dragItem.resizeOut,
      className: dragItem.className,
      dragIgnoreEls: dragItem.dragIgnoreEls,
      dragAllowEls: dragItem.dragAllowEls
    })
    const isExchange = fromItem.container.eventManager._callback_('crossContainerExchange', dragItem, newItem)
    if (isExchange === false || isExchange === null) return   // 通过事件返回值来判断是否继续进行交换

    const doItemPositionMethod = (newItem) => {
      //注意:必须在不同平台Exchange逻辑之后,保证Item添加进去之后再进行位置确定
      // 该函数用于修改确定Item交换之后下次布局更新的位置
      if (typeof itemPositionMethod === 'function') { // 回调拿到newItem
        itemPositionMethod(newItem)
      }
    }
    const vueExchange = () => {
      container._VueEvents['vueCrossContainerExchange'](newItem, tempStore, (newItem) => {
        dragItem.unmount()
        dragItem.remove()
        if (tempStore.deviceEventMode === 'touch' && tempStore.cloneElement) {
          // 在触屏模式下， 原本的fromItem克隆源必须保留在文档流中，所以省事临时放置在该克隆元素中，当鼠标抬起后会被自动移除
          tempStore.cloneElement.appendChild(document.adoptNode(dragItem.element))
        }
        doItemPositionMethod(newItem)
        if (container) {
          if (dragItem !== newItem && !dragItem.container.getConfig('responsive')) {
            dragItem.container.engine.updateLayout([dragItem])
          } else {
            dragItem.container.engine.updateLayout(true)
          }
        }
      })
    }
    const nativeExchange = () => {
      if (container.getConfig('responsive')) newItem.pos.autoOnce = true
      else if (!container.getConfig('responsive')) newItem.pos.autoOnce = false
      container.add(newItem)
      dragItem.unmount()  // 先成功移除原来容器中Item后再在新容器新添加Item，移除不成功不添加
      dragItem.remove()
      if (container) {
        if (!newItem.container.getConfig("responsive")) {
          newItem.container.engine.updateLayout([newItem])
        } else {
          newItem.container.engine.updateLayout(true)
        }
        if (dragItem !== newItem && !dragItem.container.getConfig('responsive')) {
          dragItem.container.engine.updateLayout([dragItem])
        } else {
          dragItem.container.engine.updateLayout(true)
        }
      }
      newItem.mount()
      // dragItem.element.style.backgroundColor = 'red'
      tempStore.moveItem = newItem
      tempStore.fromItem = newItem   // 原Item移除，将新位置作为源Item
      tempStore.exchangeItems.old = dragItem
      tempStore.exchangeItems.new = newItem
      doItemPositionMethod(newItem)
    }
    container.__ownTemp__.firstEnterUnLock = false
    container.__ownTemp__.nestingEnterBlankUnLock = false
    if (container.platform === 'vue') vueExchange()
    else nativeExchange()
  } catch (e) {
    console.error('跨容器Item移动出错', e);
  }
}
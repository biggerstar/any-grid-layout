// noinspection JSUnusedGlobalSymbols

import {CrossContainerExchangeEvent, definePlugin} from "@/plugins";
import {tempStore} from "@/events";

let gridItemContent = null

export const crossContainerExchangeBehavior = definePlugin({
  crossSource(ev: CrossContainerExchangeEvent) {
    const {
      dragItem,
      fromItem,
    } = tempStore
    if (!dragItem || !fromItem) return
    const {toContainer} = ev
    // console.log(dragItem.customOptions);
    let dragItemElement = fromItem.element
    // console.log('crossSource',ev.container);

    gridItemContent = dragItem.element.querySelector('.grid-item-content')

    fromItem.unmount(true)


    // toContainer.add({
    //   ...dragItem.customOptions,
    //   el: dragItemElement,
    // })?.mount()
    // // toContainer.bus.emit('updateLayout')
    // console.log(toContainer.layout.items);

    // return;
    // dragItem.unmount()  // 先成功移除原来容器中Item后再在新容器新添加Item，移除不成功不添加
    // dragItem.remove()
    // newItem.mount()
  },
  crossTarget(ev: CrossContainerExchangeEvent) {
    // console.log('crossTarget',ev.container);
    console.log(gridItemContent)
  }
})

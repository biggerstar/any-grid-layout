// noinspection JSUnusedGlobalSymbols

import {CrossContainerExchangeEvent, definePlugin} from "@/plugins";
import {tempStore} from "@/events";


export const crossContainerExchangeBehavior = definePlugin({
  crossSource(ev: CrossContainerExchangeEvent) {
    const {fromItem} = tempStore
    if (!fromItem || !fromItem) return
    const {toContainer} = ev
    // console.log(fromItem.customOptions);
    // console.log('crossSource',ev.container);

    tempStore.gridItemContent = fromItem.element.querySelector('.grid-item-content')

    fromItem.unmount(true)


    // toContainer.add({
    //   ...fromItem.customOptions,
    //   el: fromItemElement,
    // })?.mount()
    // // toContainer.bus.emit('updateLayout')
    // console.log(toContainer.layout.items);

    // return;
    // fromItem.unmount()  // 先成功移除原来容器中Item后再在新容器新添加Item，移除不成功不添加
    // fromItem.remove()
    // newItem.mount()
  },
  crossTarget(ev: CrossContainerExchangeEvent) {
    const {gridItemContent} = tempStore
    // console.log('crossTarget',ev.container);
    console.log(gridItemContent)
  }
})

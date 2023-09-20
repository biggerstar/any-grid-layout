import container1 from "@/container/container1";
import {
  BaseEvent, CloneElementStyleEvent, Container,
  ContainerSizeChangeEvent,
  definePlugin,
  ItemDragEvent,
  ItemExchangeEvent,
  ItemLayoutEvent,
  ItemPosChangeEvent,
  ItemResizeEvent,
  ResponsiveLayoutPlugin,
  StreamLayoutPlugin,
  ThrowMessageEvent,
  updateStyle,
} from '@biggerstar/layout'
import '@biggerstar/layout/dist/default-style.css'
import '@biggerstar/layout/dist/scroll-bar.css'
import container2 from "@/container/container2";
import container3 from "@/container/container3";

console.log(container1)
console.log(container2)
console.log(container3)


const plugin = definePlugin({
  //-------------throw-message-----------
  error(ev: ThrowMessageEvent) {
    console.log(ev.message)
  },
  warn(ev: ThrowMessageEvent) {
    console.warn(ev.message)
  },
  updateCloneElementSize(ev: CloneElementStyleEvent) {
    // ev.prevent()
  },
  //-----------------container------------------

  containerMounted(ev: BaseEvent) {
    // console.log('containerMounted', ev)
  },
  containerUnmounted(ev: BaseEvent) {
    // console.log('containerUnmounted', ev.container.el)
  },
  containerResizing(ev: ItemLayoutEvent) {
    // console.log(ev);
  },
  containerSizeChanged(ev: ContainerSizeChangeEvent) {
    // console.log('containerSizeChanged',ev.container)
  },
  colChanged(ev: ContainerSizeChangeEvent) {
    // console.log('colChanged',ev.container)
  },
  rowChanged(ev: ContainerSizeChangeEvent) {
    // console.log('rowChanged',ev.container)
  },
  //-------------------item---------------------
  addItemSuccess(ev: BaseEvent) {
    // console.log('addItemSuccess', ev.item)
  },
  itemMounted(ev: BaseEvent) {
    // console.log('itemMounted', ev.item)
    insertItemContent(ev)
  },
  itemUnmounted(ev: BaseEvent) {
    // console.log('itemUnmounted', ev.item)
  },
  itemSizeChange(ev: ItemPosChangeEvent) {
    // console.log(ev);
  },
  itemPositionChange(ev: ItemPosChangeEvent) {
    // console.log(ev);
  },

  //--------------drag-------------------
  dragging(ev: ItemDragEvent) {
    // ev.prevent()
    // console.log('container2',222222222222)
  },
  dragend(ev: ItemDragEvent) {
  },
  dragToTop(ev: ItemDragEvent) {
  },
  dragToRight(ev: ItemDragEvent) {
  },
  dragToBottom(ev: ItemDragEvent) {
    // ev.prevent()
  },
  dragToLeft(ev: ItemDragEvent) {
  },
  dragToLeftTop(ev: ItemDragEvent) {
  },
  dragToRightTop(ev: ItemDragEvent) {
  },
  dragToRightBottom(ev: ItemDragEvent) {
    // ev.prevent()
  },
  dragToLeftBottom(ev: ItemDragEvent) {
    // ev.prevent()
  },
  dragOuterTop(ev: ItemDragEvent) {
  },
  dragOuterRight(ev: ItemDragEvent) {
  },
  dragOuterBottom(ev: ItemDragEvent) {
  },
  dragOuterLeft(ev: ItemDragEvent) {
  },

  //--------------resize-----------------
  resizing(ev: ItemResizeEvent) {
    // ev.prevent()
    // console.log(ev);
    // console.log(111111111111111111)
  },
  resized(ev: ItemResizeEvent) {
  },
  resizeToTop(ev: ItemResizeEvent) {
    // ev.prevent()
  },
  resizeToRight(ev: ItemResizeEvent) {
    // ev.prevent()
  },
  resizeToBottom(ev: ItemResizeEvent) {
    // ev.prevent()
  },
  resizeToLeft(ev: ItemResizeEvent) {
    // ev.prevent()
  },
  resizeOuterTop(ev: ItemResizeEvent) {
  },
  resizeOuterRight(ev: ItemResizeEvent) {
  },
  resizeOuterBottom(ev: ItemResizeEvent) {
  },
  resizeOuterLeft(ev: ItemResizeEvent) {
  },

  //--------------close------------------
  closing(ev: ItemLayoutEvent) {
  },
  closed(ev: ItemLayoutEvent) {
  },

  //-------------cross-container-exchange-----------
  exchange(ev: ItemExchangeEvent) {
    // ev.prevent()
  },
  exchangeProvide(ev: ItemExchangeEvent) {
  },
  exchangeProcess(ev: ItemExchangeEvent) {
  },
  exchangeReceive(ev: ItemExchangeEvent) {
  }
})


function insertItemContent(ev: BaseEvent) {
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

container1
  .use(plugin)
  .use(ResponsiveLayoutPlugin)

container2
  .use(plugin)

container3
  .use(plugin)
  .use(StreamLayoutPlugin)


container1.mount()
container2.mount()
container3.mount()


// setTimeout(()=>{
//     container.unmount()
// },3000)
//
// setTimeout(()=>{
//     container.mount()
// },6000)
//
// setTimeout(()=>{
//     container.unmount()
// },10000)
//
// setTimeout(()=>{
//     container.mount()
// },6000)


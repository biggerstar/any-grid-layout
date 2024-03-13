import container1 from "@/container/container1";
import {
  BaseEvent,
  CloneElementStyleEvent,
  ContainerSizeChangeEvent,
  ItemDragEvent,
  ItemExchangeEvent,
  ItemLayoutEvent,
  ItemPosChangeEvent,
  ItemResizeEvent,
  MatrixEvent,
  ThrowMessageEvent,
  definePlugin,
  updateStyle,
} from '@biggerstar/layout'
import {
  createResponsiveLayoutPlugin,
  createCloseBtnPlugin,
  createShadowElementPlugin, createResizeBtnPlugin
} from '@biggerstar/layout-plugins'
import '@biggerstar/layout/dist/css/default-style.css'
import '@biggerstar/layout/dist/css/scroll-bar.css'
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
  updateCloneElementStyle(ev: CloneElementStyleEvent) {
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
  itemSizeChanged(ev: ItemPosChangeEvent) {
    // console.log(ev);
  },
  itemPositionChanged(ev: ItemPosChangeEvent) {
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
  //--------------close------------------
  closing(ev: ItemLayoutEvent) {
  },
  closed(ev: ItemLayoutEvent) {
  },

  //-------------cross-container-exchange-----------
  exchangeProvide(ev: ItemExchangeEvent) {
  },
  exchangeProcess(ev: ItemExchangeEvent) {
  },
  exchangeReceive(ev: ItemExchangeEvent) {
  },
  each(ev: MatrixEvent) {
    // ev.prevent()
  },
  flip(ev: MatrixEvent) {
    // ev.prevent()
  },
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
  .use(createCloseBtnPlugin())
  .use(createShadowElementPlugin())
  .use(createResizeBtnPlugin())
  // .use(createResponsiveLayoutPlugin())

container2
  .use(plugin)
// .use(createResponsiveLayoutPlugin())

container3
  .use(plugin)
// .use(createStreamLayoutPlugin())


container1.mount()
// container2.mount()
// container3.mount()


container1.layoutManager.each((curRowPoint, curColPoint) => {
  // console.log(curColPoint,curRowPoint);
})


// console.log(container1.items[2],container1.items[2].spaceRight());
// console.log(container1.items[3],container1.items[3].spaceRight());
// console.log(container1.items[4],container1.items[4].spaceRight());








import container1 from "@/container/container1";
import {
  BaseEvent,
  definePlugin,
  ItemDragEvent,
  ItemExchangeEvent,
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
  error(ev: ThrowMessageEvent) {
    console.log(ev.message)
  },
  warn(ev: ThrowMessageEvent) {
    console.warn(ev.message)
  },
  itemMounted(ev: BaseEvent) {
    console.log('itemMounted', ev.item)
    insertItemContent(ev)
  },
  itemUnmounted(ev: BaseEvent) {
    console.log('itemUnmounted', ev.item)
  },
  containerMounted(ev: BaseEvent) {
    console.log('containerMounted', ev)
  },
  containerUnmounted(ev: BaseEvent) {
    console.log('containerUnmounted', ev.container.el)
  },
  resizing(ev: ItemResizeEvent) {
    // ev.prevent()
    // console.log(111111111111111111)
  },
  dragging(ev: ItemDragEvent) {
    // ev.prevent()
    // console.log('container2',222222222222)
  },
  exchange(ev: ItemExchangeEvent) {
    // ev.prevent()
  },
  resizeToBottom(ev: ItemResizeEvent) {
    // ev.prevent()
  },
  resizeToTop(ev: ItemResizeEvent) {
    // ev.prevent()
  },
  resizeToRight(ev: ItemResizeEvent) {
    // ev.prevent()
  },
  resizeToLeft(ev: ItemResizeEvent) {
    // ev.prevent()
  },
  dragToBottom(ev: ItemDragEvent) {
    // ev.prevent()
  },
  dragToLetBottom(ev: ItemDragEvent) {
    // ev.prevent()
  },
  dragToRightBottom(ev: ItemDragEvent) {
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


import container1 from "@/container/container1";
import {
  BaseEvent,
  ItemDragEvent,
  ItemExchangeEvent,
  ItemResizeEvent,
  ResponsiveLayoutPlugin,
  StreamLayoutPlugin,
  ThrowMessageEvent,
} from '@biggerstar/layout'
import '@biggerstar/layout/dist/default-style.css'
import '@biggerstar/layout/dist/scroll-bar.css'
import container2 from "@/container/container2";
import container3 from "@/container/container3";

console.log(container1)
console.log(container2)
console.log(container3)

function insertItemContent(ev: BaseEvent) {
  const item = ev.target
  if (!item) return
  if (item.contentElement.innerHTML) return
  item.contentElement.innerHTML = item.i.toString()
  item.domImpl.updateStyle({
    fontSize: `${Math.max(30, <number>item.size[0] / 4)}px`,
    fontWeight: '800',
    color: '#6b798e'
  }, item.contentElement)
}

container1
  .use({
    resizing(ev: ItemResizeEvent) {
      // console.log(111111111111111111)
    },
    dragging(ev: ItemDragEvent) {
      // console.log('container1',22222222222222)
    },
    itemMounted(ev: BaseEvent) {
      insertItemContent(ev)
    },
    exchange(ev: ItemExchangeEvent) {
      // ev.prevent()
    },
  })
  .use(ResponsiveLayoutPlugin)

container2.use({
  error(ev: ThrowMessageEvent) {
    console.log(ev.message)
  },
  resizing(ev: ItemResizeEvent) {
    // ev.prevent()
    // console.log(111111111111111111)
  },
  dragging(ev: ItemDragEvent) {
    // ev.prevent()
    // console.log('container2',222222222222)
  },
  itemMounted(ev: BaseEvent) {
    insertItemContent(ev)
  },
  exchange(ev: ItemExchangeEvent) {
    // ev.prevent()
  },
  // resizeToBottom(ev: ItemResizeEvent) {
  //   ev.prevent()
  // },
  // resizeToTop(ev: ItemResizeEvent) {
  //   ev.prevent()
  // },
  // resizeToRight(ev: ItemResizeEvent) {
  //   ev.prevent()
  // },
  // resizeToLeft(ev: ItemResizeEvent) {
  //   ev.prevent()
  // }
})

container3.use(StreamLayoutPlugin)


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


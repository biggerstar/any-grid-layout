import container1 from "@/container/container1";
import {BaseEvent, ItemDragEvent, ItemResizeEvent, ResponsiveLayoutPlugin, ThrowMessageEvent,} from '@biggerstar/layout'
import container2 from "@/container/container2";

console.log(container1)
console.log(container2)

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
    }
  })
  .use(ResponsiveLayoutPlugin)

container2.use({
  error(ev: ThrowMessageEvent) {
    console.log(ev.message)
  },
  resizing(ev: ItemResizeEvent) {
    // console.log(111111111111111111)
  },
  dragging(ev: ItemDragEvent) {
    // console.log('container2',222222222222)
  },
  itemMounted(ev: BaseEvent) {
    insertItemContent(ev)
  }
})


container1.mount()
container2.mount()
// container3.mount()


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


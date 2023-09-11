import container1 from "@/container/container1";
import {BaseEvent, Item, ItemDragEvent, ItemResizeEvent, ResponsiveLayoutPlugin,} from '@biggerstar/layout'
import container2 from "@/container/container2";

console.log(container1)
console.log(container2)


container1
  .use({
    resizing(ev: ItemResizeEvent) {
      // console.log(111111111111111111)
    },
    dragging(ev: ItemDragEvent) {
      // console.log('container1',22222222222222)
    },
  })
  .use(ResponsiveLayoutPlugin)

container2.use({
  resizing(ev: ItemResizeEvent) {
    // console.log(111111111111111111)
  },
  dragging(ev: ItemDragEvent) {
    // console.log('container2',222222222222)
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


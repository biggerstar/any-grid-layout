import container1 from "@/container/container1";
import {ResponsiveLayout} from '@biggerstar/layout'
// import  * as DD from '@biggerstar/layout'
// console.log(DD);



console.log(container1)
// console.log(ResponsiveLayout)

container1.use({
  error(ev) {
    // console.log(ev.prevent());
    // console.log(111111111111111111)
    // container1.bus.emit('updateLayout',ev)
  },
  itemResizing(ev) {
    // ev.prevent()
    // console.log(111111111111111111)
  }
})

// container1.use(ResponsiveLayout)


// container.render((data, useLayout, containerElement) => {
//   // console.log(data,useLayout);
//   // container.mountItems(items)
//   console.log(containerElement);
//   data.forEach((item) => {
//     container.add(item)
//   })
// })
container1.mount()


// container1.mount()
// container2.mount()
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


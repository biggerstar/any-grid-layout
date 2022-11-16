import {Container, Item} from '@/units/grid/AnyGridLayout.js'
// import Container from 'any-grid-layout/src/units/grid/Container.js'
import {layoutData, layoutData11} from "@/stores/layout.js";


const container = new Container({
    el: '#container',
    // el: document.getElementById('container'),
    layout: {
        from: '来自layout',
        data: layoutData,
        // data : layoutData11,
        // col: 5,
        // row: 5,
        ratio: 0.2,
        margin: [10, 10],
        // size:[120,80],
        size: [120, 90],
        // minCol: 2,
        // maxCol: 8,
        minRow: 5,
        // maxRow: 8,
        itemLimit: {
            // minW:2,
            // maxH:1,
            // maxW:1,
        },
        dragOut: true,
        exchange: true,
        // sizeWidth: 50,
        // sizeHeight: 80,
        // marginX: 30,
        // marginY: 50,
        // isEdit: false,


        // TODO 高频闪烁问题
    },
    global: {
        responsive:true,
        responseMode:'default',
        // static:true,
        from1: '来自global',
        // transition: true,
        // data: layoutData,
        // margin: [10, 10],
        // size:[160,300],
    }
})

container.mount()
container.edit({
    draggable : true,
    resize:true,
    close:true
})
container.animation(180)
container.follow()

// setTimeout(()=>{
//     container.unmount()
// },3000)
//
// setTimeout(()=>{
//     container.mount()
// },6000)

const container1 = new Container({
    el: '#container1',
    // el: document.getElementById('container'),
    layout2: true,
    layout: {
        from: '来自layout1',
        // ratio: 0.1,
        col:6,
        row:9,
        margin: [10, 10],
        size: [100, 60],
        // minRow: 10,
        // maxRow:6,
        data: layoutData,
        responsive:true,
        minCol: 2,
        // maxCol:6,
        exchange: true,
    },
    event:{
        // error(type){
        //     console.log(type);
        // },
    },
    itemLimit: {
        // minW:2,
        // maxH:1,
        // maxW:1,
    }
})

container1.mount()
container1.edit()
container1.animation()
// container1.follow(false)

const container2 = new Container({
    el: '#container2',
    // el: document.getElementById('container'),
    layout: {
        from: '来自layout2',
        ratio: 0.1,
        col: 9,
        row:9,
        margin: [10, 10],
        size: [60, 50],
        minCol: 2,
        exchange: true,
        data: layoutData11,
        // responsive:true,
    },
    event:{
        // error(type){
        //     // console.log(type);
        // },
    },
})

container2.mount()
container2.edit()
container2.animation()
// container2.follow(true)

const container3 = new Container({
    el: '#container3',
    // el: document.getElementById('container'),
    layout: {
        from: '来自layout3',
        ratio: 0.1,
        col: 6,
        // row:6,
        // margin: [10, 10],
        size:[50,50],
        minCol: 2,
        // maxCol: 6,
        exchange: true,
        responsive:true,
        data: layoutData,

    },
    event:{
        // error(type){
        //     // console.log(type);
        // },
    },
})

container3.mount()
container3.edit()
container3.animation(220)


// setTimeout(()=>{
//     container.edit(false)
//     container1.edit(false)
//     container2.edit(false)
//     container3.edit(false)
// },5000)
//
//
// setTimeout(()=>{
//     container.edit()
//     container1.edit()
//     container2.edit(true)
//     container3.edit(true)
// },10000)
//
// setTimeout(()=>{
//     container.edit(false)
//     container1.edit(false)
//     container2.edit(false)
//     container3.edit(false)
// },15000)


// ######################
window.container = container
window.container1 = container1
window.container2 = container2
window.container3 = container3
setTimeout(() => {
    window.a = ()=>container.engine?.layoutManager?._layoutMatrix
    window.b = ()=>container1.engine?.layoutManager?._layoutMatrix
    window.c = ()=>container2.engine?.layoutManager?._layoutMatrix
    window.d = ()=>container3.engine?.layoutManager?._layoutMatrix
    // console.log(a(),b());
}, 1000)


console.log(container);
console.log(container1);
console.log(container2);
console.log(container3);

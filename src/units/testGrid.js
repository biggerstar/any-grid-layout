import {Container, Item} from '@/units/grid/AnyGridLayout.js'
import {layoutData, layoutData1} from "@/stores/layout.js";





const container = new Container({
    el: '#container',
    // el: document.getElementById('container'),
    layout2:true,
    layout : {
        from:'来自layout',
        // transition: true,
        // data: layoutData,
        col: 6,
        ratio: 0.1 ,
        margin: [10, 10],
        size:[120,80],
        minCol:2,
        maxCol:12,
        // TODO : 移动Container后不能resize
        // sizeWidth: 50,
        // sizeHeight: 80,
        // marginX: 30,
        // marginY: 50,
        // isEdit: false,
        // style:{
        //     opacity:'0.2',
        //     transform:'scale(1.1)',
        // }
    },
    global:{
        responsive:true,
        static:true,
        from1:'来自global',
        // transition: true,
        // data: layoutData,
        // margin: [10, 10],
        // size:[160,300],
        style:{
            opacity:'0.2',
            transform:'scale(1.1)',
        }
    }
})

container.mount()

container.edit({
    draggable : true,
    resize:true
})

container.animation()



const container1 = new Container({
    el: '#container1',
    // el: document.getElementById('container'),
    layout2:true,
    layout : {
        from:'来自layout1',
        ratio: 0.1 ,
        margin: [10, 10],
        size:[180,80],
        minRow:5,
        // maxRow:5,
        data: layoutData,
        minCol:2,
        maxCol:6,

    },
    itemConfig:{
        // minW:2,
        // maxH:3,
    }
})

container1.mount()
container1.edit()
container1.animation()


const container2 = new Container({
    el: '#container2',
    // el: document.getElementById('container'),
    layout : {
        from:'来自layout2',
        ratio: 0.1 ,
        col: 20,
        margin: [10, 10],
        size:[60,50],
        minCol:2,
    }
})

container2.mount()
container2.edit()
container2.animation()


const container3 = new Container({
    el: '#container3',
    // el: document.getElementById('container'),
    layout : {
        from:'来自layout3',
        ratio: 0.1 ,
        col:6,
        // margin: [10, 10],
        // size:[50,50],
        minCol:2,
        maxCol:6,
    }
})

container3.mount()
container3.edit()
container3.animation()


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
window.anyGridLayout = container
console.log(container);
console.log(container1);
console.log(container2);
console.log(container3);

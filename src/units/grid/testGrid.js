import {Container, Item} from '@/units/grid/AnyGridLayout.js'
import tempStore from '@/units/grid/other/TempStore.js'
// import Container from 'any-grid-layout/src/units/grid/Container.js'
import {layoutData, layoutData11} from "@/stores/layout.js";


` 
错误类型
ContainerOverflowError
itemLimitError
ContainerNotMounted
ItemAlreadyRemove

`

const container = new Container({
    el: '#container',
    // el: document.getElementById('container'),
    layout: {
        from: '来自layout',
        data : layoutData11,
        // col: 3,
        // row: 5,
        ratio: 0.2,
        // margin: [10, 10],
        size:[120,80],
        // size: [120, 90],
        minCol: 5,
        // maxCol: 8,
        // minRow: 5,
        // maxRow: 8,
        itemLimit: {
            // minW:1,
            // maxH:1,
            // maxW:1,
        },
        exchange: true,
        // sizeWidth: 50,
        // sizeHeight: 80,
        // marginX: 30,
        // marginY: 50,
        // isEdit: false,
    },
    events : {
        error(err){
            // if (["itemLimitError"].includes(err.name)) return
            console.log(err);
        },
        containerMounted(container){
            // Container成功挂载事件
            // console.log(container)
        },
        containerUnmounted(container){
            // Container成功卸载事件
            // console.log(container);
        },
        itemMounted(item){
            // Item成功挂载事件
            // console.log(item);
            // console.log(container.getItemList())
        },
        itemUnmounted(item){
            // Item成功卸载事件
            // console.log(item);
            // console.log(container.getItemList())
        },
        addItemSuccess(item){

            //Item添加成功事件
            // console.log(item);
        },
        itemResizing(item,w,h){
            //item每次大小被改变时
            // console.log(w,h,item);
        },
        itemResized(item,w,h){
            //item鼠标抬起后在容器中的最终大小
            // console.log(w,h,item);
        },
        itemMoving(item,nowX,nowY){
            //item拖动时在容器内所属位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
            // console.log(nowX,nowY);
        },
        itemMoved(item,nowX,nowY){
            //item拖动结束时在容器内最终位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
            // console.log(item,nowX,nowY);
        },
        crossContainerExchange(oldItem,newItem){
            //交换成功后oldItem会从原Container中卸载,而新Item将会自动添加进新容器中，无需手动添加，返回null或者false将会阻止该次交换
            // console.log(oldItem,newItem);
            // return false
        },
        autoScroll(container,direction,offset){
            // 鼠标移动到容器边界自动滚动时触发，direction是方向X或Y,offset是滚动距离，触发间隔36ms，
            // 返回null或者false取消该次滚动，direction是方向, offset是滚动距离,负值为反方向滚动
            // 可以返回 {direction,offset} 对象临时指定该次滚动的新参数,允许返回{direction}或{offset}修改单个值
            // return {
            //     direction:'X',
            //     offset: -1,
            // }
        },
        itemExchange(fromItem,toItem){
            // 响应式模式中自身容器中的Item交换，fromItem:来自哪个Item，toItem:要和哪个Item交换，返回null或者false将会阻止该次交换
            // console.log(fromItem,toItem);
            // return false
        },
        containerSizeChange(container,oldSize,newSize){
            // 内层容器(grid-container)col或者row大小改变触发的事件,oldSize和newSize包含以下信息{ containerW,containerH,row,col,width,height }
            // console.log(container,oldSize,newSize);
        },
        mountPointElementResizing(container,useLayout,containerWidth){
            // 外层容器(挂载点)大小正在改变时触发的事件(如果是嵌套容器,只会等col和row改变才触发，效果和containerResized一样),
            // containerWidth是当前container的宽度，useLayout是当前使用的布局配置,使用的是实例化时传入的layout字段，
            // 可以直接修改形参useLayout的值或者直接返回一个新的layout对象，框架将会使用该新的layout对象进行布局,返回null或者false将会阻止布局切换
            // 可通过实例属性resizeReactionDelay控制触发间隔
            // console.log(container,containerWidth,useLayout);
            // if (useLayout.margin[0] < 5) return false

        }
    },
    global: {
        responsive:true,
        responseMode:'default',
        dragOut: true,
        exchange: true,
        ratio: 0.2,
        from1: '来自global',
    }
})



const container1 = new Container({
    el: '#container1',
    // el: document.getElementById('container'),
    layout2: true,
    layout1: [
        {
            px: 1300,
            // col:9,
            margin: [30, 30],
            size:[120,80],
            // minCol: 9,
            data: layoutData,
        },
        {
            px: 1100,
            margin: [20, 20],
            size:[90,80],
            // minCol: 7,
            data: layoutData11,
        },
        {
            px: 800,
            margin: [10, 10],
            size:[60,80],
            edit: {    // true或者对象
                draggable:true,
            },
            data: layoutData,
            // minCol: 5,
        },
        {
            px: 360,
            margin: [0, 0],
            size:[36,80],
            edit: {    // true或者对象
                resize:false,
                close:true
            },
            data: layoutData11,
            // minCol: 3,
        },
        //  TODO   第一次mount全部正常(未挂载)，第二次挂载时机(render和container3.mount()保证第一次挂载能运行render)
    ],

    layout: {
        from: '来自layout1',
        // ratio: 0.1,
        col:6,
        row:5,
        margin: [20, 10],
        // size: [100, 60],
        // minRow: 10,
        // maxRow:6,
        // data: layoutData11,
        data: layoutData,
        // responsive:true,
        minCol: 2,
        // maxCol:6,
        exchange: true,
        edit: true,
        animation:true,
        follow:true,
    },
    events:{
        error(err){
            // console.log(err);
        },
        itemMove(item,nowX,nowY){
            // console.log(nowX,nowY);

        },
        itemMoved(item,nowX,nowY){
            // console.log(nowX,nowY);
        },
    },
    itemLimit: {
        // minW:2,
        // maxH:1,
        // maxW:1,
    }
})

const container2 = new Container({
    el: '#container2',
    // el: document.getElementById('container'),
    layout: {
        from: '来自layout2',
        ratio: 0.1,
        col: 9,
        row:39,
        margin: [10, 10],
        size: [60, 50],
        minCol: 2,
        exchange: true,
        data: layoutData,
        // data: layoutData11,
        responsive:true,
        edit: true,
        animation:true,
        follow:true,
    },
    events:{
        // error(type){
        //     // console.log(type);
        // },
    },
})

const container3 = new Container({
    el: '#container3',
    // el: document.getElementById('container'),
    layout: {
        from: '来自layout3',
        ratio: 0.1,
        // col: 6,
        row:6,
        margin: [10, 10],
        size:[50,50],
        // minCol: 2,
        // maxCol: 6,
        exchange: true,
        responsive:true,
        data: layoutData,
        edit: true,
        animation:true,
        follow:true,
    },
    events:{
        // error(type){
        //     // console.log(type);
        // },
    },
})


container.mount()
container.render((data,useLayout,containerElement)=>{
    // console.log(data,useLayout);
    // container.mountItems(items)
    console.log(containerElement);
    data.forEach((item)=>{
        container.add(item).mount()
    })
})

// container.update()


// container1.mount()
// container2.mount()
// container3.mount()


// console.log(new GridContainer());




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


// ######################
window.container = container
window.container1 = container1
window.container2 = container2
window.container3 = container3
window.store = tempStore.containerStore


setTimeout(() => {
    window.a = ()=>container.engine?.layoutManager?._layoutMatrix
    window.b = ()=>container1.engine?.layoutManager?._layoutMatrix
    window.c = ()=>container2.engine?.layoutManager?._layoutMatrix
    window.d = ()=>container3.engine?.layoutManager?._layoutMatrix
    // console.log(a(),b());
}, 1000)

window.edit = (isEdit = true)=>{
    container.edit(isEdit)
    container1.edit(isEdit)
    container2.edit(isEdit)
    container3.edit(isEdit)
}
window.find = (editContainer)=>{
    return editContainer.engine.items.filter((item)=>{
        return item.isEdit
    })
}


console.log(container);
console.log(container1);
console.log(container2);
console.log(container3);

import {Container, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData11} from "@/stores/layout";

const container1 = new Container({
  el: '#container1',
  // el: document.getElementById('container'),
  layouts: {
    responsive: false,
    layoutMode: 'default',
    from: '来自layout',
    items: fillItemLayoutList(layoutData11, {
      draggable: true,
      resize: true,
      close: true,
    }),
    // col: 5,
    row: 8,
    // ratioCol: 0.2,
    // ratioRow: 0.2,
    // marginX:10,
    margin: [20, 20],
    size: [120, 80],
    // sizeWidth:200,
    // minCol: 5,
    // minRow: 10,
    exchange: true,
    // sizeWidth: 50,
    // sizeHeight: 80,
    // marginX: 30,
    // marginY: 50,
    // autoGrowRow:true,
    // autoGrowCol:true
  },
  events: {
    error(err) {
      // if (["itemLimitError"].includes(err.name)) return
      // console.log(err);
    },
    containerMounted(container) {
      // Container成功挂载事件
      // console.log(container)
    },
    containerUnmounted(container) {
      // Container成功卸载事件
      // console.log(container);
    },
    itemMounted(item) {
      // Item成功挂载事件
      // console.log(item);
      // console.log(container.getItemList())
      item.itemContentElement.innerHTML = item.i.toString()
      item.domImpl.updateStyle({
        fontSize: `30px`,
        fontWeight: '800',
        color: '#6b798e'
      }, item.itemContentElement)

    },
    itemUnmounted(item) {
      // Item成功卸载事件
      // console.log(item);
      // console.log(container.getItemList())
    },
    addItemSuccess(item) {

      //Item添加成功事件
      // console.log(item);
    },
    itemResizing(item, w, h) {
      //item每次大小被改变时
      // console.log(w,h,item);
    },
    itemResized(item, w, h) {
      //item鼠标抬起后在容器中的最终大小
      // console.log(w,h,item);
    },
    itemMoving(item, nowX, nowY) {
      //item拖动时在容器内所属位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
      // console.log(nowX,nowY);
    },
    itemMoved(item, nowX, nowY) {
      //item拖动结束时在容器内最终位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
      // console.log(item,nowX,nowY);
    },
    crossContainerExchange(oldItem, newItem) {
      //交换成功后oldItem会从原Container中卸载,而新Item将会自动添加进新容器中，无需手动添加，返回null或者false将会阻止该次交换
      // console.log(oldItem,newItem);
      // return false
    },
    autoScroll(container, direction, offset) {
      // 鼠标移动到容器边界自动滚动时触发，direction是方向X或Y,offset是滚动距离，触发间隔36ms，
      // 返回null或者false取消该次滚动，direction是方向, offset是滚动距离,负值为反方向滚动
      // 可以返回 {direction,offset} 对象临时指定该次滚动的新参数,允许返回{direction}或{offset}修改单个值
      // return {
      //     direction:'X',
      //     offset: -1,
      // }
    },
    itemExchange(fromItem, toItem) {
      // 响应式模式中自身容器中的Item交换，fromItem:来自哪个Item，toItem:要和哪个Item交换，返回null或者false将会阻止该次交换
      // console.log(fromItem,toItem);
      // return false
    },
    containerSizeChange(container, oldSize, newSize) {
      // 内层容器(grid-container)col或者row大小改变触发的事件,oldSize和newSize包含以下信息{ containerW,containerH,row,col,width,height }
      // console.log(container,oldSize,newSize);
    },
    mountPointElementResizing(container, useLayout, containerWidth) {
      // 外层容器(挂载点)大小正在改变时触发的事件(如果是嵌套容器,只会等col和row改变才触发，效果和containerResized一样),
      // containerWidth是当前container的宽度，useLayout是当前使用的布局配置,使用的是实例化时传入的layout字段，
      // 可以直接修改形参useLayout的值或者直接返回一个新的layout对象，框架将会使用该新的layout对象进行布局,返回null或者false将会阻止布局切换
      // 可通过实例属性resizeReactionDelay控制触发间隔
      // console.log(container,containerWidth,useLayout);
      // if (useLayout.margin[0] < 5) return false
    }
  },
  global: {
    responsive: true,
    layoutMode: 'default',
    dragOut: true,
    exchange: true,
    // ratioCol: 0.2,
    from1: '来自global',
  }
});




setTimeout(() => {
  // console.log(container1.containerH++);
  // container1.updateContainerStyleSize()
}, 100)

export default container1

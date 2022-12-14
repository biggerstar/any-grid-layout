<template>
  <div>
    <GridContainer
        class="grid-container"
        style="height: 400px"
        :useLayout="useLayout"
        :events="events"
        :config="config"
        :render="render"
        :layoutChange="layoutChange"
    >
      <gridItem v-for="(item,index) in useLayout.data"
                :key=index
                :pos="item.pos"
                :static="item.static"
                :transition="200"
                :draggable="true"
                :resize="true"
                :close="true"
                :follow="true"
                :dragOut="true"
                :dragIgnoreEls="item.dragIgnoreEls"
                :dragAllowEls="item.dragAllowEls"
      >
        {{ index }}

        <!--        <span>这是允许的按钮</span>-->
      </gridItem>
    </GridContainer>

    <GridContainer
        class="grid-container"
        style="height: 500px"
        :config="config1"
        :useLayout="useLayout1"
        :events="events"
    >
      <gridItem v-for="(item,index) in useLayout1.data"
                style="color: navy"
                :key=index
                :pos="item.pos"
                :draggable=true
                :resize=true
                :close=true
      >
        {{ index }}
      </gridItem>
    </GridContainer>


  </div>
</template>
<script setup>
import {onMounted, ref, reactive, computed, nextTick, watch, toRefs, isReactive} from 'vue'
import {layoutData, layoutData11} from '@/stores/layout.js'
import GridItem from "@/components/GridItem.vue";
import GridContainer from "@/components/GridContainer.vue";


const layoutData1 = layoutData.filter((item, index) => index < 10)
const layoutData2 = layoutData.filter((item, index) => index < 16)
const layoutData3 = layoutData.filter((item, index) => index < 25)
const layoutData4 = layoutData.filter((item, index) => index < 32)
const layoutData5 = layoutData.filter((item, index) => index < 15)


const events = {
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
    // console.log(nowX,nowY);
    //item拖动时在容器内所属位置的nowX和nowY,36ms响应一次，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
    // console.log(nowX,nowY);
  },
  itemMoved(item, nowX, nowY) {
    //item拖动结束时在容器内最终位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
    // console.log(item,nowX,nowY);
  },
  itemMovePositionChange(oldX, oldY, newX, newY) {
    //item位置变化时响应的事件,只有位置变化才触发
    // console.log(oldX,oldY,newX,newY);
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
}
const layouts = [
  {
    px: 1200,
    col: 9,
    // margin: [30, 30],
    // size: [120, 80],
    // minCol: 9,
    data: layoutData1,
  },
  {
    px: 1000,
    // col: 7,
    // margin: [20, 20],
    size: [90, 80],
    // minCol: 7,
    data: layoutData1,
  },
  {
    px: 800,
    col: 6,
    // margin: [10, 10],
    // size: [60, 80],
    data: layoutData1,
  },
  {
    px: 560,
    // col: 6,
    // margin: [20, 20],
    size: [80, 50],
    data: layoutData1,
  },
  {
    px: 360,
    col: 4,
    // margin: [0, 0],
    // size: [36, 80],
    data: layoutData3,
  },
  {
    px: 200,
    col: 3,
    // margin: [5, 5],
    // size: [12, 30],
    data: layoutData,
  },
]
const layouts1 = {
  data: layoutData3,
  // col: 8,
  row: 8,
  ratio: 0.2,
  exchange: true,
  // margin: [10, 10],
  size: [80, 60],
  // minCol: 5,
  // maxCol: 5,
  // minRow: 5,
  // maxRow: 5,
  followScroll: true,
  scrollWaitTime: 800,
  responsive: false,
  itemLimit: {
    // minW: 1,
    // minH: 1,
    // maxH: 1,
    // maxW: 1,
  },
  // sizeWidth: 80,
  // sizeHeight: 80,
  // marginX: 30,
  // marginY: 50,
}
const globalConf = {
  responsive: true,
  row: 6,
  responseMode: 'default',
  exchange: true,
  slidePage: true,
  ratio: 0.2,
}
//  TODO  autoRow
let useLayout = reactive({})
let useLayout1 = reactive({})

const config = reactive({
  layouts,
  global: globalConf
})
const config1 = reactive({
  layouts: layouts1,
  global: globalConf
})

const layoutChange = (currentLayout) => {
  // console.log(currentLayout);
  // console.log(currentLayout.data );
  // useLayout.data = currentLayout.data
  // currentLayout.data[0].static=false
  Object.assign(useLayout, currentLayout)
  // for (let k in currentLayout) {
  //   useLayout[k] = currentLayout[k]
  // }
  // useLayout.data = Object.assign([], currentLayout.data)
}
const render = (currentLayout, layouts) => {
  // console.log(currentLayout.px);
  // Object.assign(useLayout,currentLayout)

  // const data = layoutData.filter((item, index) => {
  //   item.draggable = true
  //   item.resize = true
  //   item.close = true
  //   return index < 10
  // })
  // console.log(currentLayout.px,currentLayout.data);
  Object.assign(useLayout, currentLayout)

  if (!useLayout.data) useLayout.data = []

  // useLayout.data = layoutData

  setTimeout(() => {
    // useLayout.responsive = false
    // console.log(useLayout.sizeWidth);
    // useLayout.sizeWidth++
    // useLayout.data[4].pos.w += 2
    // useLayout.data[4].pos.h += 1
    // console.log(useLayout.data[1]);

  }, 3000)

}


setTimeout(() => {
}, 1000)

setTimeout(() => {
}, 2000)

setTimeout(() => {
}, 3000)

</script>
<style scoped>

/*----------------any-grad-layout相关默认样式------------------*/
/* 仅编辑模式生效   */
/* 鼠标编辑模式默认样式 */
.grid-cursor-default {
  cursor: default;
}

/* 鼠标在容器中的样式 */
.grid-cursor-in-container {
  cursor: grab;
}

/* 鼠标点击时的鼠标样式 */
.grid-cursor-mousedown {
  cursor: grabbing;
}

/* Item移动到Item关闭按钮上的鼠标样式 */
.grid-cursor-item-close {
  cursor: pointer;
}

/* Item移动到resize按钮上的鼠标样式 */
.grid-cursor-item-resize {
  cursor: nw-resize;
}

/* Item拖动时在容器外禁止放置的鼠标样式(该样式只有编辑模式有) */
.grid-cursor-no-drop {
  cursor: no-drop;
}

/* Item拖动时移动到不可放置的静态Item成员上的鼠标样式(该样式只有编辑模式有) */
.grid-cursor-drag-to-item {
  cursor: no-drop;
}

/* 鼠标移动到静态Item上面显示的鼠标样式(该样式只有编辑模式有) */
.grid-cursor-static-item {
  cursor: no-drop;
}


/* ----永久性生效的鼠标样式------  */
/*.grid-item {*/
/*    cursor: move;*/
/*}*/

/*.grid-item:active {*/
/*    cursor: no-drop;*/
/*}*/

/*.grid-container {*/
/*    cursor: grab;*/
/*}*/

/*.grid-item-close-btn {*/
/*    cursor: pointer;*/
/*}*/

/*.grid-item-resizable-handle {*/
/*    cursor: nw-resize;*/
/*}*/

/*------------------------------------------------------*/
/* Container的默认样式,定义宽高会被忽略 */
.grid-container {
  border-radius: 10px;
  background-color: skyblue;
  margin: 50px auto auto;
  overflow: scroll;
}

.grid-container-area {
  height: auto;
  width: 90%;
  box-sizing: border-box;
  position: relative;
  background-color: #5df8eb !important;
  margin: auto;
}

/* 所有Item的默认样式,定义宽高会被忽略 */
.grid-item {
  background-color: rgb(148, 145, 145);
}

/* 拖动(drag)时克隆出来跟随鼠标移动的对应元素 */
.grid-dragging-clone-el {
  opacity: 0.8;
  transform: scale(1.1);
  z-index: 1;
}

/* 点击进行拖动(drag)的来源元素，也就是容器内的Item，正在拖动时候的样式*/
.grid-dragging-source-el {
  opacity: 0.3;
}

/* 重置大小(resize)时克隆出来跟随鼠标移动的对应元素 */
.grid-resizing-clone-el {
  background-color: red;
}

/* 点击进行重置大小(resize)的来源元素，也就是容器内的Item，正在拖动时候的样式*/
.grid-resizing-source-el {
  opacity: 0.3;
}

/* 重置大小(resize)按钮样式 */
.grid-item-resizable-handle {
  font-size: 1.1rem;
}

/* 关闭Item按钮的样式 */
.grid-item-close-btn {
  background-color: skyblue;
}

/* 点击Item按钮的样式 */
.grid-item-close-btn-active {
  background-color: blue;
}

</style>

<template>
  <div>
    <GridContainer
        class="grid-container con"
        style="height: 600px"
        :useLayout="useLayout"
        :events="events"
        :config="config"
        :render="render"
        :layoutChange="layoutChange"
        :containerAPI="containerAPI"
        :components="components"
    >
      <gridItem v-for="(item,index) in useLayout.data"
                :type='item.type ? item.type : "text"'
                :item="item"
                :key="index"
                :pos="item.pos"
                :name="item.name.toString()"
                :static="item.static"
                :nested="item.nested"
                :transition="180"
                :draggable="true"
                :resize="true"
                :close="true"
                :follow="true"
                :dragOut="true"
                :resizeOut="false"
                :dragIgnoreEls="item.dragIgnoreEls"
                :dragAllowEls="item.dragAllowEls"
      >
        {{ item.name + item.static ? 'static' : '' }}
      </gridItem>
    </GridContainer>


    <!--    ////////////////////////////////////////-->
    <!--    <GridContainer-->
    <!--        v-if="true"-->
    <!--        class="grid-container con1"-->
    <!--        style="height: 100vh;width: 100vw"-->
    <!--        :config="config1"-->
    <!--        :useLayout="useLayout1"-->
    <!--        :events="events"-->
    <!--        :components="components"-->
    <!--    >-->
    <!--      <gridItem v-for="(item,index) in useLayout1.data"-->
    <!--                :type='item.type ? item.type : "text"'-->
    <!--                :item="item"-->
    <!--                :key=index-->
    <!--                :pos="item.pos"-->
    <!--                :draggable=true-->
    <!--                :resize=true-->
    <!--                :close=true-->
    <!--                :item1="item"-->
    <!--      >-->
    <!--      </gridItem>-->
    <!--    </GridContainer>-->


  </div>
</template>
<script setup>
import {onMounted, ref, reactive, computed, nextTick, watch, toRefs, isReactive, toRaw, getCurrentInstance} from 'vue'
import {layoutData, layoutData11, layoutData22 as layoutData22} from '@/stores/layout.js'
import Test from "@/components/Test.vue";
import GridContainer from "@/components/GridContainer.vue";
import GridItem from "@/components/GridItem.vue";


const layoutDataConcatName = layoutData.map((pos, index) => {
  pos.name = index
  return pos
})
const layoutData11ConcatName = layoutData11.map((pos, index) => {
  pos.name = index
  return pos
})
const layoutData22ConcatName = layoutData22.map((pos, index) => {
  pos.name = index
  return pos
})
// console.log(layoutData22ConcatName);

const layoutData0 = layoutDataConcatName
const layoutData1 = layoutDataConcatName.filter((item, index) => index < 10)
const layoutData2 = layoutDataConcatName.filter((item, index) => index < 15)
const layoutData3 = layoutDataConcatName.filter((item, index) => index < 25)
const layoutData4 = layoutDataConcatName.filter((item, index) => index < 32)
const layoutData5 = layoutDataConcatName.filter((item, index) => index < 40)

const events = {
  error(err) {
    // if (["itemLimitError"].includes(err.name)) return
    console.log(err);
  },
  warn(warn) {
    // if (["itemLimitError"].includes(err.name)) return
    console.log(warn);
  },
  updated(){
    //  触发条件： items列表长度变化，item的宽高变化，item的位置变化都会触发
  },
  containerMounted(container) {
    // Container成功挂载事件
    // console.log(container)
  },
  containerUnmounted(container) {
    // Container成功卸载事件
    // console.log(container);
  },
  itemClosing(item) {
    //item关闭前事件,返回null或者false阻止关闭
    // console.log(item);
  },
  itemClosed(item) {
    //item关闭后事件
    // console.log(item);
    // updateConfigToDB()
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

  },
  enterContainerArea(container, item) {
    // 当前鼠标按下状态进入的ContainerArea，item是指当前正在操作的Item，如果没有则为null
    // console.log(container, item);
    // console.log(container.row);
    // const container1 = containerAPI.getContainer()
    // container1.row =  container1.row - 1
  },
  leaveContainerArea(container, item) {
    // 当前鼠标按下状态离开的ContainerArea，item是指当前正在操作的Item，如果没有则为null
    // console.log(container, item);
    // console.log(container.row);
    const container1 = containerAPI.getContainer()
    container1.row =  container1.row + 1

  },
  colChange(col, preCol, container) {
    // col列数改变
    // console.log(col,preCol);
  },
  rowChange(row, preRow, container) {
    // row行数改变
    // console.log(row,preRow);
  },
}
const layouts = [
  // {
  //   px: 1200,
  //   // col: 9,
  //   // row: 20,
  //   // margin: [30, 10],
  //   // marginX:50,
  //   marginY: 20,
  //   sizeWidth: 120,
  //   // cover:true,
  //   sizeHeight: 100,
  //   // size:[120,null],
  //   responsive: true,
  //   // autoReorder:true,
  //   // size: [120, 80],
  //   // minCol: 9,
  //   data: layoutData5,
  // },
  // {
  //   px: 1000,
  //   // col: 7,
  //   // margin: [20, 20],
  //   size: [90, 80],
  //   // minCol: 7,
  //   data: layoutData4,
  // },
  {
    px: 820,
    // col: 6,
    // row:4,
    // margin: [50, 30],
    // size: [100, 80],
    // sizeWidth: 60,
    // autoReorder: true,
    responsive: true,
    data: layoutData2,
  },
  {
    px: 560,
    // row: 16,
    // col: 6,
    // margin: [20, 20],
    size: [30, 50],
    data: layoutData2,
  },
  {
    px: 360,
    // col: 4,
    // row:3,
    // margin: [0, 0],
    size: [40, 60],
    // responsive: true,
    data: layoutData1,
  },
  {
    px: 200,
    // col: 3,
    // row:20,
    // margin: [5, 5],
    // size: [12, 30],
    // margin: [null, 5],
    // size: [null, 30],
    // autoReorder:true,
    // responsive: true,
    data: layoutData,
  },
]
const layouts1 = {
  data: layoutData1,
  col: 6,
  row: 8,
  ratioCol: 0.1,
  exchange: true,
  // margin: [10, 10],
  // size: [80, 60],
  margin: [10, 10],
  // size: [null, 60],
  // marginY:10,
  // sizeHeight:60,
  // minCol: 5,
  // maxCol: 5,
  // minRow: 8,
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
  responsive: false,
  responseMode: 'default',
  autoGrowRow: false,
  exchange: true,
  slidePage: true,
  ratioCol: 0.2,
}
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

let container = null
const containerAPI = {}
onMounted(() => {
  // console.log(containerAPI);
  // console.log(containerAPI.getContainer());
  // console.log(containerAPI.exportUseLayout());
  // console.log(containerAPI.exportData());

  nextTick(() => {
  })
})

const components = {
  text: () => import('@/components/ItemView/Text.vue'),
  icon: () => import('@/components/ItemView/Icon.vue'),
  folder: () => import('@/components/ItemView/Folder.vue'),
}


const layoutChange = (layout, fullLayout, layouts) => {
  // console.log(layout);
  // console.log(layout.data );
  // useLayout.data = layout.data
  // layout.data[0].static=false
  // console.log(layout.px,layout,layout.data);
  // console.log(toRaw(useLayout).size);
  Object.assign(useLayout, layout)
  // for (let k in layout) {
  //   useLayout[k] = layout[k]
  // }
  // useLayout.data = Object.assign([], layout.data)
}
const render = (layout, fullLayout, layouts) => {
  // fullLayout = layout
  // console.log(layout.px);
  // Object.assign(useLayout,layout)

  // const data = layoutData.filter((item, index) => {
  //   item.draggable = true
  //   item.resize = true
  //   item.close = true
  //   return index < 10
  // })
  // console.log(layout);
  // useLayout = layout
  // console.log(layout.px, layout.data)
  Object.assign(useLayout, layout)

  if (!useLayout.data) useLayout.data = []

  // useLayout.data = layoutData

  setTimeout(() => {
    // useLayout.responsive = false
    // console.log(useLayout.sizeWidth);
    // useLayout.sizeWidth++
    // useLayout.data[4].pos.w += 2
    // useLayout.data[4].pos.h += 1
    // console.log(useLayout.data[1]);
    // console.log(container);

    // useLayout.col = fullLayout.col++
  }, 3000)

}


setTimeout(() => {
}, 1000)

setTimeout(() => {
}, 2000)

setTimeout(() => {
}, 3000)

</script>
<style>

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
  /*margin: 50px auto auto;*/
  overflow: scroll;
}

.grid-container-area {
  height: auto;
  /*width: 90%;*/
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
  opacity: 0.5;
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
  opacity: 0.8;
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

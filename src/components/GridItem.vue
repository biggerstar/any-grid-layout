<template>
  <div class="grid-item" ref="gridItem">
    <slot></slot>
  </div>
</template>

<script setup>

import {parseContainerFromPrototypeChain} from "@/units/grid/other/tool.js";
import {nextTick, onMounted, ref, toRaw, watch, onUnmounted} from "vue";

const gridItem = ref()
let selfItem = null  // 改Item对应的实例，Item内所有变量都非响应

const props = defineProps({
  //----------------------ItemPos挂载字段-------------------------//
  pos: {
    required: true, type: Object, default() {
      return {
        w: {required: true, type: Number},
        h: {required: true, type: Number},
        x: {required: false, type: Number},
        y: {required: false, type: Number},
        minW: {required: false, type: Number},
        maxW: {required: false, type: Number},
        minH: {required: false, type: Number},
        maxH: {required: false, type: Number},
      }
    }
  },
  static: {required: false, type: Boolean},
  //----------------------Item挂载字段-------------------------//
  transition: {required: false, type: [Boolean, Object, Number]},
  draggable: {required: false, type: Boolean},
  resize: {required: false, type: Boolean},
  close: {required: false, type: Boolean},
  follow: {required: false, type: Boolean},
  dragOut: {required: false, type: Boolean},
  dragIgnoreEls: {required: false, type: Array},
  dragAllowEls: {required: false, type: Array},
})

watch(() => props, () => {
  Object.keys(props).forEach((key) => {
    if (!selfItem) return;
    const val = props[key]
    if (val === undefined) return
    if (['minW', 'maxW', 'minH', 'maxH'].includes(key)) {
      if (typeof val === 'number') selfItem.pos[key] = val
    }
    if (['w', 'h'].includes(key)) {
      if (selfItem.container.responsive) {
        selfItem.pos[key] = val
      }
    }
    if (['x', 'y'].includes(key)) {  // 任何时候加载后不能修改x，y，都是交给引擎管理的
      // if (!selfItem.container.responsive)  selfItem.pos[key] = val
    }
    if (['draggable', 'resize', 'close', 'follow', 'dragOut'].includes(key)) {
      if (typeof val === 'boolean') selfItem[key] = val
    }
    if (['dragIgnoreEls', 'dragAllowEls'].includes(key)) {
      if (Array.isArray(val)) selfItem[key] = val
    }
    if (key === 'static') {
      if (typeof val === 'boolean') selfItem.pos.static = val
    }
    if (typeof val === 'boolean' || typeof val === 'object' || typeof val === 'number') {
      if (key === 'transition') selfItem[key] = val
    }
  })
}, {deep: true})

let container = null

const reSetContainerSize = () => {
  //---------如果当前Item添加之后改变了Container的高度，则重新修改Container高度-----------//
  if (!container) return
  const oldCol = container.col
  const oldRow = container.row
  const nowContainerSize = container.engine.autoSetColAndRows(container)
  if (oldCol !== nowContainerSize.col || oldRow !== nowContainerSize.row) {
    container.updateContainerStyleSize()
  }
}

onMounted(() => {
  const propsRaw = toRaw(props)
  container = parseContainerFromPrototypeChain(gridItem.value)
  // console.log(props.pos);
  selfItem = container.add({
    el: gridItem.value,
    ...propsRaw,
  })
  if (!selfItem) {
    gridItem.value.parentNode.removeChild(gridItem.value)
    return
  }
  selfItem.mount()
  // console.log(selfItem);
  selfItem._VueEvents.vueItemResizing = (fromItem, w, h) => {
    if (props.pos.w && props.pos.w !== w) props.pos.w = w
    if (props.pos.h && props.pos.h !== h) props.pos.h = h
  }
  selfItem._VueEvents.vueItemMovePositionChange = (oldX, oldY, newX, newY) => {
    if (props.pos.x && props.pos.x !== newX) props.pos.x = newX
    if (props.pos.y && props.pos.y !== newY) props.pos.y = newY
  }
  reSetContainerSize()
})

onUnmounted(() => {
  if (selfItem) selfItem.remove()
  reSetContainerSize()
})

</script>
<style>
</style>

<style scoped>
.grid-item {
  height: 100%;
  width: 100%;
  display: block;
  overflow: hidden;
  position: absolute;
}
</style>

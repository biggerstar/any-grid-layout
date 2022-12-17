<template>
  <div class="grid-item" ref="gridItem">
    <slot></slot>
  </div>
</template>

<script setup>

import {parseContainerFromPrototypeChain} from "@/units/grid/other/tool.js";
import {onMounted, ref, toRaw, watch, onUnmounted} from "vue";

const gridItem = ref()
let selfItem = null  // 改Item对应的实例，Item内所有变量都非响应

const props = defineProps({
  //----------------------ItemPos挂载字段-------------------------//
  pos: {
    required: true, type: Object, default: {   // 未有实际效果，为了方便类型
      w: {required: true, type: Number, default: undefined},
      h: {required: true, type: Number, default: undefined},
      x: {required: false, type: Number, default: undefined},
      y: {required: false, type: Number, default: undefined},
      minW: {required: false, type: Number, default: undefined},
      maxW: {required: false, type: Number, default: undefined},
      minH: {required: false, type: Number, default: undefined},
      maxH: {required: false, type: Number, default: undefined},
    }
  },
  //----------------------Item挂载字段-------------------------//
  name: {required: false, type: String, default: undefined},
  transition: {required: false, type: [Boolean, Object, Number], default: undefined},
  static: {required: false, type: Boolean, default: undefined},
  draggable: {required: false, type: Boolean, default: undefined},
  resize: {required: false, type: Boolean, default: undefined},
  close: {required: false, type: Boolean, default: undefined},
  follow: {required: false, type: Boolean, default: undefined},
  dragOut: {required: false, type: Boolean, default: undefined},
  dragIgnoreEls: {required: false, type: Array, default: undefined},
  dragAllowEls: {required: false, type: Array, default: undefined},
  itemAPI: {required: false, type: Object, default: {}}, // 获取Item的实例

})
const watchItemConfig = () => {
  watch(() => props.pos, () => {
    if (!selfItem) return
    Object.keys(props.pos).forEach(key => {
      const posFieldVal = props.pos[key]
      if (!posFieldVal) return
      if (typeof posFieldVal === 'number' || !isNaN(posFieldVal)) {
        if (selfItem.pos[key] === posFieldVal) return   // 值未被改变时忽略
        if (['minW', 'maxW', 'minH', 'maxH'].includes(key)) selfItem.pos[key] = posFieldVal
        if (['w', 'h'].includes(key)) {
         selfItem.pos[key] = posFieldVal
        }
        if (['x', 'y'].includes(key)) {  // 响应式下不能修改x，y，因为是交给引擎管理的
          if (!selfItem.container.responsive) selfItem.pos[key] = posFieldVal
        }
      }
    })
    selfItem.container.updateLayout(true)
  }, {deep: true})
  watch(() => props.transition, (val) => {
    if (typeof val === 'boolean' || typeof val === 'object' || typeof val === 'number') {
      selfItem.transition = val
    }
  }, {deep: true})
  watch(() => props.name, (val) => {
    if (typeof val === 'string') selfItem.name = val
  })
  watch(() => props.static, (val) => {
    if (typeof val === 'boolean') selfItem.static = val
  })
  watch(() => props.draggable, (val) => {
    if (typeof val === 'boolean') selfItem.draggable = val
  })
  watch(() => props.resize, (val) => {
    if (typeof val === 'boolean') selfItem.resize = val
  })
  watch(() => props.close, (val) => {
    if (typeof val === 'boolean') selfItem.close = val
  })
  watch(() => props.follow, (val) => {
    if (typeof val === 'boolean') selfItem.follow = val
  })
  watch(() => props.dragOut, (val) => {
    if (typeof val === 'boolean') selfItem.dragOut = val
  })
  watch(() => props.dragIgnoreEls, (val) => {
    if (Array.isArray(val)) selfItem.dragIgnoreEls = val
  })
  watch(() => props.dragAllowEls, (val) => {
    if (Array.isArray(val)) selfItem.dragAllowEls = val
  })
}


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
  props.pos.autoOnce = !props.pos.x || !props.pos.y
  const doItemCrossContainerExchange = props.pos['doItemCrossContainerExchange']
  delete props.pos['doItemCrossContainerExchange']
  selfItem = container.add({
    el: gridItem.value,
    ...propsRaw,
  })
  if (!selfItem) {   // 溢出状态，没位置删除vue控制的节点并触发vue的onUnmounted钩子
    gridItem.value.parentNode.removeChild(gridItem.value)
    return
  }
  selfItem.updateStyle({
    height: '100%',
    width: '100%',
    display: 'block',
    overflow: 'hidden',
    position: 'absolute'
  },gridItem.value)
  selfItem.mount()

  //-----------------职能函数回调开发者获取到相关参数或信息--------------------//
  props.itemAPI.getItem = ()=> selfItem
  props.itemAPI.exportConfig = ()=> selfItem.exportConfig()   // 获取当前Item的配置参数

  if (typeof doItemCrossContainerExchange === 'function') {
    doItemCrossContainerExchange(selfItem)   // 将生成的最新Item回调给GridContainer组件
  }

  selfItem._VueEvents.vueItemResizing = (fromItem, w, h) => {
    if (props.pos.w && props.pos.w !== w) props.pos.w = w
    if (props.pos.h && props.pos.h !== h) props.pos.h = h
  }
  selfItem._VueEvents.vueItemMovePositionChange = (oldX, oldY, newX, newY) => {
    if (props.pos.x && props.pos.x !== newX) props.pos.x = newX
    if (props.pos.y && props.pos.y !== newY) props.pos.y = newY
  }
  reSetContainerSize()
  watchItemConfig()
})

onUnmounted(() => {
  if (selfItem) selfItem.remove()
  reSetContainerSize()
})

</script>


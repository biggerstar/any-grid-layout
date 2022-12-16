<template xmlns="http://www.w3.org/1999/html">
  <div ref="gridContainer" >
    <div ref="gridContainerArea" class="grid-container-area">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch, nextTick, toRaw} from 'vue'
import {Container} from "@/units/grid/AnyGridLayout.js";
import {cloneDeep} from "@/units/grid/other/tool.js"


const gridContainer = ref(null)
const gridContainerArea = ref(null)

const props = defineProps({
  render: {required: false, type: Function, default: null}, // 若传入该函数初次进行手动渲染，不可直接赋值给useLayout，这样会改变响应式引用地址
  layoutChange: {required: false, type: Function, default: null}, //若传入该函数，布局改变时手动切换布局，不可直接赋值给useLayout，这样会改变响应式引用地址
  getContainer: {required: false, type: Function, default: null}, // 获取Container的实例
  useLayout: {required: true, type: Object, default: null},
  events: {required: false, type: Object},
  config: {
    required: true, type: Object,
    default: {
      layouts: {required: true, type: [Object, Array]},
      global: {required: false, type: Object}
    }
  },
})


const container = new Container({
  platform: 'vue',
  layouts: props.config.layouts,
  events: props.events,
  global: props.config.global
})

let useLayoutConfig = {}
let isLayoutChange = false   // 用于layoutChange的时候锁定data的引用地址和数据不被改变

onMounted(() => {
  container.el = gridContainer.value
  container.engine.init()
  container.vue = props
  container.updateStyle({
    display: 'block',
    background: '#5df8eb'
  },gridContainer.value)
  container.updateStyle({
    position: 'relative',
    display: 'block',
    margin:'0 auto'
  },gridContainerArea.value)

  useLayoutConfig = container.engine.layoutConfig.genLayoutConfig(gridContainer.value.clientWidth)
  gridContainerArea.value._isGridContainerArea = true   // 为gridContainerArea添加标识
  //-------如果指定render则以手动渲染为主，若不指定则使用符合当前布局的配置为主-------//
  const customsLayout = cloneDeep(useLayoutConfig.currentLayout)
  if (props.render === null) {
    Object.assign(props.useLayout, customsLayout)
  } else if (typeof props.render === 'function') {
    props.render(customsLayout,useLayoutConfig.useLayoutConfig, props.config.layouts) // 参数分别是布局档案 用户传入layouts某个符合方案，完整容器构成信息，用户传入的layouts
  }
  container.mount()

  if (typeof props.getContainer === 'function') props.getContainer(container)

  //------------------------------------------------------------------------//
  // if (!window.con) window.con = []
  // console.log(container);
  // window.con.push(container)

  setTimeout(() => {
    const exportData = container.exportData()
    if (props.useLayout['data'] && (props.useLayout['data'].length !== exportData.length)) {   // 两者不等于说明有Item添加不成功，最终结果以网页中已经成功添加的为主
      props.useLayout.data = []
      nextTick(() => {
        useLayoutConfig.layout.data = exportData      //  静态模式可能溢出，此时拿到当前成功添加的Item更新当前使用布局的data数组
        props.useLayout.data = exportData
        container.updateLayout(true)
      })
    }

  })
  container._VueEvents.vueUseLayoutChange = (useLayout) => {
    isLayoutChange = true
    props.useLayout.data = []
    nextTick(() => {
      useLayoutConfig = useLayout
      const customsLayout = cloneDeep(useLayout.currentLayout)   // 隔离用户操作和layout对应的地址引用，用户修改都由watch同步
      for (let k in props.useLayout) {   // (重置数据,下面重定义布局)让vue配置使用当前的layout,原来有现在不在customsLayout中的键去除
        delete props.useLayout[k]
      }
      if (props.layoutChange === null) {
        Object.assign(props.useLayout, useLayout.currentLayout)
      } else if (typeof props.layoutChange === 'function') {
        isLayoutChange = false
        props.layoutChange(customsLayout,useLayout.useLayoutConfig,container.layouts) //  手动配置当前vue要使用的layout，参数分别是布局档案 用户传入layouts某个符合方案，完整容器构成信息，用户传入的layouts
      }
      // console.log(customsLayout.px,customsLayout.data);
    })
  }
  /** 跨容器交换Item用，用于将vue控制的Item位置控制权交给事件处理程序管理 */
  container._VueEvents.vueCrossContainerExchange = (sourceItem, tempStore, doCrossCallback) => {
    const itemConfig = sourceItem.exportConfig()
    if (sourceItem.pos.nextStaticPos) {
      itemConfig.pos.nextStaticPos = sourceItem.pos.nextStaticPos
      itemConfig.pos.x = sourceItem.pos.nextStaticPos.x
      itemConfig.pos.y = sourceItem.pos.nextStaticPos.y
    }
    itemConfig.pos.doItemCrossContainerExchange = (newVueItem) => {    // 不严谨，但是为了方便就临时挂载了,在GridItem使用后会被删除
      tempStore.exchangeItems.old = tempStore.fromItem
      tempStore.exchangeItems.new = newVueItem
      tempStore.moveItem = newVueItem   // 将当前交换操作的Item挂载，便于时间处理程序找到对应的Item成员
      tempStore.fromItem = newVueItem     // 原Item移除，将新位置作为源Item
      doCrossCallback(newVueItem)
      const sourceElementChildren = Array.from(sourceItem.element.childNodes)
      const newVueItemElementChildren = Array.from(newVueItem.element.childNodes)
      const canIgnoreNode = (node) => {
        return (node.classList) && (node.classList.contains('grid-item-resizable-handle')
            || node.classList.contains('grid-item-close-btn'))
      }
      newVueItemElementChildren.forEach(node => {
        if (canIgnoreNode(node)) return
        node.remove()
      })   // 删除新节点所有子节点作为一个空壳
      sourceElementChildren.forEach(node => {
        if (canIgnoreNode(node)) return
        newVueItem.element.appendChild(document.adoptNode(node))   //  将原本交换过来的节点装进空壳节点中，等于把原来所有子节点移动过来了
      })
    }
    props.useLayout['data'].push(itemConfig)
  }
})

watch(props.useLayout, () => {    //  针对非地址引用(地址引用也可)的修改赋值同步到当前使用的layout,for循环存在极小的计算资源浪费
  if (isLayoutChange) return
  for (let key in props.useLayout) {
    const val = props.useLayout[key]
    const valueType = typeof val
    if (!Array.isArray(val) && ['data', 'margin', 'size'].includes(key)) {
      console.error(key, '键应该是一个数组');
    }
    if (valueType !== 'boolean' && ['responsive', 'followScroll', 'exchange', 'slidePage', 'autoGrowRow'].includes(key)) {
      console.error(key, '键应该是一个boolean值');
    }
    if ((valueType !== 'number' || isNaN(val) || !isFinite(val)) && ['col', 'row', 'marginX', 'marginY', 'sizeWidth', 'sizeHeight',
      'minCol', 'maxCol', 'minRow', 'maxRow', 'ratio', 'sensitivity', 'pressTime',
      'scrollWaitTime', 'scrollSpeedX', 'scrollSpeedY', 'resizeReactionDelay'].includes(key)) {
      console.error(key, '键应该是一个非NaN的number值');
    }
    if (valueType !== 'string' && ['responseMode', 'className'].includes(key)) {
      if (key === 'responseMode') {
        console.error(key, '键应该是一个string值', '且有三种布局交换模式，分别是default,exchange,stream');
      } else console.error(key, '键应该是一个string值')
    }
    if (valueType !== 'object' && ['itemLimit'].includes(key)) {
      if (key === 'itemLimit') console.error(key, '键应该是一个object值,包含可选键minW,minH,maxH,maxW作用于所有Item大小限制')
      else console.error(key, '键应该是一个object值')
    }
    // if (key === 'col') console.log(val);
    useLayoutConfig.layout[key] = toRaw(val)
  }
  container.updateLayout(true)
}, {deep: true})


</script>

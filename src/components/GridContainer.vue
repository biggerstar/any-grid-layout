<template xmlns="http://www.w3.org/1999/html">
  <div ref="gridContainer">
    <div class="grid-container-area">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch, getCurrentInstance, nextTick, toRaw, markRaw, isReactive} from 'vue'
import {Container} from "@/units/grid/AnyGridLayout.js";
import {cloneDeep} from "@/units/grid/other/tool.js"

const {ctx} = getCurrentInstance()

const gridContainer = ref(null)
const props = defineProps({
  render: {required: false, type: Function, default: null}, // 若传入该函数初次进行手动渲染，不可直接赋值给useLayout，这样会改变响应式引用地址
  layoutChange: {required: false, type: Function, default: null}, //若传入该函数，布局改变时手动切换布局，不可直接赋值给useLayout，这样会改变响应式引用地址
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
  useLayoutConfig = container.engine.layoutConfig.genLayoutConfig(gridContainer.value.clientWidth)

  //-------如果指定render则以手动渲染为主，若不指定则使用符合当前布局的配置为主-------//
  const realLayout = cloneDeep(useLayoutConfig.currentLayout)
  if (props.render === null) {
    Object.assign(props.useLayout, realLayout)
  } else if (typeof props.render === 'function') {
    props.render(realLayout, props.config.layouts)
  }
  container.mount()
  //------------------------------------------------------------------------//

  if (!window.con) window.con = []
  console.log(container);
  window.con.push(container)

  setTimeout(() => {
    if (props.useLayout['responsive'] === false) {
      const exportData = container.exportData()
      if (props.useLayout['data'].length !== exportData.length) {   // 两者不等于说明有Item添加不成功，最终结果以网页中已经成功添加的为主
        useLayoutConfig.layout.data = exportData      //  静态模式可能溢出，此时拿到当前成功添加的Item更新当前使用布局的data数组
        container.engine.items.forEach((item, index) => {
          props.useLayout['data'][index] = exportData[index]
        })
      }
    }
    container.updateLayout(true)
  })
  container._VueEvents.vueUseLayoutChange = (useLayout) => {
    // useLayoutConfig.layout['data'] = container.exportData()
    isLayoutChange = true
    props.useLayout.data = []
    nextTick(() => {
      useLayoutConfig = useLayout
      const realLayout = cloneDeep(useLayout.currentLayout)   // 隔离用户操作和layout对应的地址引用，用户修改都由watch同步
      if (props.layoutChange === null) {
        for (const k in props.useLayout) {   // 让vue配置使用当前的layout,原来有现在不在realLayout中的键去除
          if (realLayout[k] !== undefined) {
            props.useLayout[k] = realLayout[k]
          } else delete props.useLayout[k]
        }
      } else if (typeof props.layoutChange === 'function') {
        isLayoutChange = false
        props.layoutChange(realLayout) //  手动配置当前vue要使用的layout
      }

      // ctx.$forceUpdate()
    })
  }
})

watch(props.useLayout, (pre, now) => {    //  针对非地址引用(地址引用也可)的修改赋值同步到当前使用的layout,for循环存在极小的计算资源浪费
  if (isLayoutChange) return
  for (let key in props.useLayout) {
    const val = props.useLayout[key]
    const valueType = typeof val
    if (!Array.isArray(val) && ['data', 'margin', 'size'].includes(key)) {
      console.error(key, '键应该是一个数组');
    }
    if (valueType !== 'boolean' && ['responsive', 'followScroll', 'exchange'].includes(key)) {
      console.error(key, '键应该是一个boolean值');
    }
    if (valueType !== 'number' && ['col', 'row', 'marginX', 'marginY', 'sizeWidth', 'sizeHeight',
      'minCol', 'maxCol', 'minRow', 'maxRow', 'ratio', 'sensitivity', 'pressTime',
      'scrollWaitTime', 'scrollSpeedX', 'scrollSpeedY', 'resizeReactionDelay'].includes(key)) {
      console.error(key, '键应该是一个number值');
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

    useLayoutConfig.layout[key] = toRaw(val)
  }
  container.updateLayout(true)
}, {deep: true})


</script>

<style>

.grid-container-area {
  width: 100%;
  height: auto;
  margin: auto;
  box-sizing: border-box;
  position: relative;
  background: #5df8eb;
}

</style>

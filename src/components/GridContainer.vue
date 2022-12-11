<template xmlns="http://www.w3.org/1999/html">
  <div ref="gridContainer">
    <div class="grid-container-area">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch, getCurrentInstance} from 'vue'
import {Container} from "@/units/grid/AnyGridLayout.js";

const gridContainer = ref(null)
const props = defineProps({
  render: {required: true, type: Function},
  layoutChange: {required: false, type: [Function], default: () => null},
  events: {required: false, type: Object},
  useLayout: {required: true, type: Object},
  config: {
    required: true, type: Object,
    default() {
      return {
        layouts: {required: true, type: [Object, Array]},
        global: {required: false, type: Object}
      }
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

onMounted(() => {
  container.el = gridContainer.value
  container.engine.init()
  container.vue = props
  useLayoutConfig = container.engine.layoutConfig.genLayoutConfig(gridContainer.value.clientWidth)

  if (typeof props.render === "function") {
    props.render(useLayoutConfig.currentLayout, props.config.layouts)
    container.mount()
  }

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

  container._VueEvents.vueUseLayoutChange = (currentLayout,layout) => {
    props.useLayout.data = []
    if (props.layoutChange === null) {
      Object.assign(props.useLayout, currentLayout)
    } else if (typeof props.layoutChange === 'function') props.layoutChange(currentLayout)
  }
})

watch(props.useLayout, () => {
  for (let key in props.useLayout) {
    // if (key === 'data') continue
    useLayoutConfig.layout[key] = props.useLayout[key]
  }
  container.updateLayout(true)
})


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

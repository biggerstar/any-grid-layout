<template>
  <br/>
  <Presentation
    v-if="showPresentation"
    ref="presentationRef"
    :control-options="containerControlOpt"
    :container="container"
    :show-container="false"
    :show-pos-detail='true'
    :show-container-detail="true"
    :log-controller="logController"
  ></Presentation>
  <div style="margin-top: 50px">
    <a-resize-box
      style="  height:100%;width:100%"
      :directions="['right', 'bottom']"
      :style="{ minWidth: '120px',minHeight:'120px'}"
      v-model:width="resizeBoxSizeWidth"
    >
      <div id="basic-container"></div>
    </a-resize-box>
  </div>
</template>

<script setup lang="ts">
import '@biggerstar/layout/dist/default-style.css'
import '../theme/css/grid-layout.css'
import {onMounted, onUnmounted, reactive, ref} from "vue";
import Presentation from "./Presentation.vue";
import {cloneDeep, Container, createResponsiveLayoutPlugin, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData} from "../store/layout";
import {createLogController, createLogPlugin} from "../../common/printLogPlugin";

const resizeBoxSizeWidth = ref(600)
const resizeBoxSizeHeight = ref(300)

const showPresentation = ref(false)
const presentationRef = ref<Presentation>()
let logController = createLogController()

let container: Container = new Container({
  el: '#basic-container',
  layouts: {
    autoGrow: {
      vertical: true,
    },
    // col: 8,
    // row: 6,
    // marginX:10,
    // marginY:10,
    sizeWidth: 80,
    sizeHeight: 50,
    // direction: 'row',
    // align: 'start',
    items: fillItemLayoutList(layoutData, {
      draggable: true,
      resize: true,
      close: true,
    }),
    // sizeWidth:80,
    // margin: [5, 5],
    // size: [80, 50],
  },
})
container.use(createResponsiveLayoutPlugin())

/** 是否已经是最小生成布局配置 */
function isMinimumLayoutGenConfiguration(layout: typeof container.layout, excludeName?: keyof typeof container.layout) {
  layout = cloneDeep(layout)
  if (excludeName) delete layout[excludeName]
  const has = (name: keyof typeof container.layout) => layout.hasOwnProperty(name)
  const colDirection = has("col") || layout.margin?.[0] || layout.size?.[0] || has("sizeWidth") || has("marginX")
  const rowDirection = has("row") || layout.margin?.[1] || layout.size?.[1] || has("sizeHeight") || has("marginY")
  const isMinimumOpt = !(colDirection && rowDirection)
  if (isMinimumOpt) {
    logController.add('log', `已经是最小生成布局配置,无法移除${excludeName}配置字段`)
  }
  return isMinimumOpt
}


const autoMaticControl = {
  col: {
    type: 'switch',
    active: false,
    text: '提供col',
    handler: (status: boolean) => {
      if (isMinimumLayoutGenConfiguration(container.layout, "col")) return autoMaticControl.col.active = true
      if (status) {
        container.layout.col = 8
        container.remount()
        logController.add('log', '修改col 的值为8')
      } else {
        delete container.layout.col
        container.remount()
        logController.add('log', '移除 col 设置，将动态计算 col')
      }
    }
  },
  row: {
    type: 'switch',
    active: false,
    text: '提供row',
    handler: (status: boolean) => {
      if (isMinimumLayoutGenConfiguration(container.layout, "row")) return autoMaticControl.row.active = true
      if (status) {
        container.layout.row = 6
        container.remount()
        logController.add('log', '修改 row 的值为6')
      } else {
        delete container.layout.row
        container.remount()
        logController.add('log', '移除 row 设置，将动态计算 row')
      }
    }
  },
  marginX: {
    type: 'switch',
    active: false,
    text: '提供marginX',
    handler: (status: boolean) => {
      if (isMinimumLayoutGenConfiguration(container.layout, "marginX")) return autoMaticControl.marginX.active = true
      if (status) {
        container.layout.marginX = 10
        container.remount()
        logController.add('log', '修改 marginX 的值为10')
      } else {
        delete container.layout.marginX
        container.remount()
        logController.add('log', '移除 marginX 设置，将动态计算 marginX')
      }
    }
  },
  marginY: {
    type: 'switch',
    active: false,
    text: '提供marginY',
    handler: (status: boolean) => {
      if (isMinimumLayoutGenConfiguration(container.layout, "marginY")) return autoMaticControl.marginY.active = true
      if (status) {
        container.layout.marginY = 10
        container.remount()
        logController.add('log', '修改 marginY 的值为10')
      } else {
        delete container.layout.marginY
        container.remount()
        logController.add('log', '移除 marginY 设置，将动态计算 marginY')
      }
    }
  },
  sizeWidth: {
    type: 'switch',
    active: true,
    text: '提供sizeWidth',
    handler: (status: boolean) => {
      if (isMinimumLayoutGenConfiguration(container.layout, "sizeWidth")) return autoMaticControl.sizeWidth.active = true
      if (status) {
        container.layout.sizeWidth = 80
        container.remount()
        logController.add('log', '修改 sizeWidth 的值为80')
      } else {
        delete container.layout.sizeWidth
        container.remount()
        logController.add('log', '移除 sizeWidth 设置，将动态计算 sizeWidth')
      }
    }
  },
  sizeHeight: {
    type: 'switch',
    active: true,
    text: '提供sizeHeight',
    handler: (status: boolean) => {
      if (isMinimumLayoutGenConfiguration(container.layout, "sizeHeight")) return autoMaticControl.sizeHeight.active = true
      if (status) {
        container.layout.sizeHeight = 50
        container.remount()
        logController.add('log', '修改 sizeHeight 的值为50')
      } else {
        delete container.layout.sizeHeight
        container.remount()
        logController.add('log', '移除 sizeHeight 设置，将动态计算 sizeHeight')
      }
    }
  },
}
const containerControlOpt = reactive(autoMaticControl)

onMounted(() => {
  container.use(createLogPlugin(logController))
  showPresentation.value = true
  console.log(container)
  container.mount()
})

onUnmounted(() => {
  container.unmount()
})
</script>

<style scoped>
#basic-container {
  /*width: 600px;*/
  /*height: 300px;*/
  width: 100%;
  height: 100%;
  text-align: start;
  z-index: 1;
  position: relative;
}

:deep(.arco-resizebox-trigger-vertical) {
  z-index: 2;
}

:deep(.arco-resizebox-trigger-horizontal) {
  z-index: 2;
}
</style>

<template>
  <br/>
  <Presentation
    v-if="showPresentation"
    ref="presentationRef"
    :container="container"
  ></Presentation>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import Presentation from "./Presentation.vue";
import {Container, EachMiddlewareType, fillItemLayoutList, MatrixEvent, PointType} from "@biggerstar/layout";
import {layoutSameSizeData} from "../store/layout.js";
import {createLogController, createLogPlugin} from "../../common/printLogPlugin.js";

const showPresentation = ref(false)
const presentationRef = ref<Presentation>()
let container: Container = new Container({
  el: '#basic-container1',
  layouts: {
    autoGrow: {
      vertical: true,
      // horizontal: true,
    },
    items: fillItemLayoutList(layoutSameSizeData, {
      draggable: true,
      resize: true,
      close: true,
    }),
    margin: [5, 5],
    size: [80, 50],
  },
})

function createRowTraverseInfo(p1: PointType, p2: PointType): EachMiddlewareType {
  return {
    stepCol: 1,
    stepRow: 1,
    startRow: Math.min(p1[1], p2[1]),
    endRow: Math.max(p1[1], p2[1]),
    startCol: Math.min(p1[0], p2[0]),
    endCol: Math.max(p1[0], p2[0]),
  }
}

let logController = createLogController()
onMounted(() => {
  container.use({
    each(ev: MatrixEvent) {
      ev.prevent()
      // console.log(ev);
      const container = ev.container
      const manager = container.layoutManager
      const matrixCol = manager.col
      const matrixRow = manager.row
      const info = createRowTraverseInfo(ev.point1, ev.point2)
      let coverMatrix = false  // 是否覆盖全矩阵
      if (info.startCol === 0 && info.endCol === matrixCol - 1
        && info.startRow === 0 && info.endRow === matrixRow - 1) {
        coverMatrix = true
      }

      Outer:for (let i = info.startRow; i <= info.endRow; i++) {
        const singular = !!(i % 2)  //是否是单数
        // console.log(i, singular)
        if (!singular) {
          for (let j = info.startCol; j <= info.endCol; j++) {
            // console.log(i, j)
            const isBreak = ev.next(i, j)
            if (isBreak) break Outer
          }
        } else {
          for (let j = info.endCol; j >= info.startCol; j--) {
            const isBreak = ev.next(i, j)
            if (isBreak) break Outer
          }
        }
      }
    },
  })
  container.use(createLogPlugin(logController))
  showPresentation.value = true
  console.log(container)
})

onUnmounted(() => {
  container.unmount()
})


</script>

<style scoped>

</style>

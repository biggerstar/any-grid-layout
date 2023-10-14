<template>
  <div id="container1" class="container"></div>
  <!--  <div id="container2" class="container"></div>-->
</template>

<script setup lang="ts">
import {BaseEvent, Container, createResponsiveLayoutPlugin, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData, layoutSameSizeData} from "../store/layout.js";
import {onMounted, onUnmounted} from "vue";
import {insertItemContent} from "../../common";

let container1: Container = new Container({
  el: '#container1',
  layouts: {
    autoGrow: {
      horizontal: true,
    },
    exchange: true,
    items: fillItemLayoutList(layoutData, {
      draggable: true,
      resize: true,
      close: true,
      exchange: true,
    }),
    margin: [5, 5],
    size: [80, 50],
    minRow: 7,
  },
})


let container2: Container = new Container({
  el: '#nesting',
  layouts: {
    autoGrow: {
      vertical: true,
    },
    exchange: true,
    items: fillItemLayoutList(layoutSameSizeData.slice(0, 8), {
      draggable: true,
      resize: true,
      close: true,
      exchange: true,
    }),
    // col: 5,
    margin: [3, 3],
    size: [50, 50],
  },
})

onMounted(() => {
  container1.use({
    itemMounted(ev: BaseEvent) {
      insertItemContent(ev)
    }
  }).mount()

  container2.use({
    itemMounted(ev: BaseEvent) {
      insertItemContent(ev)
    }
  })
  container2.use(createResponsiveLayoutPlugin())
  container2.mount()
  container2.parentItem.draggable = false

  onUnmounted(() => {
    container1.unmount()
    container2.unmount()
  })
})


</script>

<style scoped>
.container {
  margin: 50px 0;
  width: 80%;
  min-height: 300px;
}
</style>

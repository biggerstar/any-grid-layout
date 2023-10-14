<template>
  <div id="container1" class="container"></div>
  <div id="container2" class="container"></div>
</template>

<script setup lang="ts">
import {BaseEvent, Container, createResponsiveLayoutPlugin, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData, layoutSameSizeData} from "../store/layout.js";
import {onMounted} from "vue";
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
  el: '#container2',
  layouts: {
    autoGrow: {
      vertical: true,
    },
    exchange: true,
    items: fillItemLayoutList(layoutSameSizeData, {
      draggable: true,
      resize: true,
      close: true,
      exchange: true,
    }),
    col: 5,
    minRow: 7,
    margin: [5, 5],
    size: [120, 80],
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
})


</script>

<style scoped>
.container {
  margin: 50px 0;
  width: 80%;
  min-height: 300px;
}
</style>

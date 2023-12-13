<template>
  <br/>
  <a-button @click="reloadAnimation">执行</a-button>
  <Presentation
    v-if="showPresentation"
    ref="presentationRef"
    :container="container"
  ></Presentation>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {layoutData} from "../store/layout";
import {Container, fillItemLayoutList} from '@biggerstar/layout'
import '@biggerstar/layout/dist/default-style.css'
import '../theme/css/grid-layout.css'
import Presentation from "./Presentation.vue";
import {createLogController, createLogPlugin} from "../../common/printLogPlugin";
import gsap from 'gsap'

const showPresentation = ref(false)
const presentationRef = ref<Presentation>()
let container: Container = new Container({
  el: '#basic-container',
  layouts: {
    autoGrow: {
      vertical: true,
      // horizontal: false,
    },
    // direction: 'row',
    // align: 'start',
    items: fillItemLayoutList(layoutData, {
      draggable: true,
      resize: true,
      close: true,
    }),
    margin: [5, 5],
    size: [80, 50],
  },
})
let logController = createLogController()

function render() {
  container.use(createLogPlugin(logController))
  showPresentation.value = true
  console.log(container)
  setTimeout(() => reloadAnimation())
}

onMounted(() => render())
onUnmounted(() => container.unmount())

function reloadAnimation() {
  gsap.from('.grid-item', {
    y: -20,
    stagger: 0.03
  })
}
</script>

<style scoped>
</style>

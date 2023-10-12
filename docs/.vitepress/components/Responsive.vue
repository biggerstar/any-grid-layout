<template>
  <br/>
  <Presentation
    v-if="showPresentation"
    ref="presentationRef"
    :control-options="containerControlOpt"
    :container="container"
    :show-pos-detail='true'
    :log-controller="logController"
  ></Presentation>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import Presentation from "./Presentation.vue";
import {Container, createResponsiveLayoutPlugin, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData} from "../store/layout.js";
import {createLogController, createLogPlugin} from "../../common/printLogPlugin.js";
import {createContainerControl} from "../../common/containerControl.js";

const showPresentation = ref(false)
const presentationRef = ref<Presentation>()
let container: Container = new Container({
  el: '#basic-container',
  layouts: {
    autoGrow: {
      vertical: true,
      horizontal: true,
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
const containerControlOpt = createContainerControl(container)
onMounted(() => {
  container.use(createResponsiveLayoutPlugin())
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

<template>
  <br/>
  <Presentation
    v-if="showPresentation"
    ref="presentationRef"
    :control-options="containerControlOpt"
    :container="container"
    :show-container-detail="true"
    :show-pos-detail='true'
    :log-controller="logController"
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
import {createContainerControl} from "../../common/containerControl";

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
const containerControlOpt = createContainerControl(container)
onMounted(() => {
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

<template xmlns="http://www.w3.org/1999/html">
  <div class="vue3-grid-container" :style="genContainerStyle()" >
    <slot></slot>
  </div>
</template>

<script setup >
import gridItem from "@/components/GridItem.vue";
import {onMounted, ref, reactive, computed, nextTick, watch, toRefs, isReactive, onUnmounted} from 'vue'

const { manager } = defineProps({ manager:{ required:true, type:Object } })
const layoutManager = manager

console.log('gridContainer运行');
console.log( layoutManager);

onMounted(() => {
  onScreenResize()
})
onUnmounted(()=>{
  layoutManager['unload']()
})

const genContainerStyle = () => {
  return {
    gridTemplateColumns: `repeat(${layoutManager["colNum"]},${layoutManager["size"][0]}px)`,
    gridAutoRows: `${layoutManager["size"][1]}px`,
    gap: `${layoutManager["margin"][0]}px ${layoutManager["margin"][1]}px`,
  }
}

const computedColumNum = () => {
  let colSizePx = size[0]
  const gridContainer = document.getElementById('grid-container')
  return Math.round(gridContainer.clientWidth / (colSizePx + layoutConfig.rowSizePx))
}
const computedRowNum = () => {
  let colSizePx = size[1]
  const gridContainer = document.getElementById('grid-container')
  console.log(gridContainer);
  return Math.round(gridContainer.clientHeight / (colSizePx + layoutConfig.colSizePx))
}

const onScreenResize = () => {
  window.onresize = (ev) => containerResize(ev)
}

const containerResize = (event) => {
  // if (!isShowContainer.value) return
  // console.log(gridLayoutConfig.computedRowNum(), gridLayoutConfig.computedColumNum());

}


</script>

<style scoped>
.vue3-grid-container{
  display: grid;
  background-color: #2196F3;
  place-content: center;

}

</style>

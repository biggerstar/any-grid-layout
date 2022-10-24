<template>
  <div>
    <button @click='reLoadContainer()'>刷新组件</button>
    <button @click='LM.addItem({h:2,w:2})'>添加组件</button>
    <br/>
    <button @click='LM.addRow()'>addRow</button>
    <span>添加和删除栅格行数{{ LM._layoutMatrix.length }}</span>
    <button @click='LM.removeOneRow()'>removeOneRow</button>
    <br/>
    <button @click='LM.columNum++'>marginX++</button>
    <span>margin:{{ LM.columNum }}</span>
    <button @click='LM.columNum++'>marginY++</button>

    <br/>
  </div>
  <br/>
  <div v-for="item in LM._layoutMatrix">{{ item }}</div>
  <br/>
  <div v-if="isShowContainer">
    <GridContainer :manager='LM'>
      <gridItem v-for="item in LM.gridLayout()" :class="'vue3-grid-item' + item.i" :itemData='item'>
      </gridItem>
    </GridContainer>
    <div id="container"></div>


  </div>
</template>
<script setup>
import {onMounted, ref, reactive, computed, nextTick, watch, toRefs, isReactive} from 'vue'
import {layoutData} from '@/stores/layout.js'
import LayoutManager from '@/units/dom/algorithm/LayoutManager.js'

console.log('index运行');

let LM = new LayoutManager(reactive({
  el:'container',
  data: layoutData,
  columNum: 8,
  rowNum: 4,
  size: [80, 80],
  margin: [10, 10],
}))

// LM.load()

console.log('LM', LM);


const containerResize = (event) => {
  if (!isShowContainer.value) return
  console.log(gridLayoutConfig.computedRowNum(), gridLayoutConfig.computedColumNum());

}
const removeItem = event => {
  const itemEl = event.target
  if (itemEl.classList.contains('grid-item')) {
    itemEl.parentElement.removeChild(event.target)
  }
}
const isShowContainer = ref(true)
const reLoadContainer = () => {
  isShowContainer.value = false
  nextTick(() => {
    isShowContainer.value = true
  })
}


</script>
<style scoped>
</style>

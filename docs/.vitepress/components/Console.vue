<template>
  <a-scrollbar
    ref="scrollbarRef"
    style="overflow: auto;"
    :style="{
      height:`${props.height}px`
    }
  ">
    <div class="console">
      <div v-for="item in props.logList"><span>{{ item.type ? `[${item.type}] :` : '' }}</span> {{ item.log }}</div>
    </div>
  </a-scrollbar>
</template>

<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from 'vue'
import {ScrollbarInstance} from '@arco-design/web-vue'

const scrollbarRef = ref<ScrollbarInstance>()
const props = defineProps({
  height: [Number, String],
  logList: {
    type: Array,
    require: true,
    default: []
  }
})

const scrollToBottom = () => {
  // 延迟等待dom更新完后再滚动
  nextTick(() => {
    const ins = scrollbarRef.value
    ins.scrollTop(ins.$el.clientHeight)
  })
}

onMounted(() => {
  scrollToBottom()
})

watch(props.logList, () => {
  scrollToBottom()
})

</script>

<style scoped>
.console span {
  min-width: 60px;
  margin: 5px;
}
</style>

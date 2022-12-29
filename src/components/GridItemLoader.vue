<template>
  <AsyncComponent :attrs="attrs"></AsyncComponent>
</template>

<script setup>
import {useAttrs, defineAsyncComponent, inject, onMounted, ref} from 'vue'

let AsyncComponent
const components = inject('_grid_item_components_')

const props = defineProps({
  type: {required: true, type: String, default: null},   //  要加载的组件名称，需能在GridContainer的components中定义且其名字是一致的才能正确加载
})
const compFunc = components[props.type]
if (!compFunc) {
  console.error('未在components中定义', props.type, '组件')
} else if (typeof compFunc !== 'function') {
  console.error('components中的', props.type, '应该是一个函数,并使用import("XXX")异步导入')
}

AsyncComponent = defineAsyncComponent(compFunc)

const attrs = useAttrs()

</script>
<script>
export default {
  name:'GridItemLoader',
  inheritAttrs: false    // 禁止属性透传
}
</script>
<style scoped>

</style>

<template>
  <div>Text {{ props.attrs?.item?.name }}</div>

</template>

<script setup>

import {useAttrs} from "vue";
let attrs
//  获取 GridItemLoader 上绑定值的两种方式
//  1.使用props
const props = defineProps({
  attrs: Object
})
// attrs = props.attrs  // 若未绑定任何属性则为空对象则

//  2.使用useAttrs
// attrs = useAttrs()

// console.log(attrs);

</script>


<style scoped>

</style>

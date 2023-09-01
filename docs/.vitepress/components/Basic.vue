<template>
  1console.log(111111111111111111)
  <div id="basic-container"></div>
</template>

<script setup>
import {Container} from '@biggerstar/layout'
import {layoutData1} from '../store/layout'
import {onMounted} from "vue";

onMounted(() => {
  const container = new Container({
    el: '#basic-container',
    layouts: {
      col: 6,
      row: 6,
      items: layoutData1,
      margin: [10, 10],
      size: [120, 80],
    },
  })
  container.mount()

  // container.render((item)=>{
  //   console.log(item);
  // })

})

</script>

<style scoped>
#basic-container {
  height: 300px;
  width: 600px;
}
</style>

<template>
  <div>
    <GridContainer
        class="grid-container con3"
        style="height: 500px;margin: 3px auto"
        :config="config2"
        :useLayout="useLayout2"
        :components = "components"
    >
      <gridItem v-for="(item2,index) in useLayout2.data"
                :item="item2"
                :type="item2.type"
                :key="index"
                :pos="item2.pos"
                :draggable=true
                :resize=true
                :close=true
      >
        <test>
          <test>
            <test>
              {{ index }}
            </test>
          </test>
        </test>
      </gridItem>
    </GridContainer>
  </div>
</template>

<script setup>

import {reactive} from "vue";
import {layoutData11} from "@/stores/layout.js";
import Test from "@/components/Test.vue";

let useLayout2 = reactive({})
const components = {
  text: () => import('@/components/ItemView/Text.vue'),
  icon: () => import('@/components/ItemView/Icon.vue'),
  folder: () => import('@/components/ItemView/Folder.vue'),
}

const layouts2 = {
  data: layoutData11,
  // col: 6,
  // row: 8,
  ratio: 0.2,
  exchange: true,
  margin: [25, 20],
  size: [50, 60],
  followScroll: true,
  scrollWaitTime: 800,
  responsive: true,
}

const globalConf = {
  responsive: true,
  row: 6,
  responseMode: 'default',
  autoGrowRow: true,
  exchange: true,
  slidePage: true,
  ratio: 0.2,
}

const config2 = reactive({
  layouts: layouts2,
  global: globalConf
})


</script>

<style scoped>

</style>

<template>
  <div style="width: 100%; height: 100%">
    <GridContainer
        class="grid-container con3"
        style=" margin: 3px auto"
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

const props = defineProps({
  attrs: Object
})

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
  ratioCol: 0.2,
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
  ratioCol: 0.2,
}

const config2 = reactive({
  layouts: layouts2,
  global: globalConf
})


</script>




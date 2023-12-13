<template>
  <div style="height: auto" v-if="showPresentation">
    <div class="control-panel">
      <a-collapse :default-active-key="['1','3']" :bordered="true">
        <a-collapse-item v-if="Object.keys(props.controlOptions).length" header="控制面板" key="1">
          <div class="container-control-panel">
            <div class="item" v-for="(info,index) in containerControlMap" :key="index">
              <a-space>
                <span class="font-bolder font-1-1rem">{{ info.text }}</span>
                <a-switch
                  v-if="info.type === 'switch'"
                  v-model="info.active"
                  type="round"
                  @change="info?.handler"
                  checked-color="#14C9C9"
                  unchecked-color="#F53F3F"
                  checked-text="关闭"
                  unchecked-text="打开"
                />
                <a-input-number
                  v-model="info.value"
                  v-if="info.type === 'input-number'"
                  :style="{width:'160px' }"
                  @change="info?.handler"
                  :max="info.max"
                  :min="info.min"
                  mode="button"
                />
                <a-button
                  v-if="info.type === 'button'"
                  type="primary"
                  shape="round"
                  :style="{ fontWeight:'bolder'}"
                  @click="info?.handler"
                >{{ info.value }}
                </a-button>
                <a-select
                  v-if="info.type === 'select'"
                  :style="{width:'160px'}"
                  v-model="info.value"
                  :options="info.options"
                  @change='info.handler'
                >
                </a-select>
              </a-space>
            </div>
          </div>
        </a-collapse-item>
        <a-collapse-item v-if="props.showContainerDetail" header="当前容器使用配置显示" key="2">
          <div class="items-options-view">
            <div>
              <a-button @click="containerDetail.handler">
                {{ !containerDetail.showItemsDetail ? '显示完整配置' : '隐藏完整配置' }}
              </a-button>
            </div>
            <a-scrollbar style="min-height: 200px; max-height: 360px; overflow: auto">
              <pre>{{ containerDetail.text }}</pre>
            </a-scrollbar>
          </div>
        </a-collapse-item>
        <a-collapse-item v-if="props.logController || props.showPosDetail" header="日志显示" key="3">
          <div class="items-control-panel">
            <div class="item" style="width: 50%" v-if=" showPosDetail">
              <a-space>
                <span class="font-bolder">查看Item配置:</span>
                <a-select :style="{width:'160px'}"
                          v-model="itemsPosDetailControlMap.curItem"
                          :options="itemsPosDetailControlMap.allItems"
                          @change='itemsPosDetailControlMap.handler'
                          @clear='itemsPosDetailControlMap.reset'
                          allow-clear
                          placeholder="查看Item"
                >
                </a-select>
              </a-space>
              <a-scrollbar style="height:280px;overflow: auto;">
                <div class="view-detail-box height-300" ref="viewDetailBox">
                  <p v-if="isNumber(itemsPosDetailControlMap.curItem)">
                    索引为 ( <strong>{{ itemsPosDetailControlMap.curItem.toString?.() }}</strong> ) 的 Item 当前使用配置:
                  </p>
                  <pre class="item">{{ itemsPosDetailControlMap.detailText }}</pre>
                </div>
              </a-scrollbar>
            </div>
            <div class="item" v-if="props.logController" style="width: 50%;">
              <div
                class="font-bolder"
                style="display: flex; justify-content: flex-end; margin-bottom: 10px"
                @click="log.reset"
              >
                <a-button>清空日志</a-button>
              </div>

              <Console height="300" :logList="log.logList"/>
            </div>
          </div>
        </a-collapse-item>
      </a-collapse>

    </div>
    <div style="margin-top: 50px"></div>
    <div v-if="props.showContainer"
         :id="props.container.el.substring(1)"
         class="basic-container" ></div>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import {cloneDeep, Container, GridClickEvent} from '@biggerstar/layout'
import '@biggerstar/layout/dist/default-style.css'
import '../theme/css/grid-layout.css'
import {isNumber} from "is-what";
import Console from "./Console.vue";
import {createLogController} from "../../common/printLogPlugin";


const props = defineProps({
  containerId: {
    type: String,
    default: 'container'
  },
  container: {
    type: Container,
    default: {},
    required: true
  },
  showContainer: {
    type: Boolean,
    default: true,
  },
  showContainerDetail: {
    type: Boolean,
    default: false,
  },
  showPosDetail: {
    type: Boolean,
    default: false
  },
  controlOptions: {
    type: Object,
    default: {}
  },
  logController: {
    type: Object,
    default: null
  }
})

const showPosDetail = ref(false)
// console.log(message)
const active = ref(true)
const showPresentation = ref<boolean>(false)
const viewDetailBox = ref<HTMLElement>()
let container: Container = props.container
const containerControlMap = reactive(props.controlOptions)
const containerDetail = reactive({
  text: '',
  showItemsDetail: false,
  handler() {
    containerDetail.showItemsDetail = !containerDetail.showItemsDetail
    updateContainerDetail()
  }
})

function updateContainerDetail() {
  const configObj: any = Object.assign(cloneDeep(container.layout), cloneDeep(container.layout))
  if (!containerDetail.showItemsDetail) delete configObj['items']
  containerDetail.text = JSON.stringify(configObj, null, 4)
}

const createItemsPosDetailControlMap = () => {
  return reactive({
    detailText: '当您操作item时这里会显示一些东西......',
    curItem: void 0,
    allItems: computed(() => {
      return (container?.items || []).map(item => {
        return {
          value: item.i,
          label: `item-${item.i}`,
          other: item
        }
      })
    }),
    reset: () => {
      itemsPosDetailControlMap.detailText = ''
    },
    handler: (index: number) => {
      const item = container.find(index)[0]
      if (!item) return
      itemsPosDetailControlMap.detailText = JSON.stringify(item.customOptions, null, 4)
    }
  })
}

let itemsPosDetailControlMap: ReturnType<typeof createItemsPosDetailControlMap>

const log = props.logController || createLogController()

onMounted(() => {
  showPresentation.value = true
  container.use({
    click(ev: GridClickEvent) {
      if (ev.type === 'item' && ev.action === 'drag' && ev.item) {
        const curItemIndex = ev.item.i
        if (itemsPosDetailControlMap.curItem === curItemIndex) return
        itemsPosDetailControlMap.curItem = curItemIndex
        itemsPosDetailControlMap.handler(curItemIndex)
      }
    },
  })
  nextTick(() => {
    props.showContainer && container.mount()
    itemsPosDetailControlMap = createItemsPosDetailControlMap()
    updateContainerDetail()
    showPosDetail.value = props.showPosDetail
  })
})

watch(props, () => {
  updateContainerDetail()
})

</script>

<style scoped>
.basic-container {
  position: relative;
  min-height: 400px;
  width: 100%;
  min-width: 600px;
  z-index: 1
}

.item {
  display: block;
  margin: 6px 0;
}

.control-panel {
  width: 100%;
}

.container-control-panel, .items-control-panel {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item:deep(input) {
  text-align: center;
}

.font-bolder {
  font-weight: bolder;
}

.font-1-1rem {
  font-size: 1.1rem;
}

.height-300 {
  height: 100px;
}

</style>

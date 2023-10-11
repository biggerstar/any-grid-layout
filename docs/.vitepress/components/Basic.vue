<template>
  <div style="height: auto">
    <div class="control-panel">
      <div class="container-control-panel">
        <div class="item" v-for="(info,index) in containerControlMap" :key="index">
          <a-space>
            <span class="font-bolder font-1-1rem">{{ info.text }}:</span>
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
              :style="{width:'100px'}"
              @change="info?.handler"
              placeholder="Please Enter"
              mode="button"
            />
          </a-space>
        </div>
      </div>
      <div class="items-control-panel">
        <div class="item" style="width: 50%" v-if="itemsPosDetailControlMap.show">
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
        <div class="item" style="width: 50%;  ">
          <Console height="300" :logList="logDetailControlMap.logList"/>
        </div>
      </div>
    </div>

    <div id="basic-container"></div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {layoutData} from "../store/layout";
import {
  BaseEvent,
  Container,
  ContainerSizeChangeEvent,
  fillItemLayoutList,
  GridClickEvent,
  ItemLayoutEvent,
  ItemPosChangeEvent,
  ThrowMessageEvent
} from '@biggerstar/layout'
import '@biggerstar/layout/dist/default-style.css'
import '../theme/css/grid-layout.css'
import {insertItemContent} from "../../common";
import {isNumber, isString} from "is-what";
import Console from "./Console.vue";
// console.log(message)
const active = ref(true)
const viewDetailBox = ref<HTMLElement>()
let container: Container

const containerControlMap = reactive({
  close: {
    type: 'switch',
    active: true,
    text: '关闭按钮',
    handler: (status: boolean) => container.items.forEach(item => item.close = status)
  },
  resize: {
    type: 'switch',
    text: '调整按钮',
    active: true,
    handler: (status: boolean) => container.items.forEach(item => item.resize = status)
  },
  draggable: {
    type: 'switch',
    text: '允许拖动',
    active: true,
    handler: (status: boolean) => container.items.forEach(item => item.draggable = status)
  },
  transition: {
    type: 'switch',
    text: '开启动画',
    active: true,
    handler: (status: boolean) => container.items.forEach(item => item.transition = status)
  },
  autoGrowX: {
    type: 'switch',
    text: '横向容器拓展',
    active: true,
    handler: (status: boolean) => {
      container.layout.autoGrow.horizontal = status
    }
  },
  autoGrowY: {
    type: 'switch',
    text: '纵向容器拓展',
    active: true,
    handler: (status: boolean) => {
      container.layout.autoGrow.vertical = status
    }
  },
  sizeWidth: {
    type: 'input-number',
    text: '宽度',
    value: 80,
    handler: (value: number) => {
      container.layout.sizeWidth = value
      container.updateLayout()
    }
  },
  sizeHeight: {
    type: 'input-number',
    text: '高度',
    value: 50,
    handler: (value: number) => {
      container.layout.sizeHeight = value
      container.updateLayout()
    }
  },
  marginX: {
    type: 'input-number',
    text: '横向间距',
    value: 5,
    handler: (value: number) => {
      container.layout.marginX = value
      container.updateLayout()
    }
  },
  marginY: {
    type: 'input-number',
    text: '纵向间距',
    value: 5,
    handler: (value: number) => {
      container.layout.marginY = value
      container.updateLayout()
    }
  },
})

const itemsPosDetailControlMap = reactive({
  detailText: '当您操作item时这里会显示一些东西......',
  show: false,
  curItem: void 0,
  allItems: computed(() => {
    const items = (container?.items || []).map(item => {
      return {
        value: item.i,
        label: `item-${item.i}`,
        other: item
      }
    })
    console.log(items)
    return items
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

const logDetailControlMap = reactive({
  logList: [],
  add(type: string, log: string | number) {
    const logMap = logDetailControlMap
    if (logMap.logList.length >= 20) logMap.logList.shift()
    logMap.logList.push({
      type,
      log
    })
  }
})

onMounted(() => {
  container = new Container({
    el: '#basic-container',
    layouts: {
      // col: 8,
      // row: 6,
      autoGrow: {
        vertical: true,
        horizontal: true,
      },
      items: fillItemLayoutList(layoutData, {
        draggable: true,
        resize: true,
        close: true,
      }),
      margin: [5, 5],
      size: [80, 50],
    },
  })
  container.use({
    warn(ev: ThrowMessageEvent) {
      logDetailControlMap.add('warn', ev.message)
    },
    error(ev: ThrowMessageEvent) {
      logDetailControlMap.add('error', ev.message)
    },
    containerMounted(ev: BaseEvent) {
      let selector = ev.container.el
      if (isString(selector)) selector = ''
      logDetailControlMap.add('container-mounted', `容器${selector}已挂载`)
    },
    containerUnmounted(ev: BaseEvent) {
      let selector = ev.container.el
      if (isString(selector)) selector = ''
      logDetailControlMap.add('container-unmounted', `容器${selector}已卸载`)
    },
    itemMounted(ev: BaseEvent) {
      insertItemContent(ev)
      logDetailControlMap.add('item-mounted', '序号为 ' + ev.item.i + ' 已挂载')
    },
    itemUnmounted(ev: BaseEvent) {
      logDetailControlMap.add('item-unmounted', '序号为 ' + ev.item.i + ' 已卸载')
    },
    click(ev: GridClickEvent) {
      logDetailControlMap.add('click', `点击目标${ev.type}, 点击意图 ${ev.action ? ev.action : '无'}`)
      if (ev.type === 'item' && ev.action === 'drag' && ev.item) {
        const curItemIndex = ev.item.i
        if (itemsPosDetailControlMap.curItem === curItemIndex) return
        itemsPosDetailControlMap.curItem = curItemIndex
        itemsPosDetailControlMap.handler(curItemIndex)
      }
    },
    itemPosChanged(ev: ItemPosChangeEvent) {
      const {oldX, oldY, item, oldW, oldH} = ev
      let log = ''
      if (ev.type === 'position') log = `x:${oldX},y:${oldY} -> x:${item.pos.x},y:${item.pos.y}`
      else if (ev.type === 'size') log = `w:${oldW},h:${oldH} -> w:${item.pos.w},h:${item.pos.h}`
      logDetailControlMap.add('pos-changed', log)
    },
    closing(ev: ItemLayoutEvent) {
      logDetailControlMap.add('closing', `尝试关闭 ${ev.item.i}`)
    },
    closed(ev: ItemLayoutEvent) {
      logDetailControlMap.add('closed', '已移除item,索引为 ' + ev.item.i)
    },
    colChanged(ev: ContainerSizeChangeEvent) {
      logDetailControlMap.add('col-changed', `oldCol ${ev.oldCol} -> curCol ${ev.curCol}`)
    },
    rowChanged(ev: ContainerSizeChangeEvent) {
      logDetailControlMap.add('row-changed', `oldRow ${ev.oldRow} -> curRow ${ev.curRow}`)
    },
  })
  container.mount()
  console.log(container)
  itemsPosDetailControlMap.show = true
})

</script>

<style scoped>
#basic-container {
  position: relative;
  height: 400px;
  width: 100%;
  min-width: 600px;
  z-index: 1
}

.item {
  display: block;
  min-width: 160px;
  margin: 10px 0;
}

.control-panel {
  width: 100%;
}

.container-control-panel, .items-control-panel {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 50px 0;
  border: rgb(229, 230, 235) solid 1px;
  padding: 30px;
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

.view-detail-box {
  /*height: auto;*/
}

</style>

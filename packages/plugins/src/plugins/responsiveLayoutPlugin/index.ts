// noinspection JSUnusedGlobalSymbols

import {
  definePlugin,
  tempStore,
  ItemLayoutEvent,
  BaseEvent,
  ContainerSizeChangeEvent,
  getContainerConfigs,
  GridPlugin
} from "@biggerstar/layout";
import {directUpdateLayout, updateResponsiveDragLayout, updateResponsiveResizeLayout} from "@/common";

/**
 * 响应式布局插件
 * */
export default function createResponsiveLayoutPlugin(): GridPlugin {
  return definePlugin({
    name: 'ResponsiveLayoutPlugin',
    containerMountBefore(ev: BaseEvent) {
      const {autoGrow, col, row} = getContainerConfigs(ev.container, ["autoGrow", "col", 'row'])
      if (!col && !row && autoGrow.horizontal && autoGrow.vertical) {  // 如果col和row都没设置，则只选一边允许增长
        ev.container.bus.emit("warn", {
          message: `[${this.name}] autoGrow 的 horizontal 和 vertical 配置不建议都设置为true,建议只保留一边自动增长`
        })
      }
    },

    exchangeVerification(ev: any) {
      ev.prevent()
      if (!ev.fromItem) {
        return
      }
      if (ev.container.autoGrowCol || ev.container.autoGrowRow) {
        ev.doExchange()
      }
    },

    exchangeReceive(ev: any) {
      if (ev.newItem) {
        ev.addModifyItem(ev.newItem, {
          x: ev.toStartX,
          y: ev.toStartY,
        })
      }
    },

    containerResizing(ev: ContainerSizeChangeEvent) {
      ev.prevent()
      const container = ev.container
      const manager = container.layoutManager
      manager.reset(container.containerW, container.containerH)
      const isSuccess = directUpdateLayout(ev)
      if (!isSuccess) {   // 如果本次矩阵大小调整失败，则恢复回滚恢复原来的矩阵保证所有的源Item不会溢出
        // 重置矩阵，矩阵最终情况的值将都为null，但是在响应式情况下无关紧要
        manager.reset(ev.col || container.getConfig("col"), ev.row || container.getConfig("row"))
      }
    },

    dragend(ev: any) {
      directUpdateLayout(ev)   // 防御性编程，保证最后布局矩阵中是当前所有item正确的位置，用于后面trim裁剪
      ev.container.layoutManager.trim({
        row: {head: true},
        col: {head: true},
      })
      directUpdateLayout(ev)
    },

    dragToTop(ev: any) {
      // console.log('dragToTop')
      ev.prevent()
      const {fromItem} = tempStore
      if (!fromItem) {
        return
      }
      if (fromItem.pos.y <= 1) {
        return
      }
      updateResponsiveDragLayout(ev, (item) => ({y: item.pos.y + fromItem.pos.h}))
    },

    dragToRight(ev: any) {
      // console.log('dragToRight')
      ev.prevent()
      const {fromItem} = tempStore
      if (!fromItem) {
        return
      }
      if (fromItem.pos.x + fromItem.pos.w - 1 >= ev.col && !ev.container.autoGrowCol) {
        return
      }
      updateResponsiveDragLayout(ev, (item) => ({x: item.pos.x - fromItem.pos.w}))
    },

    dragToBottom(ev: any) {
      // console.log('dragToBottom')
      ev.prevent()
      const {fromItem} = tempStore
      if (!fromItem) {
        return
      }
      if (fromItem.pos.y + fromItem.pos.h - 1 >= ev.row && !ev.container.autoGrowRow) {
        return
      }
      updateResponsiveDragLayout(ev, (item) => ({y: item.pos.y - fromItem.pos.h}))
    },

    dragToLeft(ev: any) {
      // console.log('dragToLeft')
      ev.prevent()
      const {fromItem} = tempStore
      if (!fromItem) {
        return
      }
      if (fromItem.pos.x <= 1) {
        return
      }
      updateResponsiveDragLayout(ev, (item) => ({x: item.pos.x + fromItem.pos.w}))
    },

    /*------------------------------------------------------------------*/
    resized(ev: any) {
      directUpdateLayout(ev)   // 防御性编程，保证最后布局矩阵中是当前所有item正确的位置，用于后面trim裁剪
      ev.container.layoutManager.trim({
        row: {head: true},
        col: {head: true},
      })
      directUpdateLayout(ev)
    },

    resizeToTop(ev: any) {
      updateResponsiveResizeLayout(ev)
    },

    resizeToBottom(ev: any) {
      updateResponsiveResizeLayout(ev)
    },

    resizeToLeft(ev: any) {
      updateResponsiveResizeLayout(ev)
    },

    resizeToRight(ev: any) {
      updateResponsiveResizeLayout(ev)
    },

    closed(ev: ItemLayoutEvent) {
      directUpdateLayout(ev)
    },

    updateLayout(ev: ItemLayoutEvent) {
      ev.prevent()
      directUpdateLayout(<any>ev['event'] || ev)
    },
  })
}

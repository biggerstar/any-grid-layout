// noinspection JSUnusedGlobalSymbols

import {
  BaseEvent,
  ContainerSizeChangeEvent,
  ItemLayoutEvent,
  definePlugin,
  tempStore,
  throttle,
  getContainerConfigs,
  GridPlugin,
  isItemAnimating
} from "@biggerstar/layout";
import {directUpdateLayout, updateResponsiveResizeLayout} from "@/common";

/**
 * 拖动Item到Items列表中的toItem的索引位置,拖动过程中保持有序
 * TODO 还有很大优化空间,比如拖动到容器外或空白处会出现一些问题
 * */
export const moveToIndexForItems: Function = throttle((ev: any) => {
  const {fromItem} = tempStore
  if (!fromItem) {
    return
  }
  if (isItemAnimating(fromItem)) {
    return
  }
  const container = ev.container
  const manager = container.layoutManager
  const toItem = manager.findItemFromXY(ev.items, ev.startGridX, ev.startGridY)
  if (toItem && toItem !== fromItem) {
    manager.move(ev.items, fromItem, toItem)
    directUpdateLayout(ev)
  }
}, 80)

/*------------------------------------------------------------------------------------------*/
/**
 * 流式布局
 * 建议只在item大小全部一样的时候使用该算法
 * 优点: 不会打乱源次序
 * 缺点: 在固定宽高的时候想移动到某位置时正好布局后容器会溢出，此时移动会失败
 * 建议: 1.建议Item大小都一致，否则容易出现各种问题
 *      2.建议只用于不固定宽高的容器中
 *      3.不要使用静态 item
 * */

export default function createStreamLayoutPlugin(): GridPlugin {
  return definePlugin({
    name: 'StreamLayoutPlugin',
    containerMountBefore(ev: BaseEvent) {
      const {autoGrow, col, row} = getContainerConfigs(ev.container, ["autoGrow", "col", 'row'])
      if (!col && !row && autoGrow && autoGrow.horizontal && autoGrow.vertical) {  // 如果col和row都没设置，则只选一边允许增长
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
      moveToIndexForItems(ev)
    },

    dragToBottom(ev: any) {
      moveToIndexForItems(ev)
    },

    dragToLeft(ev: any) {
      moveToIndexForItems(ev)
    },

    dragToRight(ev: any) {
      moveToIndexForItems(ev)
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
      directUpdateLayout(ev)
    }
  })
}

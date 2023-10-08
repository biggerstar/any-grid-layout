// noinspection JSUnusedGlobalSymbols

import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {ConfigurationEvent, ItemExchangeEvent} from "@/plugins";
import {definePlugin, tempStore} from "@/global";
import {
  directUpdateLayout,
  moveToIndexForItems,
  updateLayout,
  updateResponsiveResizeLayout
} from "@/builtin-plugins/common";

/*-
-----------------------------------------------------------------------------------------*/
/**
 * 流式布局
 * 建议只在item大小全部一样的时候使用该算法
 * 优点: 不会打乱源次序
 * 缺点: 在固定宽高的时候想移动到某位置时正好布局后容器会溢出，此时移动会失败
 * 建议: 1.建议Item大小都一致，否则容易出现各种问题
 *      2.建议只用于不固定宽高的容器中
 *      3.不要使用static item
 * */
export const StreamLayoutPlugin = definePlugin({
  name: 'StreamLayoutPlugin',
  getConfig(_: ConfigurationEvent) {
  },
  exchangeProcess(_: ItemExchangeEvent) {
    const {toContainer, fromItem} = tempStore
    if (!toContainer || !fromItem) return
  },
  containerResizing(ev: ItemLayoutEvent) {
    updateLayout(ev)
  },

  dragend(ev: ItemDragEvent) {
    directUpdateLayout(ev)
  },

  dragToOuterLeft(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToOuterRight(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToOuterTop(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToOuterBottom(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToLeftTop(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToLeftBottom(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToRightTop(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToRightBottom(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToTop(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToBottom(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToLeft(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToRight(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  /*------------------------------------------------------------------*/
  resized(ev: ItemResizeEvent) {
    directUpdateLayout(ev)
  },

  resizeToOuterTop(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToOuterRight(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToOuterBottom(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToOuterLeft(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToTop(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToBottom(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToLeft(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToRight(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  closed(ev: ItemLayoutEvent) {
    directUpdateLayout(ev)
  },
  updateLayout(ev: ItemLayoutEvent) {
    directUpdateLayout(ev)
  }
})

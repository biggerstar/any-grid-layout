// noinspection JSUnusedGlobalSymbols

import {definePlugin} from "@/plugins/global";
import {ItemDragEvent} from "@/plugins/event-type/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-type/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins/event-type/ItemLayoutEvent";
import {directUpdateLayout, moveToIndexForItems, updateLayout, updateResponsiveResizeLayout} from "@/plugins/common";

/*------------------------------------------------------------------------------------------*/
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
  containerResizing(ev: ItemLayoutEvent) {
    updateLayout(ev)
  },

  dragend(ev: ItemDragEvent) {
    directUpdateLayout(ev)
  },

  dragOuterLeft(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragOuterRight(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragOuterTop(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragOuterBottom(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToLeftTop(ev: ItemDragEvent) {
    moveToIndexForItems(ev)
  },

  dragToLetBottom(ev: ItemDragEvent) {
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

  resizeOuterTop(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeOuterRight(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeOuterBottom(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeOuterLeft(ev: ItemResizeEvent) {
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
})

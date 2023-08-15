### CSS 风格自定义

```css
/*----------------any-grad-layout相关默认样式------------------*/
/* 仅编辑模式生效   */
/* 鼠标编辑模式默认样式 */
.grid-cursor-default {
  cursor: default;
}

/* 鼠标在容器中的样式 */
.grid-cursor-in-container {
  cursor: grab;
}

/* 鼠标点击时的鼠标样式 */
.grid-cursor-mousedown {
  cursor: grabbing;
}

/* Item移动到Item关闭按钮上的鼠标样式 */
.grid-cursor-item-close {
  cursor: pointer;
}

/* Item移动到resize按钮上的鼠标样式 */
.grid-cursor-item-resize {
  cursor: nw-resize;
}

/* Item拖动时在容器外禁止放置的鼠标样式(该样式只有编辑模式有) */
.grid-cursor-no-drop {
  cursor: no-drop;
}

/* Item拖动时移动到不可放置的静态Item成员上的鼠标样式(该样式只有编辑模式有) */
.grid-cursor-drag-to-item {
  cursor: no-drop;
}

/* 鼠标移动到静态Item上面显示的鼠标样式(该样式只有编辑模式有) */
.grid-cursor-static-item {
  cursor: no-drop;
}


/* ----永久性生效的鼠标样式------  */
/*.grid-item {*/
/*    cursor: move;*/
/*}*/

/*.grid-item:active {*/
/*    cursor: no-drop;*/
/*}*/

/*.grid-container {*/
/*    cursor: grab;*/
/*}*/

/*.grid-item-close-btn {*/
/*    cursor: pointer;*/
/*}*/

/*.grid-item-resizable-handle {*/
/*    cursor: nw-resize;*/
/*}*/

/*------------------------------------------------------*/
/* Container的默认样式,定义宽高会被忽略 */
.grid-container {
  border-radius: 10px;
  background-color: skyblue;
}

/* 所有Item的默认样式,定义宽高会被忽略 */
.grid-item {
  background-color: rgb(148, 145, 145);
}

/* 拖动(drag)时克隆出来跟随鼠标移动的对应元素 */
.grid-dragging-clone-el {
  opacity: 0.8;
  transform: scale(1.1);
  z-index: 1;
}

/* 点击进行拖动(drag)的来源元素，也就是容器内的Item，正在拖动时候的样式*/
.grid-dragging-source-el {
  opacity: 0.3;
}

/* 重置大小(resize)时克隆出来跟随鼠标移动的对应元素 */
.grid-resizing-clone-el {
  background-color: red;
}

/* 点击进行重置大小(resize)的来源元素，也就是容器内的Item，正在拖动时候的样式*/
.grid-resizing-source-el {
  opacity: 0.3;
}

/* 重置大小(resize)按钮样式 */
.grid-item-resizable-handle {
  font-size: 1.1rem;
}

/* 关闭Item按钮的样式 */
.grid-item-close-btn {
  background-color: skyblue;
}

/* 点击Item按钮的样式 */
.grid-item-close-btn:active {
  background-color: blue;
}


```


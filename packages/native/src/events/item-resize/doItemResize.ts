import {throttle} from "@/utils";
import {tempStore} from "@/store";
import {Container, ItemPos} from "@/main";

export const doItemResize: Function = throttle((ev: MouseEvent) => {
  const {
    isResizing,
    isLeftMousedown,
    mousedownEvent,
    fromItem,
    cloneElement,
    fromContainer,
    isCoverRow
  } = tempStore
  if (!isResizing || !isLeftMousedown) return
  if (!fromItem || !mousedownEvent || !isLeftMousedown) return
  const container: Container = fromItem.container
  if (!cloneElement) {
    const newNode = <HTMLElement>fromItem.element.cloneNode(true)
    tempStore.cloneElement = newNode
    newNode.classList.add('grid-clone-el', 'grid-resizing-clone-el')
    if (fromContainer) fromContainer.contentElement.appendChild(newNode)
    fromItem.domImpl.updateStyle({transition: 'none'}, newNode)
    fromItem.domImpl.addClass('grid-resizing-source-el')
  }
  // console.log(fromItem.pos);
  const containerElRect = fromItem.container.contentElement.getBoundingClientRect()
  let width = ev.pageX - containerElRect.left - window.scrollX - fromItem.offsetLeft()
  let height = ev.pageY - containerElRect.top - window.scrollY - fromItem.offsetTop()
  //-----------------判断克隆Item当前对应栅格中的w，h---------------------//
  const resized = {
    w: Math.ceil(width / (fromItem.size[0] + fromItem.margin[0])),
    h: Math.ceil(height / (fromItem.size[1] + fromItem.margin[1])),
  }
  if (resized.w < 1) resized.w = 1
  if (resized.h < 1) resized.h = 1
  //-----------------限制信息计算函数定义---------------------//
  const limitGrid = ({w, h}) => {
    // w，h是新的resize克隆元素对应生成大小的w，和h
    const pos = <ItemPos>fromItem.pos
    //----------------检测改变的大小是否符合用户限制 -------------//
    if (fromItem.resizeOut) {
      if ((w + pos.x) > container.getConfig("col")) w = container.getConfig("col") - pos.x + 1     //item调整大小时在容器右边边界超出时进行限制
    }
    if (w < pos.minW) w = pos.minW
    if (w >= pos.maxW && pos.maxW !== Infinity) w = pos.maxW
    if (fromItem.resizeOut) {
      if ((h + pos.y) > container.getConfig("row")) h = container.getConfig("row") - pos.y + 1
    }
    if (h < pos.minH) h = pos.minH
    if (h >= pos.maxH && pos.maxH !== Infinity) h = pos.maxH
    return {
      w,
      h
    }
  }
  const limitCloneEl = () => {
    //------------------------克隆元素长宽限制---------------------------//
    // max 限制优先级必须大于 min，防止min的值比max大突破最大尺寸
    // 如果 min的值大于max ，min的尺寸将强制降级到和max尺寸一致，此时 max 和 min相等，该方向的尺寸则会直接固定，无法调整大小
    if (width < fromItem.minWidth()) width = fromItem.minWidth()
    if (height < fromItem.minHeight()) height = fromItem.minHeight()
    if (width > fromItem.maxWidth()) width = fromItem.maxWidth()
    if (height > fromItem.maxHeight()) height = fromItem.maxHeight()
    return {
      width,
      height
    }
  }
  let newResize = limitGrid(resized)    //当前鼠标距离x,y的距离构成的矩形
  // console.log(fromItem.pos.w,fromItem.pos.h);
  // console.log(newResize);
  const resizeSpaceLimit = ({w, h}): { w: number, h: number } => {
    //-----------------响应式和静态的resize最大可调整空间算法实现---------------------//
    //  静态模式下对resize进行重置范围的限定，如果resize超过容器边界或者压住其他静态成员，直接打断退出resize过程
    const nowElSize = limitCloneEl()
    const maxBlankMatrixLimit = fromItem.container.engine.findStaticBlankMaxMatrixFromItem(fromItem)
    const updateStyle: Record<any, any> = {}
    // console.log(maxBlankMatrixLimit);
    if (w > maxBlankMatrixLimit.minW && h > maxBlankMatrixLimit.minH) return   // 最低要求限制不能同时超过
    if (maxBlankMatrixLimit.maxW >= w) {    // 横向调整
      updateStyle.width = nowElSize.width + 'px'
      fromItem.pos.w = w
    } else {  // 鼠标在Item外
      w = fromItem.pos.w      //必要，将当前实际宽给newResize
    }
    if (maxBlankMatrixLimit.maxH >= h) {  // 纵向调整
      updateStyle.height = nowElSize.height + 'px'
      fromItem.pos.h = h
    } else {   // 鼠标在Item外
      h = fromItem.pos.h   //必要，将当前实际高给newResize
    }
    if (Object.keys(updateStyle).length > 0) {
      fromItem.domImpl.updateStyle(updateStyle, cloneElement)
    }
    return {
      w,
      h
    }
    // console.log(fromItem.pos.w,fromItem.pos.h, container.col, fromItem.pos.col);
  }

  newResize = resizeSpaceLimit(newResize)
  if (!fromItem.__temp__.resized) fromItem.__temp__.resized = {w: 1, h: 1}
  if (fromItem.__temp__.resized.w !== resized.w || fromItem.__temp__.resized.h !== resized.h) { // 只有改变Item的大小才进行style重绘
    if (!newResize) return
    fromItem.__temp__.resized = newResize
    if (typeof fromItem._VueEvents['vueItemResizing'] === 'function') {
      fromItem._VueEvents['vueItemResizing'](fromItem, newResize.w, newResize.h)
    }
    if (container.getConfig('autoGrowRow') && isCoverRow) container?.['cover']?.('row')
    fromItem.container.eventManager._callback_('itemResizing', newResize.w, newResize.h, fromItem)

    if (fromContainer) fromContainer.updateLayout(fromItem.container.getConfig("responsive") ? true : [fromItem])
    fromItem.domImpl.updateStyle(fromItem._genLimitSizeStyle())
    fromItem.container.updateContainerStyleSize()
  }
}, 15)

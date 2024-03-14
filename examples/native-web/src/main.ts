import container1 from "@/container/container1";
import {
  BaseEvent,
  ContainerSizeChangeEvent,
  definePlugin,
  ItemLayoutEvent,
  ItemPosChangeEvent,
  MatrixEvent,
  ThrowMessageEvent,
  updateStyle,
} from '@biggerstar/layout'
import {createShadowElementPlugin} from '@biggerstar/layout-plugins'
import '@biggerstar/layout/dist/css/default-style.css'
import '@biggerstar/layout/dist/css/scroll-bar.css'
import container2 from "@/container/container2";
import container3 from "@/container/container3";

console.log(container1)
console.log(container2)
console.log(container3)


const plugin = definePlugin({
  //-------------throw-message-----------
  error(ev: ThrowMessageEvent) {
    console.log(ev.message)
  },
  warn(ev: ThrowMessageEvent) {
    console.warn(ev.message)
  },
  updateCloneElementStyle(ev: any) {
    // ev.prevent()
  },
  //-----------------container------------------

  containerMounted(ev: BaseEvent) {
    // console.log('containerMounted', ev)
  },
  containerUnmounted(ev: BaseEvent) {
    // console.log('containerUnmounted', ev.container.el)
  },
  containerResizing(ev: ItemLayoutEvent) {
    // console.log(ev);
  },
  containerSizeChanged(ev: ContainerSizeChangeEvent) {
    // console.log('containerSizeChanged',ev.container)
  },
  colChanged(ev: ContainerSizeChangeEvent) {
    // console.log('colChanged',ev.container)
  },
  rowChanged(ev: ContainerSizeChangeEvent) {
    // console.log('rowChanged',ev.container)
  },
  //-------------------item---------------------
  addItemSuccess(ev: BaseEvent) {
    // console.log('addItemSuccess', ev.item)
  },
  itemMounted(ev: BaseEvent) {
    // console.log('itemMounted', ev.item)
    insertItemContent(ev)
  },
  itemUnmounted(ev: BaseEvent) {
    // console.log('itemUnmounted', ev.item)
  },
  itemSizeChanged(ev: ItemPosChangeEvent) {
    // console.log(ev);
  },
  itemPositionChanged(ev: ItemPosChangeEvent) {
    // console.log(ev);
  },
  click(ev) {
    console.log('click')
  },
  mousedown(ev) {
    console.log('mousedown')
  },
  mousemove(ev: BaseEvent) {
    // console.log('mousemove')
    // console.log(ev.mousemoveEvent);
    const element = <HTMLElement>ev.container.element
    const contentElement = <HTMLElement>ev.container.contentElement
    const containerRect = contentElement.getBoundingClientRect()
    const {clientX, clientY} = ev.mousemoveEvent
    const domMatrix = new DOMMatrix(window.getComputedStyle(element).transform)
    // console.log(window.getComputedStyle(contentElement).transform);
    console.log(domMatrix)
    const scaleX = domMatrix.a  // X 轴 rotate
    const scaleY = domMatrix.d  // Y 轴 rotate
    const skewY = domMatrix.b   // Y 轴刻度拉伸
    const skewX = domMatrix.c   // X 轴刻度拉伸
    let posX = clientX - containerRect.left
    let posY = clientY - containerRect.top
    /*
    * 分析过程：
    * rotateY 正 *  skewY 正 = +  |  起点左边  左上  -动态拉伸
    * rotateY 正 *  skewY 负 = -  |  起点左边  右上  +动态拉伸 和 -固定拉伸
    * rotateY 负 *  skewY 正 = -  |  起点右边  右上  +动态拉伸 和 -固定拉伸
    * rotateY 负 *  skewY 负 = +  |  起点右边  左上  -动态拉伸
    * 结论： rotateY * skewY 为正数，需要减去拉伸距离， 反之
    * */
    const isRightTopSideHigh = skewY * scaleY < 0  // 是否右上侧比较高(贴近顶部)
    const isLeftBottomSideHigh = skewX * scaleX < 0  // 是否左下方侧比较高(贴近左侧)
    const isFlipX = scaleX <= 0  // 是否X轴翻转
    const isFlipY = scaleY <= 0  // 是否Y轴翻转
    let scaleBeforeX = posX, scaleBeforeY = posY
    if (isFlipX) {
      posX = scaleBeforeX - containerRect.width  // 如果是负数，则元素会是翻转状态，重设起点为右上角
    }
    if (isFlipY) {
      posY = scaleBeforeY - containerRect.height // 如果是负数，则元素会是翻转状态，重设起点为左下角  // TODO  containerRect.height 受影响， 使用clientHeight
    }
    posX /= scaleX
    posY /= scaleY

    // console.log('isFlipX', isFlipX, 'isFlipY', isFlipY)
    // console.log(scaleX, scaleY)
    // console.log(skewY, skewX)
    // console.log(posX, posY)

    let skewBeforeX = posX, skewBeforeY = posY
    if (skewY) {
      console.log('isRightTopSideHigh', isRightTopSideHigh, 'skewY', skewY)
      if (isRightTopSideHigh) {
        posY -= element.clientWidth * Math.abs(skewY)   // 右边比较高, 减去固定拉伸
        posY += skewBeforeX * Math.abs(skewY)           // 加上动态拉伸
      } else {
        posY -= skewBeforeX * Math.abs(skewY)           // 减去动态拉伸
      }
      // console.log((skewBeforeX * skewY))
      // 同上， 只是左右侧变成上下侧
    }
    if (skewX) {
      console.log('isLeftBottomSideHigh', isLeftBottomSideHigh)
      if (isLeftBottomSideHigh) {
        posX -= element.clientHeight * Math.abs(skewX)
        posX += skewBeforeY * Math.abs(skewX)
      } else {
        posX -= skewBeforeY * Math.abs(skewX)
      }
    }
    let offsetX = ev.container.pxToW(posX, {keepSymbol: true})
    let offsetY = ev.container.pxToH(posY, {keepSymbol: true})

    console.log(
      offsetX,
      offsetY
    );

  },
  mouseup(ev) {
    console.log('mouseup')

  },
  each(ev: MatrixEvent) {
    // ev.prevent()
  },
  flip(ev: MatrixEvent) {
    // ev.prevent()
  },
})

function insertItemContent(ev: BaseEvent) {
  const item = ev.item
  if (!item) {
    return
  }
  if (item.contentElement.innerHTML) {
    return
  }
  item.contentElement.innerHTML = item.i.toString()
  updateStyle({
    fontSize: `${Math.max(30, <number>ev.container.getConfig('itemWidth') / 4)}px`,
    fontWeight: '800',
    color: '#6b798e'
  }, item.contentElement)
}

container1
  .use(plugin)
  // .use(createCloseBtnPlugin())
  .use(createShadowElementPlugin())
// .use(createResizeBtnPlugin())
// .use(createResponsiveLayoutPlugin())

container2
  .use(plugin)
// .use(createResponsiveLayoutPlugin())

container3
  .use(plugin)
// .use(createStreamLayoutPlugin())


container1.mount()
// container2.mount()
// container3.mount()


container1.layoutManager.each((curRowPoint, curColPoint) => {
  // console.log(curColPoint,curRowPoint);
})


// console.log(container1.items[2],container1.items[2].spaceRight());
// console.log(container1.items[3],container1.items[3].spaceRight());
// console.log(container1.items[4],container1.items[4].spaceRight());








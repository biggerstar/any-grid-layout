import {
  BaseEvent,
  definePlugin,
  Item,
  MatrixTransform,
  MouseGridEvent,
  ThrowMessageEvent,
  updateStyle
} from "@biggerstar/layout";

let matrixTransform: MatrixTransform

function insertItemContent(ev: BaseEvent) {
  const item = ev.item
  if (!item) {
    return
  }
  if (item.itemElement.innerHTML) {
    return
  }
  // console.log(item.key)
  item.element.innerHTML = `<div style="margin-top: 0 ">${item.key}</div>`
  updateStyle({
    fontSize: `${Math.max(28, <number>ev.container.useLayout.itemWidth / 4)}px`,
    fontWeight: '800',
    color: '#6b798e'
  }, item.element)
}

export const plugin = definePlugin({
  containerMounted(ev: BaseEvent) {
    // console.log('containerMounted', ev)
    const element = ev.container.containerElement
    // generateBorderShadow(element, {
    //   isRect: true,
    //   isOrigin: false
    // })
    matrixTransform = new MatrixTransform(element)
    // generateBorderShadow(element)
  },
  itemMounted(ev: BaseEvent) {
    insertItemContent(ev)
  },
  itemUnmounted(ev) {
    console.log('itemUnmounted', ev.item)
  },
  mousedown(ev: MouseGridEvent) {
    console.log('mousedown')
  },
  mousemove(ev: MouseGridEvent) {
    // console.log('mousemove')
    if (ev.container) {
      const {clientX, clientY} = ev.mousemoveEvent
      const {x, y} = matrixTransform.transformCoordinates(clientX + window.scrollX, clientY + window.scrollY)
      let offsetX = ev.container.pxToGridW(x, {keepSymbol: true})
      let offsetY = ev.container.pxToGridH(y, {keepSymbol: true})
      console.log(
        offsetX,
        offsetY
      )
    }
  },
  mouseup(ev: MouseGridEvent) {
    console.log('mouseup')
  },
  layout(ev: BaseEvent & Record<any, any>) {
    // console.log(ev)
    const {container} = ev
    let res = container.layoutManager.autoAnalysis()
    console.log(res)
    const nextLayoutOptions = res.nextLayoutOptions
    // console.log(nextLayoutOptions)
    if (res.isSuccess) {
      container.setState(nextLayoutOptions)
    }
  },
  error(ev: ThrowMessageEvent) {
    console.log(ev)
    // console.log({...ev.container.useLayout})
    if (ev.type === "ItemOverflow") {
      ev.from.forEach((item: Item) => {
        delete item.pos.x
        delete item.pos.y
      })
      ev.container.setState(ev.errorLayout)
    } else if (ev.type === 'ItemsPositionsOverlap') {
      ev.from.forEach((item: Item) => {
        delete item.pos.x
        delete item.pos.y
      })
      ev.container.setState(ev.errorLayout)
    } else if (ev.type === 'ItemKeysRepeated') {
      ev.from.forEach((item: Item, index: number) => item.key = `n${index}`)
      ev.container.setState(ev.errorLayout)
    } else if (ev.type === 'ItemSizeExceedsContainerSize') {
      ev.from.forEach((item: Item) => {
        if (ev.errorLayout.containerWidth) {
          item.pos.w = ev.container.pxToGridW(ev.errorLayout.containerWidth, {floor: true})
        }
        delete item.pos.x
        delete item.pos.y
      })
      ev.container.setState(ev.errorLayout)
    }
  },
})

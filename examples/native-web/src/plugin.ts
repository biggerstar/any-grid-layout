import {
  definePlugin,
  Item,
  OnContainerMounted,
  OnError,
  OnItemMounted,
  OnItemUnmounted,
  OnLayout,
  OnMousedown,
  OnMousemove,
  OnMouseup,
  updateStyle
} from "@biggerstar/layout";


function insertItemContent(ev: any) {
  const item = ev.item
  if (!item) {
    return
  }
  if (item.element.innerHTML) {
    return
  }
  // console.log(item.key)
  item.element.innerHTML = `<div style="margin-top: 0 ">${item.key}</div>`
  updateStyle({
    fontSize: `${Math.max(28, <number>ev.container.state.itemWidth / 4)}px`,
    fontWeight: '800',
    color: '#6b798e'
  }, item.element)
}

export const plugin = definePlugin({
  containerMounted(ev: OnContainerMounted) {
    // console.log('containerMounted', ev)
  },
  itemMounted(ev: OnItemMounted) {
    insertItemContent(ev)
    // const element = ev.container.element
    // generateBorderShadow(element, {
    //   isRect: true,
    //   isOrigin: false
    // })
    // generateBorderShadow(element)
  },
  itemUnmounted(ev: OnItemUnmounted) {
    console.log('itemUnmounted', ev.item)
  },
  mousedown(ev: OnMousedown) {
    // console.log('mousedown')
  },
  mousemove(ev: OnMousemove) {
    // console.log('mousemove', ev.container)
    // console.log(ev.offsetGridX, ev.offsetGridY)
    // console.log(ev)
  },
  mouseup(ev: OnMouseup) {
    // console.log('mouseup')
  },
  layout(ev: OnLayout) {
    // console.log(ev)
    const {container} = ev
    let res = container.layoutManager.autoAnalysis()
    // console.log(res)
    // console.log(res.nextLayoutOptions)
    if (res.isSuccess) {
      container.setState(res.nextLayoutOptions)
    }
  },
  error(ev: OnError) {
    console.log(ev)
    // console.log({...ev.container.useLayout})
    if (ev.type === "ItemOverflow") {
      ev.from.forEach((item: Item) => {
        delete item.pos.x
        delete item.pos.y
      })
      ev.container.setState(ev.errorState)
    } else if (ev.type === 'ItemsPositionsOverlap') {
      ev.from.forEach((item: Item) => {
        delete item.pos.x
        delete item.pos.y
      })
      ev.container.setState(ev.errorState)
    } else if (ev.type === 'ItemKeysRepeated') {
      ev.from.forEach((item: Item, index: number) => item.key = `n${index}`)
      ev.container.setState(ev.errorState)
    } else if (ev.type === 'ItemSizeExceedsContainerSize') {
      ev.from.forEach((item: Item) => {
        if (ev.errorState.containerWidth) {
          item.pos.w = ev.container.pxToGridW(ev.errorState.containerWidth, {floor: true})
        }
        delete item.pos.x
        delete item.pos.y
      })
      ev.container.setState(ev.errorState)
    }
  },
})

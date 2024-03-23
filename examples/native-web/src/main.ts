import container1 from "@/container/container1";
import {
  BaseEvent,
  definePlugin,
  generateBorderShadow,
  MatrixTransform,
  ThrowMessageEvent,
  updateStyle
} from '@biggerstar/layout'
import '@biggerstar/layout/dist/css/default-style.css'
import '@biggerstar/layout/dist/css/scroll-bar.css'
import container2 from "@/container/container2";
import container3 from "@/container/container3";

console.log(container1)
// console.log(container2)
// console.log(container3)

let matrixTransform: MatrixTransform
const plugin = definePlugin({
  error(ev: ThrowMessageEvent) {
    console.log(ev.message)
  },
  warn(ev: ThrowMessageEvent) {
    console.warn(ev.message)
  },
  containerMounted(ev: BaseEvent) {
    // console.log('containerMounted', ev)
    const element = ev.container.element
    generateBorderShadow(element, {
      isRect: true,
      isOrigin: false
    })
    matrixTransform = new MatrixTransform(element)
    matrixTransform.updateMatrix()
    generateBorderShadow(element)
  },
  itemMounted(ev: BaseEvent) {
    insertItemContent(ev)
  },
  mousedown(ev: BaseEvent) {
    console.log('mousedown')
  },
  mousemove(ev: BaseEvent) {
    // console.log('mousemove')
    const {clientX, clientY} = ev.mousemoveEvent
    const {x, y} = matrixTransform.transformCoordinates(clientX + window.scrollX, clientY + window.scrollY)
    let offsetX = ev.container.pxToW(x, {keepSymbol: true})
    let offsetY = ev.container.pxToH(y, {keepSymbol: true})
    console.log(
      offsetX,
      offsetY
    )
  },
  mouseup(ev: BaseEvent) {
    console.log('mouseup')
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
  item.contentElement.innerHTML = `<div style="margin-top: 20px">${item.i.toString()}</div>`
  updateStyle({
    fontSize: `${Math.max(30, <number>ev.container.getConfig('itemWidth') / 4)}px`,
    fontWeight: '800',
    color: '#6b798e'
  }, item.contentElement)
}

container1
  .use(plugin)
// .use(createCloseBtnPlugin())
// .use(createShadowElementPlugin())
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

container1.layoutManager.each((curRowPoint: number, curColPoint: number) => {
  // console.log(curColPoint,curRowPoint);
})


import {layoutData11} from "@/stores/layout";
import {plugin} from "@/plugin";
import {Container, fillItemLayoutList, OnMousedown, OnMousemove, OnMouseup} from "@biggerstar/layout";
import {Draggable} from "@biggerstar/layout-plugins";

const container1 = new Container()
console.log(container1)
container1
  .use(plugin)
  // .use(createResizeBtnPlugin())
  // .use(createCloseBtnPlugin())
  // .use(createShadowElementPlugin())

container1.mount('#container1')
// console.log(container1.element.clientWidth, container1.element.clientHeight, container1.element)
container1.setState({
  // autoGrow: {
  //   // vertical: true,
  //   // horizontal: false
  // },
  items: fillItemLayoutList(layoutData11, {
    draggable: true,
    resize: true,
    close: true,
    exchange: true
  }),
  // containerWidth: container1.element.clientWidth,
  // containerWidth: 150,
  // containerWidth: 425,
  containerWidth: 500,
  itemWidth: 60,
  // itemHeight: 50,
  // gapX: 5,
  gapY: 20,
  ratioCol: 0.55,
  ratioRow: 0.4,
})

const draggable = new Draggable(container1)
console.log(draggable)

draggable.use({
  mousedown(ev: OnMousedown) {
    // console.log('mousedown', ev)
  },
  mousemove(ev: OnMousemove) {
    // console.log('mousemove', ev)
  },
  mouseup(ev: OnMouseup) {
    // console.log('mouseup', ev)
  },
  dragging(ev) {
    // console.log(ev)
  },
  dragToLeft(ev) {
    // console.log(ev)
  },
  dragToTop(ev) {
    // console.log(ev)
  },
  dragToRight(ev) {
    // console.log(ev)
  },
  dragToBottom(ev) {
    // console.log(ev)
  },
})
draggable.setState({
  userSelect: false
})




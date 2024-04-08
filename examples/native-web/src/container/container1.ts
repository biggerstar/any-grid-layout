import {layoutData11} from "@/stores/layout";
import {plugin} from "@/plugin";
import {Container, CustomLayoutOptions, fillItemLayoutList} from "@biggerstar/layout";

const container1 = new Container()
console.log(container1)
container1.use(plugin)
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
  gapY: 5,
  // ratioCol: 0 ,
  // ratioRow: 0.1,
})
setTimeout(() => {
  // container1.setState({
  //   items: []
  // })
  let containerWidth = 400
  const layout: Partial<CustomLayoutOptions> = {
    containerWidth: containerWidth,
    // itemWidth: 500,
    // itemHeight: 150,
    // itemHeight: 80,
    // itemWidth: container1.useLayout.itemWidth,
    // gapX: 10,
    // gapY: 5,
    // ratioCol: 0.16
  }
  container1.setState(layout)
  setInterval(() => {
    containerWidth -= 100
    // if (containerWidth < 400) return
    if (containerWidth < 0) {
      return
    }
    container1.setState({
      // itemWidth: containerWidth / 10,
      containerWidth: containerWidth
    })
  }, 1000)

}, 2000)

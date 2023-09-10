import {Container, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData11} from "@/stores/layout";

const container1 = new Container({
  el: '#container1',
  // el: document.getElementById('container1'),
  global: {
    responsive: true,
    layoutMode: 'default',
    dragOut: true,
    exchange: true,
    // ratioCol: 0.2,
    from1: '来自global',
  },
  layouts: {
    responsive: false,
    layoutMode: 'default',
    from: '来自layout',
    items: fillItemLayoutList(layoutData11, {
      draggable: true,
      resize: true,
      close: true,
    }),
    // col: 5,
    // row: 2,
    // ratioCol: 0.2,
    // ratioRow: 0.2,
    // marginX:10,
    margin: [20, 20],
    size: [120, 80],
    // sizeWidth:200,
    // minCol: 5,
    // minRow: 10,
    exchange: true,
    // sizeWidth: 50,
    // sizeHeight: 80,
    // marginX: 30,
    // marginY: 50,
    // autoGrowRow:true,
    // autoGrowCol:true
  },
});


setTimeout(() => {
  // console.log(container1.containerH++);
  // container1.updateContainerStyleSize()
}, 100)

export default container1

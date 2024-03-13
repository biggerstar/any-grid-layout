import {Container, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData, layoutData11} from "@/stores/layout";

const container3 = new Container({
  el: '#container3',
  // el: document.getElementById('container'),
  layout: {
    // from: '来自layout2',
    ratioCol: 0.1,
    // col: 9,
    // row: 4,
    // margin: [20, 10],
    size: [60, 50],
    minCol: 2,
    exchange: true,
    // autoGrow: true,
    items: fillItemLayoutList(layoutData, {
      draggable: true,
      resize: true,
      close: true,
      exchange:true,
      // pos: {
      //   // minH:2,
      //   // maxH:1,
      //   // minW:2,
      //   // maxW:1
      // }
    }),
  },
})

export default container3

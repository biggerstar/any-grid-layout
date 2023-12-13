import {Container, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData11} from "@/stores/layout";

const container1 = new Container({
  el: '#container1',
  // el: document.getElementById('container1'),
  global: {
    responsive: true,
    dragOut: true,
    exchange: true,
    // ratioCol: 0.2,
    from1: '来自global',
  },
  layouts: {
    from: '来自layout',
    // exchange: false,
    autoGrow: {
      // vertical: false,
      // horizontal: false
      vertical: true,
      horizontal: false
    },
    exchange: true,
    direction: 'column',
    // direction: 'row-reverse',
    align: 'end',
    items: fillItemLayoutList(layoutData11, {
      draggable: true,
      resize: true,
      close: true,
      exchange: true
    }),
    // minRow:20,
    // col: 5,
    // row: 2,
    // ratioCol: 0.2,
    // ratioRow: 0.2,
    // marginX:10,
    // margin: [10, 10],
    size: [120, 80],
    // sizeWidth:200,
    // minCol: 5,
    // minRow: 10,
    // sizeWidth: 50,
    // sizeHeight: 80,
    // marginX: 30,
    // marginY: 50,
    // autoGrowRow:true,
    // autoGrowCol:true
  },
});


export default container1

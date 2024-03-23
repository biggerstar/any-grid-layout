import {Container, fillItemLayoutList} from "@biggerstar/layout";
import {layoutData11} from "@/stores/layout";

const container1 = new Container({
  el: '#container1',
  // el: document.getElementById('container1'),
  layout: {
    autoGrow: {
      // vertical: true,
      // horizontal: false
    },
    items: fillItemLayoutList(layoutData11, {
      draggable: true,
      resize: true,
      close: true,
      exchange: true
    }),
    // col: 8,
    // row: 6,
    // itemWidth: 100,
    // itemHeight: 80,
    gapX: 5,
    gapY: 5,
    // ratioCol: 0.2,
    // ratioRow: 0.2,
    // minCol: 5,
    // minRow: 10,
    // marginX: 30,
    // marginY: 50,
  },
});


export default container1

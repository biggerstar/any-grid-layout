import {Container, fillItemLayoutList, Item} from "@biggerstar/layout";
import {layoutData11} from "@/stores/layout";

const container2 = new Container({
  el: '#container2',
  global: {
    ratioCol: 0.1,
    // ratioRow: 0.1,
    layoutMode: 'static',
    responsive: false
  },
  layouts: [
    // {
    //   px: 1300,
    //   col:9,
    //   // margin: [30, 30],
    //   size: [120, 80],
    //   // minCol: 9,
    //   items: fillItemLayoutList(layoutData, {
    //     draggable: true,
    //     resize: true,
    //     close: true,
    //   }),
    // },
    // {
    //   px: 1100,
    //   margin: [20, 20],
    //   size: [90, 80],
    //   // minCol: 7,
    //   items: fillItemLayoutList(layoutData11, {
    //     draggable: true,
    //     resize: true,
    //     close: true,
    //   }),
    // },
    {
      px: 900,
      // col: 9,
      row: 8,
      margin: [10, 10],
      size: [60, 80],
      items: fillItemLayoutList(layoutData11, {
        draggable: true,
        resize: true,
        close: true,
        pos: {
          // minH:2,
          // maxH:1,
          // minW:2,
          // maxW:1
        }
      }),
      // minCol: 5,
    },
    // {
    //   px: 360,
    //   // margin: [0, 0],
    //   size: [36, 80],
    //   items: fillItemLayoutList(layoutData11, {
    //     draggable: true,
    //     resize: true,
    //     close: true,
    //   }),
    //   // minCol: 3,
    // },
  ],
  events: {
    error(err) {
      // console.log(err);
      // err.from.remove()
    },
    itemMounted(item: Item) {
      item.itemContentElement.innerHTML = item.i.toString()
      item.domImpl.updateStyle({
        fontSize: `${<number>item.size[0] / 2}px`,
        fontWeight: '800',
        color: '#6b798e'
      }, item.itemContentElement)

    },
    itemMove(item, nowX, nowY) {
      // console.log(nowX,nowY);

    },
    itemMoved(item, nowX, nowY) {
      // console.log(nowX,nowY);
    },
  },
})

export default container2

/**
 * 某种布局具体实现算法
 * */
import {Layout} from "@/algorithm/Layout";

export class LayoutManager extends Layout {
  constructor() {
    super()
  }


  move(items, dragItem) {
    console.log(dragItem.pos);
    // console.log(this._layoutMatrix);
    // console.log(items, dragItem);
    console.log(this.findCoverItemFromPosition(items, {
      x: 4,
      y: 3,
      w: 2,
      h: 3
    }))

  }


}


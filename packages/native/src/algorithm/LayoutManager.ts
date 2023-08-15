/**
 * 某种布局具体实现算法
 * */
import {Layout} from "@/algorithm/Layout";

export class LayoutManager extends Layout {
  constructor() {
    super()
  }

  // 'default' | 'exchange' | 'stream'

  move(items, dragItem, x, y) {
    // console.log(dragItem.pos, x, y);
    // console.log(this._layoutMatrix);
    // console.log(items, dragItem);
    // console.log(dragItem)

    // console.log(dragItem.pos.getCustomPos());


    //  TODO  通过 static定义是否获取pos时候返回 x,y
    items = this.sortStatic(items)
    const res = this.analysis(items, (item, pos) => {
    })
    res.patch((item) => {
      item = item !== dragItem ? dragItem : item
      this.mark(item.pos)
      item?.updateItemLayout?.()
    })
    return
    console.log(this.findCoverItemFromPosition(items, {
      x: 4,
      y: 3,
      w: 2,
      h: 3
    }))

  }


}


/**
 * 某种布局具体实现算法
 * */
import {Layout} from "@/algorithm/Layout";
import {Item} from "@/main";

export class LayoutManager extends Layout {
  // 'default' | 'exchange' | 'stream'
  /**
   * 某个Item在this.items列表移动到指定位置
   * @param {Item[]} items  item
   * @param {Item} item  item
   * @param {Number} toIndex  移动到哪个索引
   * @dataParam {Number} fromIndex  来自哪个索引
   * */
  public move(items: Item[], item: Item, toIndex: number) {
    if (toIndex < 0) toIndex = 0
    let fromIndex = null
    for (let i = 0; i < items.length; i++) {
      if (items[i] === item) {
        fromIndex = i
        break
      }
    }
    if (fromIndex !== null) {
      // console.log(fromIndex,toIndex)
      items.splice(fromIndex, 1)
      items.splice(toIndex, 0, item)
    }
  }


  /** 交换自身Container中两个Item在this.items的位置 */
  public exchange(items: Item[], itemA: Item, itemB: Item) {
    // console.log(arguments);
    if (items.includes(itemA) && items.includes(itemB)) {
      items[itemA.i] = itemB
      items[itemB.i] = itemA
    }
  }

  moveTo(items, dragItem, x, y) {
    const toPos = {
      ...dragItem.pos,
      x,
      y
    }
    const isCanMove = this.isCanMove(items, dragItem, toPos)
    if (isCanMove) {
      console.log(this.findItemFromXY(items, x, y));

    }

    // console.log(isCanMove)
    // const res = this.analysis(items)
    // res.patch((item) => {
    //   item = item !== dragItem ? dragItem : item
    //   this.mark(item.pos)
    //   item?.updateItemLayout?.()
    // })
    // console.log(dragItem.__ref_use__.pos)
    return
    console.log(this.findCoverItemsFromPosition(items, {
      x: 4,
      y: 3,
      w: 2,
      h: 3
    }))

  }


}


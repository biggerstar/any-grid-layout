import {Item} from "@/main";
import {CustomItemPos, ItemLimitType} from "@/types";

export abstract class Finder {
  public abstract get col(): number

  public abstract get row(): number

  /**
   *  找当前矩阵下x,y位置当前存在的item
   *
   *  @return {Item | null}
   * */
  public findItemFromXY(items = [], fromX: number, fromY: number): Item | null {
    let pointItem = null
    let lastY = 1
    if (items.length === 0) return null
    for (let i = 0; i < items.length; i++) {
      let item: Item = items[i]
      if (!item) continue
      const {x, y, w, h} = item.pos
      const xItemStart = x
      const yItemStart = y
      const xItemEnd = x + w - 1
      const yItemEnd = y + h - 1

      if (xItemStart !== fromX) continue
      if (fromY > lastY) fromY = lastY
      if (x => xItemStart && x <= xItemEnd && fromY >= yItemStart && fromY <= yItemEnd) {
        if (fromX === xItemStart && fromY === yItemStart) pointItem = item
      }
    }
    return pointItem
  }

  /** 寻找某个指定矩阵范围内包含的所有Item,下方四个变量构成一个域范围;
   *  Item可能不完全都在该指定矩阵范围内落点，只是有一部分落在范围内，该情况也会被查找收集起来
   *  若传入pos可设定w = 1, h = 1, 这样可以直接查某个点的item
   *
   *  @param items 在该Items列表中查找
   *  @param pos  x坐标
   *
   *  @return {Item[]}
   * */
  public findCoverItemsFromPosition(items, pos: CustomItemPos): Item[] {
    const {x, y, w, h} = pos
    const resItemList = []
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      //------------------------要找的域----------------------------//
      const xBoundaryStart = x       // 左边界
      const yBoundaryStart = y       // 上边界
      const xBoundaryEnd = x + w - 1  //  右边界
      const yBoundaryEnd = y + h - 1  // 下边界
      //----------------------遍历item的域--------------------------//
      const xItemStart = item.pos.x          // Item左边界
      const yItemStart = item.pos.y           // Item上边界
      const xItemEnd = item.pos.x + item.pos.w - 1    // Item右边界
      const yItemEnd = item.pos.y + item.pos.h - 1    // Item下边界
      //------------------------碰撞检测---------------------------//
      if ((xItemEnd >= xBoundaryStart && xItemEnd <= xBoundaryEnd      // 左边界碰撞
          || xItemStart >= xBoundaryStart && xItemStart <= xBoundaryEnd  // X轴中间部分碰撞
          || xBoundaryStart >= xItemStart && xBoundaryEnd <= xItemEnd)    // 右边界碰撞
        && (yItemEnd >= yBoundaryStart && yItemEnd <= yBoundaryEnd      // 左边界碰撞
          || yItemStart >= yBoundaryStart && yItemStart <= yBoundaryEnd  // Y轴中间部分碰撞
          || yBoundaryStart >= yItemStart && yBoundaryEnd <= yItemEnd)      // 下边界碰撞
        || (xBoundaryStart >= xItemStart && xBoundaryEnd <= xItemEnd     // 全包含,目标区域只被某个超大Item包裹住的情况(必须要)
          && yBoundaryStart >= yItemStart && yBoundaryEnd <= yItemEnd)
      ) {
        resItemList.push(item)
      }
    }
    return resItemList
  }

  /**
   * 在静态和响应式布局中通过指定的Item找到该Item在矩阵中最大的resize空间
   * 函数返回maxW和maxH代表传进来的对应Item在矩阵中最大长,宽
   * 数据来源于this.items的实时计算
   *
   * @param items 在哪个列表中计算
   * @param itemPoint 要计算矩阵中最大伸展空间的Item，该伸展空间是一个矩形
   *
   * @return {{maxW: number, maxH: number,minW: number, minH: number}}  maxW最大伸展宽度，maxH最大伸展高度,minW最小伸展宽度，maxH最小伸展高度
   * */
  public findStaticBlankMaxMatrixFromItem(items = [], itemPoint: Item): ItemLimitType {
    const {x, y, w, h} = itemPoint.pos
    let maxW = this.col - x + 1   // X轴最大活动宽度
    let maxH = this.row - y + 1   // Y轴最大活动宽度
    let minW = maxW  // X轴最小活动宽度
    let minH = maxH  // Y轴最小活动宽度
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const pos = item.pos
      if (!item.static) continue   // 响应式布局中只找限定static的Item空间
      if (itemPoint === item) continue
      if (pos.x + pos.w - 1 < x || pos.y + pos.h - 1 < y) continue   // 上和左在x,y点外的Item不考虑
      //  思路：右方向最大(maxW && minH) :上方向最大(minW && maxH)
      // if (pos.x === x && pos.y === y) continue
      if (pos.x >= x && pos.x - x < maxW) {
        if (((y + h - 1) >= pos.y && (y + h - 1) <= (pos.y + pos.h - 1)
          || (pos.y + pos.h - 1) >= y && (pos.y + pos.h - 1) <= (y + h - 1))) {    // 横向计算X空白处
          maxW = pos.x - x
        }
      }
      if (pos.y >= y && pos.y - y < maxH) {
        if (((x + w - 1) >= pos.x && (x + w - 1) <= (pos.x + pos.w - 1)
          || (pos.x + pos.w - 1) >= x && (pos.x + pos.w - 1) <= (x + w - 1))) {  // 纵向计算Y空白处
          maxH = pos.y - y
        }
      }
      if (pos.x >= x && pos.x - x < minW) {
        if (((y + maxH - 1) >= pos.y && (y + maxH - 1) <= (pos.y + pos.h - 1)
          || (pos.y + pos.h - 1) >= y && (pos.y + pos.h - 1) <= (y + maxH - 1))) {    // 横向计算X最小空白处
          minW = pos.x - x
        }
      }
      if (pos.y >= y && pos.y - y < minH) {
        if (((x + maxW - 1) >= pos.x && (x + maxW - 1) <= (pos.x + pos.w - 1)
          || (pos.x + pos.w - 1) >= x && (pos.x + pos.w - 1) <= (x + maxW - 1))) {  // 纵向计算Y空白处
          minH = pos.y - y
        }
      }
    }
    // console.log(minW,minH,maxW,maxH)
    return {
      maxW,    // 当前item的pos中x,y,w,h指定位置大伸展宽度
      maxH,    // 最大伸展高度(同上)
      minW,    // 最小伸展宽度(同上)
      minH     // 最小伸展高度(同上)
    }
  }

  /**
   * 获取当前矩阵中横向优先遍历获得的items列表
   * 比如1 X 1 开始，到 1 X 5
   * 之后2 X 1 开始，到 2 X 5
   * ......
   * */
  public sortCurrentMatrixItems(items: Item[]) {
    const sortItems = []
    for (let y = 1; y <= this.row; y++) {
      for (let x = 1; x <= this.col; x++) {
        //------------------------------------
        for (let index = 0; index < items.length; index++) {
          const item = items[index]
          if (x >= item.pos.x && x < (item.pos.x + item.pos.w)
            && y >= item.pos.y && y < (item.pos.y + item.pos.h)) {
            if (!sortItems.includes(item)) {
              sortItems.push(item)
            }
            break
          }
        }
        //-------------------------------------
      }
    }
    return sortItems
  }
}




import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";

export class StreamLayout extends Layout {
  public name = 'stream'
  public wait = 50

  public isEdge(fromPos, toPos, curPos) {

    const {x: toX, y: toY, w: toW, h: toH} = toPos
    const {x: fromX, y: fromY} = fromPos

    const offsetX = toX - fromX
    const toEndX = toW + toX - 1

    if (offsetX > 0 && toEndX === curPos.x) return true
    else if (offsetX < 0 && toX === curPos.x) return true
    else return false

    console.log('from', fromX, fromY, 'to', toX, toY)
    console.log(offsetX)
    // if (mouseX !== toEndX) return false
    // return true
    // console.log(toEndX)
    // console.log(offsetX)


    // console.log(mousePointPos, {
    //   x:toPos.x,
    //   y:toPos.y,
    // })


  }

  /** 进行布局
   * @param items
   * @param dragItem
   * @param x  item的左上角X坐标，endX 是x坐标加上w - 1
   * @param y  item的左上角Y坐标，endY 是y坐标加上h - 1
   * */
  public layout(items: Item[], dragItem: Item, x: number, y: number): void {
    const manager = this.manager
    const endX = x + dragItem.pos.w - 1
    const endY = y + dragItem.pos.h - 1
    const mousePointPos = {
      ...dragItem.pos,
      x,
      y
    }
    const isCanMove = manager.isCanMove(items, dragItem, mousePointPos)
    // console.log(isCanMove)
    // console.log(x, endX, y, endY);
    const toItem = manager.findCoverItemsFromPosition(items, mousePointPos).filter((v) => v !== dragItem)[0]
    // console.log(toItem)
    if (!isCanMove || !toItem) return;
    const foundToIndex = items.findIndex((item) => item === dragItem)
    // if (foundToIndex < 0) return
    let wait = 60
    // console.log(111111111111111111)
    // const isExchange = this.isEdge(dragItem.pos, toItem.pos, mousePointPos)
    // console.log(isExchange);
    // if (!isExchange) return;
    // if (!this.isEdge(mousePointPos, toItem.pos)) return;

    // const {x: dragX, y: dragY, _lastPos = {}} = dragItem.pos
    // // console.log(this.hasPassed(dragItem.pos), this.pathPassed)
    // console.log(_lastPos.x === dragX , _lastPos.y === dragY)
    // if (_lastPos && _lastPos.x === dragX && _lastPos.y === dragY) {
    //   console.log(111111111111111111)
    //   wait = 500
    // }

    // const lastPos = this.pathPassed[1] || {}

    // if (lastPos.x === dragItem.pos.x && lastPos.y && dragItem.pos.y){
    //   console.log(111111111111111111)
    // }
    // console.log(lastPos,{
    //   x:dragItem.pos.x,
    //   y:dragItem.pos.y,
    // });

    // console.log(this.hasPassed(mousePointPos));

    this.throttle(() => {
      dragItem.pos._lastPos = {...dragItem.pos}
      manager.move(items, dragItem, toItem)
      this._addHistory(dragItem.pos)
    }, wait)
  }
}

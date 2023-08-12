import {merge} from "@/utils/tool";
import {Item} from "@/main/item/Item";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";

export class ItemPos extends ItemPosGeneralImpl {
  [key: string]: any

  // public get col(): number {
  //   return this.belongItem.container.getConfig("col")
  // }
  //
  // public get row(): number {
  //   return this.belongItem.container.getConfig("row")
  // }

  public belongItem?: Item
  public el?: Element
  public i?: number
  public initialX?: number    //  第一次传入的X值
  public initialY?: number    //  第一次传入的Y值
  public iName?: string = ''
  public nextStaticPos?: ItemPos | null
  public tempW?: number    // 临时宽度，用于溢出栅格后适配临时作为item的宽
  public tempH?: number    // 临时高度，用于溢出栅格后适配临时作为item的高

  public beforePos?: ItemPos   //  跨容器时候保存上一个容器的位置
  public autoOnce?: boolean  // 静态布局下在下一次指定是否自动寻找容器中的空位
  public posHash?: string = ''  // 每个pos的唯一hash，可能重复
  constructor(pos) {
    super()
    this._define()
    if (typeof pos === 'object') this.update(pos)
    for (let i = 0; i < 4; i++) {
      this.posHash = this.posHash + String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0))
    }
  }

  _define() {
    let tempW = null
    let tempH = null
    Object.defineProperties(<object>this, {
      // w: {
      //     get: () => {  //  只要存在临时宽度则直接获取临时宽度
      //         return tempW ? tempW : w
      //     },
      //     set: (v) => {
      //         if (w === v || typeof v !== 'number' || !isFinite(v)) return
      //         if (v <= 0) w = 1
      //         else w = v
      //         if (w !== null && w === tempW){
      //             // console.log(tempW,v,w);
      //             tempW = null
      //         }
      //     }
      // },
      // h: {
      //     get: () => {
      //         return tempH ? tempH : h
      //     },
      //     set: (v) => {
      //         if (h === v || typeof v !== 'number' || !isFinite(v)) return
      //         if (v <= 0) h = 1
      //         else h = v
      //         if (h === tempH) tempH = null
      //     }
      // },
      tempW: {
        get: () => {
          // if (this.w === tempW) tempW = null // 只要原本的宽度和临时的宽度相等，说明已经复位，重置tempW为null
          // if (this.w > 8)console.log(tempW);
          return tempW
        },
        set: (v) => {
          if (typeof v !== 'number' || !isFinite(v)) return
          if (v === this.w) {
            tempW = null
            return
          }
          if (v <= 0) tempW = 1
          else tempW = v
        }
      },
      tempH: {
        get: () => {
          // if (this.h === tempH) tempH = null
          return tempH
        },
        set: (v) => {
          if (typeof v !== 'number' || !isFinite(v)) return
          if (v === this.h) {
            tempH = null
            return
          }
          if (v <= 0) tempH = 1
          else tempH = v
        }
      },
    })
  }

  update(pos) {
    // console.log(pos);
    merge(this, this._typeCheck(pos))
    return this
  }

  export(otherFieldList = []): any {
    const exportFields = {}
    Object.keys(this).forEach((posKey) => {
      if (['w', 'h', 'x', 'y'].includes(posKey)) {
        exportFields[posKey] = this[posKey]
      }
      if (['minW', 'minH'].includes(posKey)) {
        if (this[posKey] > 1) exportFields[posKey] = this[posKey]
      }
      if (['maxW', 'maxH'].includes(posKey)) {
        if (this[posKey] !== Infinity) exportFields[posKey] = this[posKey]
      }
      if (otherFieldList.includes(posKey)) {
        if (this[posKey]) exportFields[posKey] = this[posKey]
      }
    })
    return exportFields
  }

  _typeCheck(pos) {
    Object.keys(pos).forEach((posKey) => {
      if (['w', 'h', 'x', 'y', 'col', 'row', 'minW', 'maxW', 'minH', 'maxH', 'tempW', 'tempH'].includes(posKey)) {
        if (pos[posKey] === Infinity) return
        if (pos[posKey] === undefined) return
        if (pos[posKey] === null) return
        pos[posKey] = parseInt(pos[posKey].toString())
        // if (pos[posKey] === 'tempW') console.log(111111111111111111)
      }
      if (posKey === 'x') this.initialX = parseInt(pos[posKey].toString())
      if (posKey === 'y') this.initialY = parseInt(pos[posKey].toString())
    })
    // console.log(pos);
    return pos
  }
}

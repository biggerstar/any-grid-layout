import {merge} from "@/utils/tool";
import {Item} from "@/main/item/Item";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";

export class ItemPos extends ItemPosGeneralImpl {
  [key: string]: any
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
    const self = this
    let tempW = null
    let tempH = null
    let w = 1
    let h = 1
    Object.defineProperties(<object>this, {
      /** 限制宽度设置和获取，获取到的宽度已经是经过maxW和minW限制过的最终结果，可以安全获取 */
      w: {
        get: () => w,
        set: (v) => {
          let limitW = v
          const {maxW, minW} = self
          if (!isFinite(maxW) && minW > maxW) limitW = maxW
          else if (w < minW) limitW = minW
          else if (!isFinite(maxW) && w > maxW) limitW = maxW
          w = limitW
        }
      },
      /** 限制宽度设置和获取，获取到的宽度已经是经过maxH和minH限制过的最终结果，可以安全获取 */
      h: {
        get: () => h,
        set: (v) => {
          let limitH = v
          const {maxH, minH} = self
          if (!isFinite(maxH) && minH > maxH) limitH = maxH
          else if (w < minH) limitH = minH
          else if (!isFinite(maxH) && w > maxH) limitH = maxH
          h = limitH
        }
      },
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

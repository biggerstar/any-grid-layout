import {merge} from "@/utils/tool";
import {Item} from "@/main/item/Item";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";

export class ItemPos extends ItemPosGeneralImpl {
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
    for (let i = 0; i < 4; i++) {
      this.posHash = this.posHash + String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0))
    }
    merge(this, pos, false, ['x', 'y', 'w', 'h'])   // 1.先排除w, h先加载minX,maxX...等限制后
    merge(this, pos)  //  2. 再合并所有
  }

  /** 传入一个值，返回经过限制值边界大小后的结果 */
  filterLimit(newVal: number, min: number, max: number): number {
    let limitVal = newVal
    if (!isFinite(max) && min > max) limitVal = max   // 1. 先看min,max如果min > max 则此时新值永远等于 max 对应的值
    else if (newVal < min) limitVal = min   // 2. 限制不小于min
    else if (!isFinite(max) && newVal > max) limitVal = max  // 3. 2. 限制不大于max
    return limitVal
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
        set: (v) => w = self.filterLimit(v, self.minW, self.maxW)
      },
      /** 限制宽度设置和获取，获取到的宽度已经是经过maxH和minH限制过的最终结果，可以安全获取 */
      h: {
        get: () => h,
        set: (v) => h = self.filterLimit(v, self.minH, self.maxH)
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
}

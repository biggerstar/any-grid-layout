import {merge} from "@/utils/tool";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";
import {CustomItemPos} from "@/types";
import {isNumber} from "is-what";

export class ItemPos extends ItemPosGeneralImpl {
  public i?: number
  public _default?: ItemPosGeneralImpl  // 框架默认配置
  public customOptions?: CustomItemPos

  constructor(pos: CustomItemPos) {
    super()
    this._default = Object.freeze(new ItemPosGeneralImpl()) // 必须在_defineXXX 之前
    this.customOptions = pos
    this.defineSyncCustomOptions(pos)
    merge(this, pos, false, ['x', 'y', 'w', 'h'])   // 1.先排除w, h先加载minX,maxX...等限制后
    merge(this, pos)  //  2. 再合并所有
  }

  /** 传入一个值，返回经过限制值边界大小后的结果 */
  private limitSize(newVal: number, min: number, max: number): number {
    if (min >= max) {
      newVal = max // 1. 先看min,max如果min > max 则此时新值永远等于 max 对应的值
    } else if (newVal > max) {
      newVal = max  // 2. 限制不大于max
    } else if (newVal < min) {
      newVal = min   // 3. 限制不小于min
    }
    return newVal
  }

  /**
   * 定义如何将最新状态的配置同步到用户传入的原始配置上
   * */
  public defineSyncCustomOptions(_customOptions: CustomItemPos) {
    const self = this
    const _default = this._default

    const _tempPos = {}  // 用于部分无法设置到用户pos上的状态保留对象，在get的时候能获取
    const getCurPos = () => _customOptions || {}  // 防止直接替换原本用户外部pos引用
    const getCurPosValue = (k) => {
      const curCustomOptions = getCurPos()
      return curCustomOptions.hasOwnProperty(k) ? curCustomOptions[k] : (_tempPos[k] || _default?.[k])
    }
    const get = (k: keyof ItemPosGeneralImpl) => {
      /* 限制宽度设置和获取，获取到的宽度已经是经过maxW和minW限制过的最终结果，可以安全获取 */
      if (k === 'w') {
        return self.limitSize(_tempPos[k] || getCurPos()[k], self.minW, self.maxW)
      }
      /* 限制宽度设置和获取，获取到的宽度已经是经过maxH和minH限制过的最终结果，可以安全获取 */
      if (k === 'h') {
        return self.limitSize(_tempPos[k] || getCurPos()[k], self.minH, self.maxH)
      }
      if (k === 'x' || k === 'y') {
        const val = getCurPosValue(k)
        return isNumber(val) ? Math.max(1, val) : val
      }
      return getCurPosValue(k)
    }
    const set = (k: keyof ItemPosGeneralImpl, v: any) => {
      // /* 限制宽度设置和获取，获取到的宽度已经是经过maxW和minW限制过的最终结果，可以安全获取 */
      // if (k === 'w') v = self.limitSize(v, self.minW, self.maxW)
      // /* 限制宽度设置和获取，获取到的宽度已经是经过maxH和minH限制过的最终结果，可以安全获取 */
      // if (k === 'h') v = self.limitSize(v, self.minH, self.maxH)
      const curCustomOptions = getCurPos()
      if (['w', 'h', 'x', 'y'].includes(<string>k)) {  // 如果是x,y,w,h外面没有指定则不会修改用户传入配置
        curCustomOptions.hasOwnProperty(k) ? curCustomOptions[k] = v : _tempPos[k] = v
      } else {  // 如果是minX,maxX等,不等于默认值则会直接修改用户传入的配置
        if (v !== _default?.[k]) {
          curCustomOptions[k] = v
        }
      }
    }
    for (const k in _default) {
      Object.defineProperty(<object>this, k, {
        get: () => get(<any>k),      /* 优先获取用户配置,没有的话则获取item默认配置 */
        set: (v) => set(<any>k, v)   /* 如果原本的pos上没有定义该值，则不需要同步到用户配置上  */
      })
    }
  }

  /**
   * 获取计算后受minX，maxX限制的pos
   * */
  public getComputedCustomPos() {
    const result = {}
    for (const name in this.customOptions) {
      result[name] = this[name]
    }
    return result
  }
}

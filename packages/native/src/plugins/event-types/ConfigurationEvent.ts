import {BaseEvent} from "@/plugins";
import {ContainerGeneralImpl} from "@/main";
import {computeSmartRowAndCol} from "@/algorithm/common";
import {SmartRowAndColType} from "@/types";

/**
 * 设置和获取配置的事件对象
 * */
export class ConfigurationEvent extends BaseEvent {
  public readonly configName: keyof ContainerGeneralImpl
  public configData: any
  private _smart
  private _containerW
  private _containerH

  /**
   * 当获取的col 和 row 时，获取的当前已经布局的items中(x,y,w,h)计算的占用尺寸
   * */
  public get smart(): SmartRowAndColType {
    if (this._smart) return this._smart
    return this._smart = computeSmartRowAndCol(this.container)
  }

  constructor(opt) {
    super(opt);
  }

  public get containerW() {
    return this._containerW || (this._containerW = this.container.containerW)
  }

  public get containerH() {
    return this._containerH || (this._containerH = this.container.containerH)
  }

  /**
   * 获取默认算法计算出来的 col 值
   * [用于静态布局,动态布局由插件自由实现]
   * */
  public getCol(): number {
    const container = this.container
    let data = this.configData
    //-------------------如果不是动态的col，则以当前containerW为准------------------//
    if (!data) {  // 未指定col自动设置
      const smartCol = this.smart.smartCol
      const containerW = this.containerW
      let matrixCol = -Infinity
      if (!container.autoGrowCol) matrixCol = container.layoutManager.col
      if (!container._mounted) data = Math.max(smartCol, containerW)
      else data = Math.max(smartCol, containerW, matrixCol)  // 以最大col为主，smartCol超出用smartCol，小于则用containerW
    }
    // console.log('col',data)
    return data
  }

  /**
   * 获取默认算法计算出来的 row 值
   * [用于静态布局,动态布局由插件自由实现]
   * */
  public getRow(): number {
    const container = this.container
    let data = this.configData
    //-------------------如果不是动态的row，则以当前containerH为准------------------//
    if (!data) {  // 未指定row自动设置
      const smartRow = this.smart.smartRow
      // console.log(smartRow)
      const containerH = this.containerH
      // console.log(containerH)
      let matrixRow = -Infinity
      if (!container.autoGrowRow) matrixRow = container.layoutManager.row
      if (!container._mounted) data = Math.max(smartRow, containerH)
      else data = Math.max(smartRow, containerH, matrixRow)  // 同上
    }
    // console.log('row',data,container)
    return data
  }
}


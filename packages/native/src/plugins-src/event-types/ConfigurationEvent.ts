import {BaseEvent} from "@/plugins-src";
import {ContainerGeneralImpl} from "@/main";
import {computeSmartRowAndCol} from "@/algorithm/common";
import {SmartRowAndColType} from "@/types";

/**
 * 设置和获取配置的事件对象
 * */
export class ConfigurationEvent extends BaseEvent {
  public readonly configName: keyof ContainerGeneralImpl | string
  public configData: any
  private _smart: any

  /**
   * 当获取的col 和 row 时，获取的当前已经布局的items中(x,y,w,h)计算的占用尺寸
   * */
  public get smart(): SmartRowAndColType {
    if (this._smart) {
      return this._smart
    }
    return this._smart = computeSmartRowAndCol(this.container)
  }

  constructor(opt: any) {
    super(opt);
    this.configName = ''
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
      const autoGrowCol = container.autoGrowCol
      if (autoGrowCol) data = smartCol   // 自动增长就以智能计算的为主 ( fix: 修复了挂载点元素自动撑开后回缩一卡一卡的问题 )
      else if (!autoGrowCol && !container._mounted) {
        data = Math.max(smartCol, container.containerW) // 首次加载以容器大小为主，后面则智能计算
      } else {
        data = container.layoutManager.col
      }
    }
    // console.log('col', data)
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
      const autoGrowRow = container.autoGrowRow
      // console.log(autoGrowRow,smartRow)
      // console.log(containerH)
      if (autoGrowRow) data = smartRow   // 自动增长就以智能计算的为主
      else if (!autoGrowRow && !container._mounted) {
        data = Math.max(smartRow, container.containerH)
      } else {
        data = container.layoutManager.row
      }
    }
    return data
  }
}


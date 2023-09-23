import {Container} from "@/main";
import {BaseLineType} from "@/types";

// /**
//  * 判断当前container的baseline方向盒子是否能自动增长
//  * */
// export function hasAutoDirection(container: Container, baseline: BaseLineType) {
//   if (['top', 'bottom'].includes(baseline) && container.autoGrowRow) return true
//   else if (['left', 'right'].includes(baseline) && container.autoGrowCol) return true
//   return false
// }

/**
 * [响应式布局] 添加默认算法计算的响应式计算col或row结果
 * */
export function patchResponsiveColOrRow(ev) {
  let {configName, configData} = ev
  const container = ev.container
  const getBaseLine = () => container.getConfig('baseline')
  if (configName === 'col') {
    const containerW = ev.containerW
    if (container.autoGrowCol) {
      configData = Math.max(containerW, ev.smart.maxItemW)  // 如果计算出来的col小于当前尺寸最大item的宽，则以最大item的宽为准
      if (['left', 'right'].includes(getBaseLine())) {
        configData = Math.max(configData, ev.smart.smartCol)
      }
    }
    ev.configData = configData
  }
  if (configName === 'row') {
    const containerH = ev.containerH
    if (container.autoGrowRow) {
      configData = Math.max(containerH, ev.smart.maxItemH)  // 同上
      if (['top', 'bottom'].includes(getBaseLine())) {
        configData = Math.max(configData, ev.smart.smartRow)
      }
    }
    ev.configData = configData
  }
}

// noinspection JSUnusedGlobalSymbols

import {definePlugin} from "@/global";
import {BaseEvent, ConfigurationEvent} from "@/plugins";


export const ConfigBehavior = definePlugin({
  /**
   * 每次挂载或者卸载后挂载都会同步相关配置
   * */
  $containerMountBefore(ev: BaseEvent) {
    const {layoutManager, container} = ev
    layoutManager.direction = container.getConfig("direction")
    layoutManager.align = container.getConfig("align")
    layoutManager.autoGrow = container.getConfig("autoGrow")
  },
  $getConfig(ev: ConfigurationEvent) {
    if (ev.configName === 'col') ev.configData = ev.getCol()
    if (ev.configName === 'row') ev.configData = ev.getRow()
  },
  /**
   * 做经过插件之后的最终工作
   * @default 做对最终minCol，minRow的最终限制
   * */
  getConfig(ev: ConfigurationEvent) {
    let {configName, configData} = ev
    //-----------------------------Col限制确定---------------------------------//
    if (configName === 'col') {
      const curMinCol = ev.container.getConfig('minCol')
      if (curMinCol && configData < curMinCol) ev.configData = curMinCol
    }
    //-----------------------------Row限制确定---------------------------------//
    if (configName === 'row') {
      const curMinRow = ev.container.getConfig('minRow')
      if (curMinRow && configData < curMinRow) ev.configData = curMinRow
    }
  },
  $setConfig(_: ConfigurationEvent) {
  },
  setConfig(_: ConfigurationEvent) {
  }
})

import {CustomItem, CustomItems, GridPlugin} from "@/types";
import {cloneDeep, mergeDeep} from "@/utils";

/**
 * 为传入的items填充默认数据, 会返回一个深度克隆后的对象
 * 合并方式: 使用 `Object.assign` 合并首层数据
 * 比如
 * @param items  最小可用成员构造对象数组，比如 {pos: {w: 1,h: 1 }}
 * @param fillFields  要为items所有成员添加 填充 的字段
 * @param isDeepClone 是否强制使用fillFields覆盖原本items成员数组，内部使用Object.assign函数实现fillFields覆盖item对象键值
 * @example
 *    const items = [{
 *      pos:{w:h}
 *    }]
 *    // 调用函数
 *    fillInItemLayoutList(items,{ close:true })
 *    //  items结果: [{  pos:{w:h},close:true }]
 * */
export function fillItemLayoutList(items: CustomItems = [], fillFields: CustomItem = {}, isDeepClone: boolean = true): CustomItems {
  return items.map((item) => {
    if (isDeepClone) item = cloneDeep(item)
    item = mergeDeep(item, fillFields)
    return item
  })
}

/**
 * 定义插件函数，目的是获得类型提示
 * */
export function definePlugin(plugin: GridPlugin & Record<string | symbol | number, any>) {
  return plugin
}


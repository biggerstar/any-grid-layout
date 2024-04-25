import {CustomItem, GridPlugin} from "@/types";
import {cloneDeep, mergeDeep} from "@/utils";

/**
 * 为传入的items填充默认数据, 会返回一个深度克隆后的对象
 * 合并方式: 使用 `Object.assign` 合并首层数据
 * 比如
 * @param items  最小可用成员构造对象数组，比如 {pos: {w: 1,h: 1 }}
 * @param fillFields  要为items所有成员添加 填充 的字段
 * @param opt
 * @param opt.isDeepClone
 * @param opt.autoKey
 * @example
 *    const items = [{
 *      pos:{w:h}
 *    }]
 *    // 调用函数
 *    fillInItemLayoutList(items, { xxx:true })
 *    //  items结果: [{ pos:{w:h}, xxx:true }]
 * */
export function fillItemLayoutList(items: Array<Partial<CustomItem>>, fillFields: Omit<CustomItem, 'pos'>, opt: Partial<{
  isDeepClone: boolean,
  autoKey: boolean
}> = {}): CustomItem[] {
  const {isDeepClone = true, autoKey = true} = opt
  return items.map((item: CustomItem, index: number) => {
    if (isDeepClone) {
      item = cloneDeep(item)
    }
    item = mergeDeep(item, fillFields || {})
    if (autoKey && !item.key) {
      item.key = index.toString()
    }
    return item
  })
}

/**
 * 定义插件函数，目的是获得类型提示
 * */
export function definePlugin(plugin: GridPlugin & Record<string | symbol | number, any>) {
  return plugin
}


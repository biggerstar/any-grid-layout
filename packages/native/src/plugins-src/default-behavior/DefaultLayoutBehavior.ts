// noinspection JSUnusedGlobalSymbols

import {calculateContainerParameters} from "@/algorithm/common";
import {definePlugin} from "@/global";
import {GridPlugin} from "@/types";
import {BaseEvent, ContainerSizeChangeEvent} from "@/plugins-src";
import {Container, Item} from "@/main";

/**
 * TODO 进行重构 弃用flip翻转， 布局方向由 position的 left top right bottom控制，可以紧贴边界更符合直观
 * 内置默认布局，外面没有阻止默认行为的时候执行的函数,默认是静态布局，要实现响应式布局需要自行通过插件实现
 * */
export const DefaultLayoutBehavior = definePlugin(<GridPlugin>{
  /**
   * 用于作为主布局算法时，「初次加载」Item到容器时初始化，用于设置容器的大小或其他操作
   * 内置已经实现，支持用户阻止init默认行为自行实现
   * 返回结果: 如果failed长度不为0，表明有item没添加成功则会抛出警告事件
   * */
  containerMounted(ev: BaseEvent) {
    const {container} = ev
    const {layoutManager: manager} = container as Container
    const sizeInfo = calculateContainerParameters(container)  // 1.先初始化配置作为容器创建的元配置
    // console.log(sizeInfo)
    for (const name in sizeInfo) {   // 临时设置容器配置
      container.setConfig(<any>name, sizeInfo[name])
    }
    container.reset(container.getConfig('col'), container.getConfig('row'))
    const res = manager.analysis()   // 2. 分析当前布局
    res.patch()                      // 3. 修改当前item位置
    container.updateContainerSizeStyle(res)  // 4.将当前所有最终items的col,row最终容器大小设置到container
    container.items = res.successItems
    container.items.forEach((item: Item) => item.mount())   // 6. 挂载item到dom上
    res.successItems.forEach((item: Item) => item.updateItemLayout())
    if (!res.isSuccess) {
      container.bus.emit('error', {
        type: 'ContainerOverflowError',
        message: `容器溢出或者Item重叠:
        1.您可以检查一下container挂载点元素是否未设置宽或高
        2.您可以配置 autoGrow 来自动撑开容器
         `,
        from: res
      })
    }
  },

  $containerResizing(ev: ContainerSizeChangeEvent) {
    const STRect = ev.container.STRect
    STRect.updateCache("containerIns")
    STRect.updateCache("containerContent")
  },

  containerResizing(ev: ContainerSizeChangeEvent) {
    ev.container.bus.emit("updateLayout")
  },

  /**
   * 自动执行响应式布局贴近网格
   * 布局算法自行实现更新逻辑
   * @param ev 如果没有传入customEv的时候默认使用的事件对象
   * ev.event 开发者如果传入customEv则会替代默认ev事件对象，customEv应当包含修改过后的items或者使用addModifyItem添加过要修改的成员
   * */
  updateLayout(_: any) {
    // return
    // const container = ev.container
    // (container || tempStore.fromContainer)?.updateContainerSizeStyle?.()
    // container.items.forEach((item: Item) => item.updateItemLayout())
  }
})


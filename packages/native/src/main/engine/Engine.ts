import {Item} from "@/main/item/Item";
import {Container} from "@/main/container/Container";
import {ContainerInstantiationOptions, CustomItem} from "@/types";

export class Engine {
  public items = []
  private container: Container
  private readonly options: ContainerInstantiationOptions
  private initialized = false
  private __temp__ = {
    // firstSync: true,
    responsiveFunc: null,
    firstLoaded: false,
    staticIndexCount: 0,
    previousHash: '',   // 当前items通过每个pos计算得到hash特征
  }

  constructor(options: any = {}) {  //  posList用户初始未封装成ItemPos的数据列表
    this.options = options    // 拿到和Container同一份用户传入的配置信息
  }

  public setContainer(container: Container): void {
    this.container = container
  }

  public init() {
    if (this.initialized) return
    this.initLayoutInfo()
    this.mountAll()
    this.container.bus.emit('init')
    this.initialized = true
  }

  /**
   * 用于提取用户传入的[所有]布局配置文件到 container.layouts
   * */
  public initLayoutInfo() {
    const options: Record<any, any> = this.options
    let layoutInfo = []
    if (Array.isArray(options.layouts)) layoutInfo = options.layouts         // 传入的layouts字段Array形式
    else if (typeof options.layouts === "object") layoutInfo.push(options.layouts)     // 传入的layouts字段Object形式
    else throw new Error("请传入layout配置信息")
    if (Array.isArray(layoutInfo) && layoutInfo.length > 1) {
      let isBreak = false
      layoutInfo.sort((a, b) => {
        if (isBreak) return 0
        if (typeof a.px !== "number" || typeof b.px !== "number") {
          console.warn("未指定layout的px值,传入的layout为", b)
          isBreak = true
        }
        return a.px - b.px
      })
    }
    this.container.layouts = JSON.parse(JSON.stringify(layoutInfo))    // items 可能用的通个引用源，这里独立给内存地址，这里包括所有的屏幕适配布局，也可能只有一种默认实例化未通过挂载layouts属性传入的一种布局
    // console.log(layoutInfo);
  }

  private mountAll() {
    let items = this.container.getConfig('items')
    items.forEach((item) => this.addItem(item))
  }

  /**
   * 计算当前Items的特征，如果[ Item列表长度,宽高，位置 ] 变化会触发updated变化
   * 目的: 支持并发出 updated 事件
   *  */
  private _checkUpdated() {
    let hashContent = ''
    this.items.forEach((item) => {
      const pos = item.pos
      hashContent = hashContent + pos.posHash + (pos.w || pos.tempW) + (pos.h || pos.tempH) + pos.x + pos.y + ';'
    })
    if (this.__temp__.previousHash !== hashContent) {
      this.container.bus.emit('updated')
      this.__temp__.previousHash = hashContent
    }
  }


  /** 根据当前的 i 获取对应的Item.pos.i  */
  public index(indexVal: number): void | Item {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].i === indexVal) return this.items[i]
    }
  }

  /** 将item成员从Container中全部移除,items数据还在  */
  public unmount(isForce = false) {
    this.items.forEach((item: Item) => item.unmount(isForce))
    this.reset()
  }

  /** 将item成员从Container中全部移除，之后重新渲染  */
  public remount() {
    this.unmount()
    this.container.mount()
  }

  /** 添加一个item，框架内部添加Item时所有的Item必须通过这里添加到容器中 */
  public addItem(itemOptions: CustomItem): Item {   //  html收集的元素和js生成添加的成员都使用该方法添加
    const container = this.container
    const item = new Item(itemOptions)
    this.items.push(item)
    item.customOptions = itemOptions
    item.container = container
    item.parentElement = container.contentElement
    item.i = this.items.length
    return item
  }

  /** 移除某个存在的item */
  public removeItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === item) this.items.splice(i, 1);
    }
  }

  /** 清除重置布局矩阵 */
  public reset(): void {
    this.container.layoutManager.reset(this.container.getConfig('col'), this.container.getConfig('row'))
  }

  /** 清除所有Items */
  public clear() {
    this.items.splice(0, this.items.length)
  }

  /** 移除指定items实例 */
  public remove(removeItem) {
    for (let i = 0; i < this.items.length; i++) {
      if (removeItem === this.items[i]) {
        this.items.splice(i, 1)
        break
      }
    }
  }

}

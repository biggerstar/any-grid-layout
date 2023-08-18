import {Item} from "@/main/item/Item";
import {LayoutManager} from "@/algorithm/LayoutManager";
import {LayoutConfigManager} from "@/algorithm/LayoutConfigManager";
import {Container} from "@/main/container/Container";
import {ContainerInstantiationOptions, CustomItem} from "@/types";
import {__ref_item__} from "@/constant/constant";

export class Engine {
  public items = []
  public layoutManager: LayoutManager
  public layoutConfigManager: LayoutConfigManager
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
    this.layoutManager = new LayoutManager(this.container)
    this.layoutConfigManager = new LayoutConfigManager(this.options)
    this.layoutConfigManager.setContainer(this.container)
    this.layoutConfigManager.initLayoutInfo()
    this.initialized = true
    this.mountAll()
  }

  private mountAll() {
    this._sync()
    this.reset()
    let items = this.container.getConfig('items')
    items.forEach((item) => this.addItem(item))
  }

  /**
   * 计算并同步当前尺寸下的col,row,size,margin等信息到container
   * */
  public _sync() {
    this.layoutConfigManager.autoSetColAndRows()
    this.layoutConfigManager.autoSetSizeAndMargin()
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
      this.container.eventManager._callback_('updated', this.container)
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
    this.items.forEach((item) => item.unmount(isForce))
    this.reset()
  }

  /** 将item成员从Container中全部移除，之后重新渲染  */
  public remount() {
    this.unmount()
    this.container.mount()
  }

  /** 添加一个item，框架内部添加Item时所有的Item必须通过这里添加到容器中 */
  public addItem(itemOptions: CustomItem): Item | null {   //  html收集的元素和js生成添加的成员都使用该方法添加
    const container = this.container
    const eventManager = container.eventManager
    this.items = this.layoutManager.getCurrentMatrixSortItems(this.items)  // 每次添加新item之前为其他已存在的item排好序
    const item = new Item(itemOptions)
    const foundPos = this.layoutManager.findBlank(item.pos)
    if (foundPos) {
      Object.defineProperty(itemOptions, __ref_item__, {
        get: () => item,
        enumerable: false
      })
      this.layoutManager.mark(foundPos)
      Object.assign(item.pos, foundPos)
      this.items.push(item)
      item.container = container
      item.parentElement = container.contentElement
      item.i = this.items.length
      item.mount()
      eventManager._callback_('addItemSuccess', item)
      return item
    } else {
      eventManager._error_(
        'ContainerOverflowError',
        "容器溢出或者Item重叠，只有item明确指定了x,y或者容器col,row情况下会出现此错误"
        , itemOptions
        , itemOptions)
      return null
    }
  }

  /** 移除某个存在的item */
  public removeItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === item) this.items.splice(i, 1);
    }
  }

  /** 清除重置布局矩阵 */
  public reset(): void {
    this.layoutManager.reset(this.container.getConfig('col'), this.container.getConfig('row'))
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

  /**
   * 更新并渲染布局
   * */
  public updateLayout() {
    // const useItems = this.items.map((item: Item) => item[__ref_item__]).filter(Boolean)
    // const res = this.layoutManager.analysis(this.items)
    // res.patch((item) => {
    //   // console.log(item,item.pos)
    //   this.layoutManager.mark(item.pos)
    //   item.updateItemLayout()
    // })
    // this.items = this.layoutManager.getCurrentMatrixSortItems(this.items)  // 被更新了布局后再次排序
    //---------------------------------------------------------------------//
    this._checkUpdated()
    // this.layoutConfigManager.autoSetColAndRows()  // 对响应式经过算法计算后的最新矩阵尺寸进行调整
    // this.container.updateContainerStyleSize()
  }
}

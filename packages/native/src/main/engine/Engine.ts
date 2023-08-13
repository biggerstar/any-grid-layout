import {Item} from "@/main/item/Item";
import {LayoutManager} from "@/algorithm/LayoutManager";
import {LayoutConfigManager} from "@/algorithm/LayoutConfigManager";
import {Container} from "@/main/container/Container";
import {ContainerInstantiationOptions, CustomItem, ItemLimitType} from "@/types";
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
    this.layoutManager = new LayoutManager()
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


  /** 寻找某个指定矩阵范围内包含的所有Item,下方四个变量构成一个域范围;
   *  Item可能不完全都在该指定矩阵范围内落点，只是有一部分落在范围内，该情况也会被查找收集起来
   *  @param x {Number} x坐标
   *  @param y {Number} y坐标
   *  @param w {Number} x坐标方向延伸宫格数量
   *  @param h {Number} y坐标方向延伸宫格数量
   *  @param items {Object} 在该Item列表中查找，默认使用this.Items
   * */
  public findCoverItemFromPosition(x: number, y: number, w: number, h: number, items: Item[] | null = null): Item[] {
    // console.log(x,y,w,h);
    items = items || this.items
    const resItemList = []
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      const xBoundaryStart = x       // 左边界
      const yBoundaryStart = y       // 上边界
      const xBoundaryEnd = x + w - 1  //  右边界
      const yBoundaryEnd = y + h - 1  // 下边界
      const xItemStart = item.pos.x          // Item左边界
      const yItemStart = item.pos.y           // Item上边界
      const xItemEnd = item.pos.x + item.pos.w - 1    // Item右边界
      const yItemEnd = item.pos.y + item.pos.h - 1    // Item下边界

      if ((xItemEnd >= xBoundaryStart && xItemEnd <= xBoundaryEnd      // 左边界碰撞
          || xItemStart >= xBoundaryStart && xItemStart <= xBoundaryEnd  // X轴中间部分碰撞
          || xBoundaryStart >= xItemStart && xBoundaryEnd <= xItemEnd)    // 右边界碰撞
        && (yItemEnd >= yBoundaryStart && yItemEnd <= yBoundaryEnd      // 左边界碰撞
          || yItemStart >= yBoundaryStart && yItemStart <= yBoundaryEnd  // Y轴中间部分碰撞
          || yBoundaryStart >= yItemStart && yBoundaryEnd <= yItemEnd)      // 下边界碰撞
        || (xBoundaryStart >= xItemStart && xBoundaryEnd <= xItemEnd     // 全包含,目标区域只被某个超大Item包裹住的情况(必须要)
          && yBoundaryStart >= yItemStart && yBoundaryEnd <= yItemEnd)
      ) {
        resItemList.push(item)
      }
    }
    return resItemList
  }

  /**
   * 根据 x,y 的位置找item
   * */
  public findResponsiveItemFromPosition(fromX: number, fromY: number): Item | null {
    let pointItem = null
    let lastY = 1
    if (this.items.length > 0) {
      const item = this.items[this.items.length - 1]
      lastY = item.pos.y
    }
    for (let i = 0; i < this.items.length; i++) {
      let item: Item = this.items[i]
      if (!item) continue
      const {x, y, w, h} = item.pos
      const xItemStart = x
      const yItemStart = y
      const xItemEnd = x + w - 1
      const yItemEnd = y + h - 1

      if (xItemStart !== fromX) continue
      if (fromY > lastY) fromY = lastY
      if (x => xItemStart && x <= xItemEnd && fromY >= yItemStart && fromY <= yItemEnd) {
        if (fromX === xItemStart && fromY === yItemStart) pointItem = item
      }
    }
    return pointItem
  }

  /**
   * 在静态和响应式布局中通过指定的Item找到该Item在矩阵中最大的resize空间
   * 函数返回maxW和maxH代表传进来的对应Item在矩阵中最大长,宽
   * 数据来源于this.items的实时计算
   *
   * @param {Item} itemPoint 要计算矩阵中最大伸展空间的Item，该伸展空间是一个矩形
   * @return {{maxW: number, maxH: number,minW: number, minH: number}}  maxW最大伸展宽度，maxH最大伸展高度,minW最小伸展宽度，maxH最小伸展高度
   * */
  public findStaticBlankMaxMatrixFromItem(itemPoint: Item): ItemLimitType {
    const {x, y, w, h} = itemPoint.pos
    let maxW = this.container.getConfig("col") - x + 1   // X轴最大活动宽度
    let maxH = this.container.getConfig("row") - y + 1   // Y轴最大活动宽度
    let minW = maxW  // X轴最小活动宽度
    let minH = maxH  // Y轴最小活动宽度
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const pos = item.pos
      if (this.container.getConfig("responsive") && !item.static) continue   // 响应式布局中只找限定static的Item空间
      if (itemPoint === item) continue
      if (pos.x + pos.w - 1 < x || pos.y + pos.h - 1 < y) continue   // 上和左在x,y点外的Item不考虑
      //  思路：右方向最大(maxW && minH) :上方向最大(minW && maxH)
      // if (pos.x === x && pos.y === y) continue
      if (pos.x >= x && pos.x - x < maxW) {
        if (((y + h - 1) >= pos.y && (y + h - 1) <= (pos.y + pos.h - 1)
          || (pos.y + pos.h - 1) >= y && (pos.y + pos.h - 1) <= (y + h - 1))) {    // 横向计算X空白处
          maxW = pos.x - x
        }
      }
      if (pos.y >= y && pos.y - y < maxH) {
        if (((x + w - 1) >= pos.x && (x + w - 1) <= (pos.x + pos.w - 1)
          || (pos.x + pos.w - 1) >= x && (pos.x + pos.w - 1) <= (x + w - 1))) {  // 纵向计算Y空白处
          maxH = pos.y - y
        }
      }
      if (pos.x >= x && pos.x - x < minW) {
        if (((y + maxH - 1) >= pos.y && (y + maxH - 1) <= (pos.y + pos.h - 1)
          || (pos.y + pos.h - 1) >= y && (pos.y + pos.h - 1) <= (y + maxH - 1))) {    // 横向计算X最小空白处
          minW = pos.x - x
        }
      }
      if (pos.y >= y && pos.y - y < minH) {
        if (((x + maxW - 1) >= pos.x && (x + maxW - 1) <= (pos.x + pos.w - 1)
          || (pos.x + pos.w - 1) >= x && (pos.x + pos.w - 1) <= (x + maxW - 1))) {  // 纵向计算Y空白处
          minH = pos.y - y
        }
      }
    }
    // console.log(minW,minH,maxW,maxH)
    return {
      maxW,    // 当前item的pos中x,y,w,h指定位置大伸展宽度
      maxH,    // 最大伸展高度(同上)
      minW,    // 最小伸展宽度(同上)
      minH     // 最小伸展高度(同上)
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
      item.__ref_use__ = itemOptions
      item.container = container
      item.parentElement = container.contentElement
      item.i = container.getConfig('items').length
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

  /** 已经挂载后的情况下重新排列响应式Item的顺序,通过映射遍历前台可视化形式的网格位置方式重新排序Item顺序(所见即所得)，
   * 排序后的布局和原本的布局是一样的，只是顺序可能有变化，在拖动交换的时候不会出错
   *  原理是通过遍历当前网页内Container对应的矩阵点(point),先行后列遍历,记录下所遍历到的顺序，该顺序的布局是和原本的item列表一样的
   *  只是在Item调用engine.move时可能因为右边过宽的Item被挤压到下一行，后面的小Item会被补位到上一行，
   *  这种情况其实大Item的index顺序是在小Item前面的，但是通过move函数交换可能会出错
   * */
  public sortResponsiveItem() {
    const items = []
    for (let y = 1; y <= this.container.getConfig("row"); y++) {
      for (let x = 1; x <= this.container.getConfig("col"); x++) {
        for (let index = 0; index < this.items.length; index++) {
          const item = this.items[index]
          if (x >= item.pos.x && x < (item.pos.x + item.pos.w)
            && y >= item.pos.y && y < (item.pos.y + item.pos.h)) {
            if (!items.includes(item)) {
              items.push(item)
            }
            break
          }
        }
      }
    }
    this.items = items
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
    this.items = []
  }

  /** 是否包含Item */
  public includes(item) {
    return this.items.includes(item)
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

  /** 将某个Item插入到items列表指定索引位置 */
  public insert(item: Item, index: number) {
    this.items.splice(index, 0, item)
  }

  /** 某个Item在this.items列表移动到指定位置
   * @param {Item} item  item
   * @param {Number} toIndex  移动到哪个索引
   * @dataParam {Number} fromIndex  来自哪个索引
   * */
  public move(item: Item, toIndex: number) {
    if (toIndex < 0) toIndex = 0
    let fromIndex = null
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === item) {
        fromIndex = i
        break
      }
    }
    if (fromIndex !== null) {
      this.items.splice(fromIndex, 1)
      this.items.splice(toIndex, 0, item)
    }
  }


  /** 交换自身Container中两个Item在this.items的位置 */
  public exchange(itemA: Item, itemB: Item) {
    if (this.items.includes(itemA) && this.items.includes(itemB)) {
      this.items[itemA.i] = itemB
      this.items[itemB.i] = itemA
    }
  }

  /** 在挂载后为自身Container中的this.items重新编号防止编号冲突 */
  public renumber(items?: Item[]) {
    items = items ? items : this.items
    items.forEach((item, index) => {
      item.i = index
      item.pos.i = index
    })   // 为当前位置的Item按items底标索引重新编号
  }


  /**  根据是否响应式布局或者静态布局更新容器内的Item布局
   *  items是指定要更新的几个Item，否则更新全部 ignoreList暂时未支持
   *  @param items {Array || Boolean} Array: 要更新的对应Item ，Array方案正常用于静态模式，
   *                                          响应式也能指定更新，用于静态优先更新(将传入的Item作为静态Item进行占位)
   *                                  Boolean: 参数为true 传入true的话不管静态还是响应式强制刷新该容器的布局
   *                                  不传值(默认null): 静态模式不进行更新，响应式模式进行全部更新
   *  @param ignoreList {Array} 暂未支持  TODO 更新时忽略的Item列表，计划只对静态模式生效
   * */
  public updateLayout(items: Item[] | boolean | null = null, ignoreList = []) {
    const useItems = <any>this.container.getConfig('items').map((item: Item) => item[__ref_item__]).filter(Boolean)
    const res = this.layoutManager.analysis(useItems)
    res.patch((item) => item.updateItemLayout())
    // console.log(useItems, res);


    return;
   // TODO  弃用下方原本的更新逻辑
    //---------------------------更新响应式布局-------------------------------//
    const staticItems = this.items.filter((item) => {
      if (item.static && item.pos.x && item.pos.y && this.items.includes(item)) {
        return item
      }
      return false
    })
    let updateItemList = []
    if (items === null) updateItemList = []
    else if (Array.isArray(items)) updateItemList = items
    else if (!items && updateItemList.length === 0) return
    if (items === true) items = this.items
    if (!Array.isArray(items)) return
    this._sync()
    this.reset()
    this.renumber()
    updateItemList = updateItemList.filter(item => (items as []).includes(item) && !item.static)
    if (updateItemList.length === 0) updateItemList = items.filter(item => item.__temp__.resizeLock)  // 没找到更新元素，则默认更新全部
    // console.log(items.length, updateItemList);
    const updateItemLayout = (item) => {
      item.updateItemLayout()
    }

    staticItems.forEach((item) => {   // 1.先对所有静态成员占指定静态位
      item.autoOnce = false
      // console.log(item.static, item.pos.x, item.pos.y);
      updateItemLayout(item)
    })

    updateItemList.forEach((item) => {   // 2.先对要进行更新成员占指定静态位
      // console.log(item.pos.x,item.pos.y)
      item.autoOnce = false
      updateItemLayout(item)
    })
    items.forEach(item => {   // 3.再对剩余成员按顺序找位置坐下
      if (updateItemList.includes(item) || staticItems.includes(item)) return   //  前面已经处理
      updateItemLayout(item)
    })

    //---------------------------------------------------------------------//
    this._checkUpdated()

    //---------------------------更新数据和存储-------------------------------//
    this.layoutConfigManager.autoSetColAndRows()  // 对响应式经过算法计算后的最新矩阵尺寸进行调整
    this.container.updateContainerStyleSize()
    const genBeforeSize = (container: Container) => {
      return {
        row: container.getConfig('row'),
        col: container.getConfig('col'),
        containerW: container.containerW,
        containerH: container.containerH,
        width: container.nowWidth(),
        height: container.nowHeight()
      }
    }
    const container: Container = this.container
    if (!container.__ownTemp__.beforeContainerSizeInfo) {
      container.__ownTemp__.beforeContainerSizeInfo = <any>genBeforeSize(container)
    } else {
      const beforeSize = container.__ownTemp__.beforeContainerSizeInfo
      if (beforeSize['containerW'] !== container.containerW || beforeSize['containerH'] !== container.containerH) {
        const nowSize = genBeforeSize(container)
        container.__ownTemp__.beforeContainerSizeInfo = <any>genBeforeSize(container)
        this.container.eventManager._callback_('containerSizeChange', beforeSize, nowSize, container)
      }
    }
  }

}

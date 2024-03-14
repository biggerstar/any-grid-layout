// noinspection JSUnusedGlobalSymbols

import {cloneDeep, debounce, getContainerFromElement, getItemFromElement, merge, throttle} from "@/utils/tool";
import {Item} from "@/main/item/Item";
import {ContainerInstantiationOptions, CustomItem, CustomLayoutOption, EventBusType, GridPlugin} from "@/types";
import {removeGlobalEvent, startGlobalEvent} from "@/events/listen";
import Bus, {Emitter} from 'mitt'
import {PluginManager} from "@/plugins-src/PluginManager";
import {LayoutManager} from "@/algorithm";
import {isNumber, isObject, isString} from "is-what";
import {grid_container_class_name} from "@/constant";
import {getContainerConfigs, updateStyle} from "@/utils";
import {ContainerGeneralImpl} from "@/main";
import {createSTRect} from "@/global/singleThrottle";


/**
 *  # 栅格容器, 所有对DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 *    注：
 *    1.暂不支持iframe嵌套
 *    2.使用原生js开发的时候如果首屏加载网页中元素会一闪而过或者布局错误然后才生成网格布局,出现这种情况可以对Container挂载的那个元素点进行display:'none',
 *      框架处理会自动显示出来，出现这个的原因是因为html加载渲染比js对dom的渲染快
 *  #
 *    [gapX, gapY]( 下面称为 gap ) ,
 *    [itemWidth, itemHeight]( 下面称为 siz )
 *    [col | row]( 下面称为CR ) 在传入后的响应结果
 *  #
 *    所有参数是通过LayoutConfig算法类以当前容器最大可视区域进行计算，
 * -  CR   size   gap   所见即所得
 * -  CR  !size   gap   自动通过容器剩余空间设定 size 尺寸
 * -  CR   size  !gap   自动通过容器剩余空间 gap 尺寸
 * -  CR  !size  !gap   通过传入的radio自动设定 size 和 gap 尺寸
 * - !CR   size   gap   自动设定CR的栅格数
 * - !CR  !size   gap   自动通过容器剩余空间设定 size 尺寸
 * - !CR   size  !gap   自动通过容器剩余空间设定 gap 尺寸
 * - !CR  !size  !gap   会自动通过传入 items 列表的pos信息计算合适尺寸(必须提供w,h,x,y的值),加载是顺序加载的，
 *                        如果 items 顺序加载过程中，遇到没有指定x,y的pos且当前容器放不下该Item将会将其抛弃，如果放得下将顺序添加进容器中
 *
 * */
export class Container {
  //---------实例化传进的的参数 --------//
  public name: string = ''
  public className: string = grid_container_class_name
  public platform: 'native' | 'vue' = 'native'
  public el: HTMLElement | string = ''
  //----------------内部需要的参数---------------------//
  public bus: Emitter<EventBusType> = Bus()
  public pluginManager: PluginManager
  public layoutManager: LayoutManager
  public readonly layout: CustomLayoutOption = {} as any
  public readonly useLayout: CustomLayoutOption = {} as any  //  当前使用的在用户传入layout布局方案的基础上，增加可能未传入的col,gap,size等等必要构建容器字段
  public items: Item[] = []
  public element?: HTMLElement   //  container的挂载节点
  public contentElement?: HTMLElement     // 放置Item元素的真实容器节点，被外层容器用户指定挂载点的element直接包裹
  public STRect?: ReturnType<typeof createSTRect>
  //----------------保持状态所用参数---------------------//
  public _mounted?: boolean
  public readonly _default: CustomLayoutOption
  public readonly __ownTemp__ = {
    //-----内部可写外部只读变量------//
    oldCol: void 0,   // 容器大小改变之前的col
    oldRow: void 0,   // 容器大小改变之前的row
    observers: {
      resize: void 0,
      mutation: void 0,
    },
  }

  constructor(options: ContainerInstantiationOptions) {
    if (!options.el) {
      new Error('请指定需要绑定的el,是一个id或者class值或者原生的element')
    }
    this.pluginManager = new PluginManager(this)
    this.layoutManager = new LayoutManager()
    this.layoutManager.container = this;
    (options.plugins || []).forEach(plugin => this.pluginManager.use(plugin))
    let resOption = options
    this.bus.emit('config', {
      options: options,
      callback: (ev) => ev.options && isObject(ev.options) && (resOption = ev.options)
    })
    this.bus.emit('configResolved' /* 类似vite钩子 */, {
      options: resOption,
    })
    merge(this, resOption)
    this._define()
    this._default = Object.freeze(new ContainerGeneralImpl())
    this.layout = cloneDeep(options.layout)
  }

  private _define() {
    const useLayout = {}
    Object.defineProperties(<object>this, {
      useLayout: {
        get() {
          return useLayout
        }
      },
    })
  }

  public use(plugin: GridPlugin): this {
    this.pluginManager.use(plugin)
    return this
  }

  /**
   * 修改布局配置
   * */
  public setState(options: CustomLayoutOption) {
    Object.assign(this.layout, options)
  }

  /**
   * 是否是自动增长col方向的容器
   * */
  public get autoGrowCol() {
    const {col, autoGrow} = getContainerConfigs(this, ["col", "autoGrow"])
    return !col && autoGrow?.horizontal
  }

  /**
   * 是否是自动增长row方向的容器
   * */
  public get autoGrowRow() {
    const {row, autoGrow} = getContainerConfigs(this, ["row", "autoGrow"])
    return !row && autoGrow?.vertical
  }

  /** 传入配置名获取当前正在使用的配置值 */
  public getConfig<Name extends keyof CustomLayoutOption>(name: Name): Exclude<CustomLayoutOption[Name], undefined> {
    return getContainerConfigs(this, name)
  }

  /**
   * 将值设置到当前使用的配置信息中,只是临时设置
   * */
  public setConfig<Name extends keyof CustomLayoutOption>(name: Name, data: CustomLayoutOption[Name]): void {
    this.useLayout[name] = data
  }

  /** 生成真实的item挂载父级容器元素，并将挂到外层根容器上 */
  private _createGridContainerBox = () => {
    this.bus.emit('containerMountBefore')
    this.contentElement = document.createElement('div')
    this.contentElement['_gridContainer_'] = this
    this.contentElement['_isGridContainer_'] = true
    this.contentElement.classList.add(this.className)
    this.element.appendChild(this.contentElement)
    this.bus.emit('containerMounted')
    setTimeout(() => {
      updateStyle({transition: 'all 200ms'}, this.contentElement)
    }, 360)
  }

  /** 手动添加item渲染 */
  public render(renderCallback: (item: CustomItem[], layout: CustomLayoutOption, element: HTMLElement) => void) {
    if (this.element && this.element.clientWidth <= 0) {
      throw new Error('请指定容器宽高')
    }
    if (typeof renderCallback === 'function') {
      renderCallback.call(<object>this, this.layout.items, this.layout, this.element)
    }
    if (!this._mounted) {
      this.mount()
    }  // 第一次Container没挂载则挂载，后续添加后自动更新布局
  }

  /**
   * el 参数可以传入一个具名ID  或者一个原生的 Element 对象
   * 直接渲染Container到实例化传入的所指 ID 元素中, 将实例化时候传入的 items 数据渲染出来，
   * 如果实例化不传入 items 可以在后面自行创建item之后手动渲染
   * */
  public mount(): void {
    if (this._mounted) {
      return this.bus.emit('error', {
        type: 'RepeatedContainerMounting',
        message: '重复挂载容器被阻止',
        from: this,
      })
    }
    startGlobalEvent()  // 开启全局事件监听， 多容器下只会开启一次
    //-----------------------容器dom初始化-----------------------//
    if (this.el instanceof Element) {
      this.element = this.el
    }
    if (!this.element) {
      this.element = <HTMLElement>document.querySelector(<string>this.el)
      if (!this.element) {
        throw new Error('在DOM中未找到指定ID对应的:' + this.el + '元素')
      }
    }
    //-----------------容器布局信息初始化与检测--------------------//
    this.STRect = createSTRect(this)
    this._init()
    this._createGridContainerBox()
    //-------------------------其他操作--------------------------//
    // this.__ownTemp__.oldCol = this.getConfig("col")
    // this.__ownTemp__.oldRow = this.getConfig("row")
    // this._observer_()
    // this.updateLayout()
    // this.updateContainerSizeStyle()
    this._mounted = true
  }

  /**
   * 将item成员从Container中全部移除
   * */
  public unmount(): void {
    if (!this._mounted) {
      return
    }
    Array.from(this.items).forEach((item: Item) => item.unmount()) // 使用Array.from是不会被卸载过程影响到原数组导致卸载不干净
    this.reset()
    this._mounted = false
    if (this.contentElement.isConnected) {
      this.element.removeChild(this.contentElement)
    }
    this._disconnect_()
    this.bus.emit('containerUnmounted')
    removeGlobalEvent()
  }

  /** 移除对容器的resize监听  */
  private _disconnect_() {
    const observers = this.__ownTemp__.observers || {}
    Object.values(observers).forEach(observer => observer && observer['disconnect']())
  }

  /**
   * 监听浏览器窗口resize
   * 监听container，item元素卸载
   * */
  public _observer_() {
    if (this._mounted) {
      return
    }
    let preventFirstResizingCount = 0   // 阻止resize首次加载触发的容器调整大小改变事件
    const layoutChangeFun = () => {
      if (preventFirstResizingCount++ > 2) {
        this.bus.emit('containerResizing')
      }
    }
    const observerResize = () => {
      layoutChangeFun();
      _debounce()
    } // 防抖，保证最后一次执行执行最终布局
    const _debounce: Function = debounce(layoutChangeFun, 300)
    const _throttle: Function = throttle(observerResize, 80)
    const resizeObserver = new ResizeObserver(<any>_throttle)  //  ResizeObserver在es6才支持，若要兼容需要外部自行polyfill
    resizeObserver.observe(this.element)
    this.__ownTemp__.observers.resize = resizeObserver
    //---------------------------------------------------------------------
    const mutationOb = (mutations: any[]) => {
      // 如果[container | item]节点被任何方式移除，则触发unmount卸载并触发其unmourned事件
      const removedNodes = mutations.map(mutation => [...mutation.removedNodes]).flat(1)
      // console.log(removedNodes)
      removedNodes.forEach(node => {
        const item = getItemFromElement(node)
        if (item) {
          Array.from(item.element.getElementsByClassName(grid_container_class_name))
            .map(getContainerFromElement)
            .filter(Boolean)
            .forEach(container => container?.unmount())
        }
        const container = getContainerFromElement(node)
        if (container) {
          container.unmount()
        }
      })
    }
    const mutationObserver = new MutationObserver(mutationOb)
    mutationObserver.observe(this.element, {   // 监控container移除
      childList: true,
      // subtree:false
    })
    mutationObserver.observe(this.contentElement, { // 监控所有的item移除
      childList: true,
    })
    this.__ownTemp__.observers.mutation = mutationObserver
  }

  /**
   * 使用css class 或者 Item的对应name, 或者 Element元素 或者 item.i的值 找到该对应的Item，并返回所有符合条件的Item
   * name的值在创建 Item的时候可以传入 或者直接在标签属性上使用name键值，在这边也能获取到
   * @param { String,Element } nameOrElementOrIndex
   * @return {Array} 所有符合条件的Item
   * */
  public find(nameOrElementOrIndex: string | number | HTMLElement): Item[] {
    const identity = nameOrElementOrIndex
    return this.items.filter((item) => {
      return isNumber(identity) && item.i === identity
        || isString(identity) && item.name === identity
        || item.element === identity
        || isString(identity)
    })
  }

  /** 执行后会只能根据当前items占用的位置更新 container 的大小 */
  public updateContainerSizeStyle(opt: { col?: number, row?: number } = {}): void {
    let {col, row} = opt
    updateStyle({
      width: `${this.nowWidth(col)}px`,
      height: `${this.nowHeight(row)}px`,
    }, this.contentElement)
    this.STRect.updateCache("containerContent")
  }

  /** 计算当前Items所占用的Container宽度  */
  public nowWidth(nowCol?: number): number {
    nowCol = nowCol || this.getConfig("col")
    const {gapX, itemWidth} = getContainerConfigs(this, ["gapX", "itemWidth"])
    const allGapWidth = nowCol > 1 ? (nowCol - 1) * gapX : 0
    return (nowCol * itemWidth) + allGapWidth
  }

  /** 计算当前Items所占用的Container高度   */
  public nowHeight(nowRow?: number): number {
    nowRow = nowRow || this.getConfig("row")
    const {gapY, itemHeight} = getContainerConfigs(this, ["gapY", "itemHeight"])
    const allGapHeight = nowRow > 1 ? (nowRow - 1) * gapY : 0
    return (nowRow * itemHeight) + allGapHeight
  }

  /** 获取外容器可视范围可容纳的col  */
  public get containerW(): number {
    return this.pxToW(this.STRect.getCache("containerIns").width, {floor: true}) || 1
  }

  /** 获取外容器可视范围可容纳的row */
  public get containerH(): number {
    return this.pxToH(this.STRect.getCache("containerIns").height, {floor: true}) || 1
  }

  /** 获取內容器可视范围可容纳的col  */
  public get contentBoxW(): number {
    return this.pxToW(this.STRect.getCache("containerContent").width, {floor: true}) || 1
  }

  /** 获取内容器可视范围可容纳的row */
  public get contentBoxH(): number {
    return this.pxToH(this.STRect.getCache("containerContent").height, {floor: true}) || 1
  }

  private _init() {
    let items = getContainerConfigs(this, 'items')
    items.forEach((item: Item) => this.addItem(item, {syncCustomItems: false, addForce: true}))
  }

  /**
   * 添加一个itemOptions配置信息创建一个Item实例到items列表中，不会挂载到dom中
   * 框架内部添加Item时所有的Item必须通过这里添加到容器中
   * @param itemOptions
   * @param options
   * @param options.syncCustomItems  同步到用户的items配置中
   * @param options.addForce         不管是否能添加成功，强制添加到items列表中，慎用
   * @param options.findBlank        是否查找自动追加到合适的空白位置,否则直接添加不会影响到item.pos的值
   *                                 在您首次挂载(首次挂载会自动找空位)后，如果您要添加新item且没指定x,y时
   *                                 此时pos的默认是 x = 1,y = 1，您如果没指定x,y则建议开启该选项自动找到空位
   *
   * @return {Item | null} 成功返回Item，失败返回 null
   * */
  public addItem(itemOptions: CustomItem | Item, options: {
    addForce?: boolean,
    syncCustomItems?: boolean,
    findBlank?: boolean
  } = {}): Item | void {   //  html收集的元素和js生成添加的成员都使用该方法添加
    const {syncCustomItems = true, findBlank = false, addForce = false} = options
    if (!this._mounted && !addForce) {
      this.bus.emit('error', {
        type: 'ContainerNotMounted',
        message: `Container未挂载`
      })
      return
    }
    let item = <Item>itemOptions
    let customOpt = itemOptions
    if (itemOptions instanceof Item) {
      customOpt = itemOptions.customOptions
    } else {
      item = new Item(customOpt)
    }
    if (syncCustomItems) {
      this.layout.items.push(customOpt)
    }
    // console.log(item === itemOptions)
    if (findBlank && itemOptions.pos) {
      const manager = this.layoutManager
      const isGrow = this.autoGrowRow || this.autoGrowCol
      const findBlankFn = isGrow ? manager.findGrowBlank : manager.findBlank
      let foundPos = findBlankFn.call(manager, itemOptions.pos)
      if (!foundPos) {
        this.bus.emit('error', {
          type: 'ContainerOverflowError',
          message: `addItem 时容器溢出: 您可以配置 autoGrow 来自动撑开容器`,
          from: item
        })
        return
      }
      Object.assign(item.pos, foundPos)
      manager.mark(item.pos, item)
    }
    item.customOptions = customOpt
    item.container = this
    item.i = this.items.length
    this.items.push(item)
    this.bus.emit('addItemSuccess', {item})
    return item
  }

  /**
   * 在items列表中移除指定Item引用
   *
   * @return {Item | null} 移除成功返回Item，失败返回 null
   * */
  public removeItem(removeItem: Item): Item | null {
    let target = null
    for (let i = 0; i < this.items.length; i++) {
      if (removeItem === this.items[i]) {
        this.items.splice(i, 1)
        target = removeItem
        break
      }
    }
    return target
  }

  /** 清除重置布局矩阵 */
  public reset(col?: number, row?: number): void {
    this.layoutManager.reset(col, row)
  }

  /** 清除所有Items */
  public clear() {
    this.items.splice(0, this.items.length)
  }

  /**  px像素转栅格单位 w */
  public pxToW = (
    pxNum: number,
    {floor, keepSymbol}: {
      /** 是否往下取整 */
      floor?: boolean,
      /** 是否保持符号，比如传入pxNum是负数，返回也是负数 */
      keepSymbol?: boolean
    } = {
      floor: false,
      keepSymbol: false
    }): number => {
    const toInteger = floor ? Math.floor : Math.ceil
    const {gapX, itemWidth} = getContainerConfigs(this, ["gapX", "itemWidth"])
    let res: number
    if (itemWidth >= Math.abs(pxNum)) {
      res = 1
    } else {
      res = toInteger(Math.abs(pxNum) / (gapX + itemWidth))
    }
    if (keepSymbol) {
      res *= Math.sign(pxNum)
    }
    return res
  }
  /**  px像素转栅格单位 h */
  public pxToH = (
    pxNum: number,
    {floor, keepSymbol}: {
      /** 是否往下取整 */
      floor?: boolean,
      /** 是否保持符号，比如传入pxNum是负数，返回也是负数 */
      keepSymbol?: boolean
    } = {
      floor: false,
      keepSymbol: false
    }) => {
    const toInteger = floor ? Math.floor : Math.ceil
    const {gapY, itemHeight} = getContainerConfigs(this, ["gapY", "itemHeight"])
    let res: number
    if (itemHeight >= Math.abs(pxNum)) {
      res = 1
    } else {
      res = toInteger(Math.abs(pxNum) / (gapY + itemHeight))
    }
    if (keepSymbol) {
      res *= Math.sign(pxNum)
    }
    return res
  }

  /**
   * 更新当前布局，由布局插件实现
   * */
  public updateLayout() {
    this.bus.emit("updateLayout")
  }
}

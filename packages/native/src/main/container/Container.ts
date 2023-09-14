// noinspection JSUnusedGlobalSymbols

import {debounce, merge, parseItemFromPrototypeChain, throttle} from "@/utils/tool";
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import {Sync} from "@/utils/Sync";
import {Item} from "@/main/item/Item";
import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";
import {ContainerInstantiationOptions, CustomEventOptions, CustomItem, EventBusType} from "@/types";
import {DomFunctionImpl} from "@/utils/DomFunctionImpl";
import {startGlobalEvent} from "@/events/listen";
import {computeSmartRowAndCol} from "@/algorithm/common";
import Bus, {Emitter} from 'mitt'
import {PluginManager} from "@/plugins/PluginManager";
import {LayoutManager} from "@/algorithm";
import {isString} from "is-what";
import {grid_container_class_name} from "@/constant";

/**
 * #栅格容器, 所有对DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 *   Container中所有对外部可以设置的属性都是在不同的布局方案下全局生效，如若有设定layout布局数组或者单对象的情况下,
 *   该数组内的配置信息设置优先于Container中设定的全局设置，比如 实例化传进
 *   ```javascript{
 *    col: 8,
 *    size:[80,80],
 *    layouts:[{
 *          px:1024,
 *          size:[100,100]
 *        },
 *    ]}
 *    ```
 *    此时该col生效数值是8，来自全局设置属性，size的生效值是[100,100],来自layout中指定的局部属性
 *    注：
 *    1.暂不支持iframe嵌套
 *    2.使用原生js开发的时候如果首屏加载网页中元素会一闪而过或者布局错误然后才生成网格布局,出现这种情况可以对Container挂载的那个元素点进行display:'none',
 *      框架处理会自动显示出来，出现这个的原因是因为html加载渲染比js对dom的渲染快
 *  # size,margin, [col | row](后面简称CR) 在传入后的响应结果,
 *    所有参数是通过LayoutConfig算法类以当前容器最大可视区域进行计算，
 * -  CR   size   margin   所见即所得
 * -  CR  !size   margin   自动通过容器剩余空间设定size尺寸
 * -  CR   size  !margin   自动通过容器剩余空间margin尺寸
 * -  CR  !size  !margin   通过传入的radio自动设定size和margin尺寸
 * - !CR   size   margin   自动设定CR的栅格数
 * - !CR  !size   margin   自动通过容器剩余空间设定size尺寸
 * - !CR   size  !margin   自动通过容器剩余空间设定margin尺寸
 * - !CR  !size  !margin   会自动通过传入 items 列表的pos信息计算合适尺寸(必须提供w,h,x,y的值),加载是顺序加载的，
 *                        如果 items 顺序加载过程中，遇到没有指定x,y的pos且当前容器放不下该Item将会将其抛弃，如果放得下将顺序添加进容器中
 *
 * */
export class Container {
  //---------实例化传进的的参数 --------//
  public name: string = ''
  public className: string = grid_container_class_name
  public platform: 'native' | 'vue' = 'native'
  public el: HTMLElement | string = ''
  public global: ContainerGeneralImpl = {} as any
  public layouts: ContainerGeneralImpl[] = [] as any
  //----------------内部需要的参数---------------------//
  /**
   * 当前正在使用的布局，为layouts中的某一个适合当前屏幕的布局配置的地址引用
   * 该布局会信息会在切换布局的时候被修改，原因是为了同步当前最新布局保存到layouts中
   * */
  public bus: Emitter<EventBusType> = Bus()
  public pluginManager: PluginManager
  public layoutManager: LayoutManager
  public readonly layout: ContainerGeneralImpl = {} as any
  public readonly useLayout: ContainerGeneralImpl = {} as any  //  当前使用的在用户传入layout布局方案的基础上，增加可能未传入的col,margin,size等等必要构建容器字段
  private readonly options: ContainerInstantiationOptions
  public items: Item[] = []
  public isNesting: boolean = false    // 该Container自身是否[被]嵌套
  public childContainer: Container[] = [] // 所有该Container的直接子嵌套容器
  public element: HTMLElement   //  container的挂载节点
  public contentElement: HTMLElement     // 放置Item元素的真实容器节点，被外层容器用户指定挂载点的element直接包裹
  public parentItem: Item | null
  public parent?: Container
  private readonly domImpl: DomFunctionImpl

  // //----------------vue 支持---------------------//
  // // TODO 后面在vue的layout模块使用declare module进行声明合并
  // public vue: any
  // public _VueEvents: object
  //----------------保持状态所用参数---------------------//
  private _mounted: boolean
  public readonly _default: ContainerGeneralImpl
  // private __store__ = tempStore
  public __ownTemp__ = {
    //-----内部可写外部只读变量------//
    preCol: 0,   // 容器大小改变之前的col
    preRow: 0,   // 容器大小改变之前的row
    offsetPageX: 0,        // 容器距离浏览器可视区域左边的距离
    offsetPageY: 0,       //  容器距离浏览器可视区域上边的距离
    observer: null,
    //----------可写变量-----------//
  }

  constructor(options: ContainerInstantiationOptions) {
    if (!options.el) new Error('请指定需要绑定的el,是一个id或者class值或者原生的element')
    merge(this, options)
    this._define()
    this.pluginManager = new PluginManager(this)
    this.layoutManager = new LayoutManager()
    this.domImpl = new DomFunctionImpl(this)
    this.options = options    // 拿到和Container同一份用户传入的配置信息
    this._default = new ContainerGeneralImpl()
    startGlobalEvent()
  }

  private _define() {
    const self = this
    const useLayout = {}
    Object.defineProperties(<object>this, {
      layout: {
        get() {
          let layoutItem
          const layouts = self.layouts.sort((a, b) => a.px - b.px)
          const containerWidth = self.element?.clientWidth

          for (let i = 0; i < layouts.length; i++) {
            layoutItem = layouts[i]
            if (!Array.isArray(layoutItem.items)) layoutItem.items = []
            if (layouts.length === 1) break
            // 此时 layoutItem.px循环结束后 大于 containerWidth,表示该Container在该布局方案中符合px以下的设定,
            // 接上行: 如果实际Container大小还大于layoutItem.px，此时是最后一个，将跳出直接使用最后也就是px最大对应的那个布局方案
            if (layoutItem.px < containerWidth) continue
            break
          }
          return layoutItem
        },
        set(_: any) {
          // debugger
        }
      },
      useLayout: {
        get() {
          return useLayout
        },
        set(_: any) {
          // debugger
        }
      },
    })
  }

  public use(plugin: CustomEventOptions): this {
    this.pluginManager.use(plugin)
    return this
  }

  /**
   * 是否是自动增长col方向的容器
   * */
  public get autoGrowCol() {
    const baseline = this.getConfig("baseLine")
    return !this._getConfig('col') && (baseline === 'left' || baseline === 'right')
  }

  /**
   * 是否是自动增长row方向的容器
   * */
  public get autoGrowRow() {
    const baseline = this.getConfig("baseLine")
    return !this._getConfig('row') && (baseline === 'top' || baseline === 'bottom')
  }

  private _getConfig<Name extends keyof ContainerGeneralImpl>(name: Name): Exclude<ContainerGeneralImpl[Name], undefined> {
    if (this.useLayout.hasOwnProperty(name)) return this.useLayout[name]
    if (this.layout.hasOwnProperty(name)) return this.layout[name]
    if (this.global.hasOwnProperty(name)) return this.global[name]
    if (this._default.hasOwnProperty(name)) return this._default[name]
    return void 0
  }

  /** 传入配置名获取当前正在使用的配置值 */
  public getConfig<Name extends keyof ContainerGeneralImpl>(name: Name): Exclude<ContainerGeneralImpl[Name], undefined> {
    let data = this._getConfig(name)
    //-------------------------------------------------------------------------//
    let smartColRowInfo
    if (['col', 'row'].includes(name)) smartColRowInfo = computeSmartRowAndCol(this)
    //-------------------如果不是动态的col，则以当前containerW为准------------------//
    if (name === 'col') {
      const containerW = this.containerW
      const autoGrowCol = this.autoGrowCol
      if (!data) { // 未指定col自动设置
        if (!this._mounted) data = Math.max(smartColRowInfo.smartCol, containerW)
        else if (!autoGrowCol) data = containerW
        else data = smartColRowInfo.smartCol
        if (data < containerW) data = containerW   // 最低保留盒子的W
      }
      //-----------------------------Col限制确定---------------------------------//
      const curMinCol = this._getConfig('minCol')
      if (curMinCol && data < curMinCol) data = curMinCol
      if (data < smartColRowInfo.maxItemW && autoGrowCol) data = smartColRowInfo.maxItemW
    }
    //-------------------如果不是动态的row，则以当前containerH为准------------------//
    if (name === 'row') {
      const containerH = this.containerH
      const autoGrowRow = this.autoGrowRow
      if (!data) {  // 未指定row自动设置
        if (!this._mounted) data = Math.max(smartColRowInfo.smartRow, containerH)
        else if (!autoGrowRow) data = containerH
        else data = smartColRowInfo.smartRow
        // console.log(data, smartColRowInfo.smartRow);
        if (data < containerH) data = containerH   // 最低保留盒子的H
      }
      // console.log(data,smartColRowInfo.smartRow);
      //-----------------------------Row限制确定---------------------------------//
      const curMinRow = this._getConfig('minRow')
      if (curMinRow && data < curMinRow) data = curMinRow
      if (data < smartColRowInfo.maxItemH && autoGrowRow) data = smartColRowInfo.maxItemH
      // console.log('data', data, 'containerH', containerH)
    }
    return data
  }

  /** 将值设置到当前使用的配置信息中 */
  public setConfig<Name extends keyof ContainerGeneralImpl>(name: Name, data: ContainerGeneralImpl[Name]): this {
    this.useLayout[name] = data
    return this
  }

  /**
   * el 参数可以传入一个具名ID  或者一个原生的 Element 对象
   * 直接渲染Container到实例化传入的所指 ID 元素中, 将实例化时候传入的 items 数据渲染出来，
   * 如果实例化不传入 items 可以在后面自行创建item之后手动渲染
   * */
  public mount(): void {
    if (this._mounted) return this.bus.emit('error', {
      type: 'RepeatedContainerMounting',
      message: '重复挂载容器被阻止',
      from: this
    })
    const _mountedFun = () => {
      //-----------------------容器dom初始化-----------------------//
      if (this.el instanceof Element) this.element = this.el
      if (!this.element) {
        if (!this.isNesting) this.element = <HTMLElement>document.querySelector(<string>this.el)
        if (!this.element) throw new Error('在DOM中未找到指定ID对应的:' + this.el + '元素')
      }
      this._createGridContainerBox()
      //-----------------容器布局信息初始化与检测--------------------//
      this._init()
      //-------------------------其他操作--------------------------//
      this.parentItem = parseItemFromPrototypeChain(this.element)
      this.parent = this.parentItem?.container
      this._observer_()
      this._mounted = true
      this.updateContainerSizeStyle()  // 在 _mounted 之后
    }
    Sync.run(_mountedFun)
  }

  /** 生成真实的item挂载父级容器元素，并将挂到外层根容器上 */
  private _createGridContainerBox = () => {
    this.contentElement = document.createElement('div')
    this.contentElement['_gridContainer_'] = this
    this.contentElement['_isGridContainer_'] = true
    this.contentElement.classList.add(this.className)
    this.element.appendChild(this.contentElement)
    this.bus.emit('containerMounted')
    setTimeout(() => {
      this.domImpl.updateStyle({transition: 'all 0.3s'}, this.contentElement)
    }, 500)
  }

  /** 手动添加item渲染 */
  public render(renderCallback: Function) {
    Sync.run(() => {
      if (this.element && this.element.clientWidth <= 0) throw new Error('请指定容器宽高')
      if (typeof renderCallback === 'function') {
        renderCallback(this.layout.items || [], this.layout, this.element)
      }
      if (!this._mounted) this.mount()  // 第一次Container没挂载则挂载，后续添加后自动更新布局
    })
  }

  /**
   * 将item成员从Container中全部移除
   * */
  public unmount() {
    this.items.forEach((item: Item) => item.unmount())
    this.reset()
    this._mounted = false
    this._disconnect_()
    this.bus.emit('containerUnmounted')
  }

  /** 移除对容器的resize监听  */
  private _disconnect_() {
    this.__ownTemp__.observer['disconnect']()
  }

  /**
   * 尝试切换并渲染布局  // TODO getter layout 里面判断窗口大小并返回对应布局数据
   * */
  private _trySwitchLayout() {
    const useLayout = this.useLayout
    if (!this.getConfig("px") || !useLayout.px) return
    if (this.getConfig("px") === useLayout.px) return
    if (this.platform === 'native') {
      this.unmount()
      this.clear();
      (useLayout.items as Item[]).forEach((item) => this.addItem(item))
    }
  }

  /**
   * 监听浏览器窗口resize
   * */
  public _observer_() {
    let refuseFirstCallDebounceAndThrottle = 0  // 拒绝container.mount时第一次节流函数和防抖函数执行
    const layoutChangeFun = () => {
      if (refuseFirstCallDebounceAndThrottle++ < 2) return
      if (!this._mounted) return
      this.bus.emit('containerResizing')
      this._trySwitchLayout()
    }
    const observerResize = () => {
      layoutChangeFun()
      _debounce() // 防抖，保证最后一次执行执行最终布局
    }
    const _debounce: Function = debounce(layoutChangeFun, 300)
    const _throttle: Function = throttle(observerResize, 80)
    this.__ownTemp__.observer = new ResizeObserver(_throttle)
    this.__ownTemp__.observer['observe'](this.element)
  }

  /**
   * 使用css class 或者 Item的对应name, 或者 Element元素 找到该对应的Item，并返回所有符合条件的Item
   * name的值在创建 Item的时候可以传入 或者直接在标签属性上使用name键值，在这边也能获取到
   * @param { String,Element } nameOrClassOrElement  宽度 高度 是栅格的倍数
   * @return {Array} 所有符合条件的Item
   * */
  public find(nameOrClassOrElement: string | HTMLElement): Item[] {
    return this.items.filter((item) => {
      return item.name === nameOrClassOrElement
        || item.element === nameOrClassOrElement
        || isString(nameOrClassOrElement) && item.classList.includes(nameOrClassOrElement)
    })
  }

  /** 执行后会只能根据当前items占用的位置更新 container 的大小 */
  public updateContainerSizeStyle(): void {
    this.domImpl.updateStyle({
      width: `${this.nowWidth()}px`,
      height: `${this.nowHeight()}px`,
    }, this.contentElement)
  }

  /** 计算当前Items所占用的Container宽度  */
  public nowWidth(): number {
    let marginWidth = 0
    let nowCol = this.getConfig("col")
    if (nowCol > 1) marginWidth = (nowCol - 1) * this.getConfig("margin")[0]
    return (nowCol * this.getConfig("size")[0]) + marginWidth || 0
  }

  /** 计算当前Items所占用的Container高度   */
  public nowHeight(): number {
    let marginHeight = 0
    let nowRow = this.getConfig("row")
    if (nowRow > 1) marginHeight = (nowRow - 1) * this.getConfig("margin")[1]
    return (nowRow * this.getConfig("size")[1]) + marginHeight || 0
  }

  /** 获取外容器可视范围的col  */
  public get containerW(): number {
    return Math.floor(this.element.getBoundingClientRect().width / (this.getConfig("size")[0] + this.getConfig("margin")[0])) || 1
  }

  /** 获取外容器可视范围的row */
  public get containerH(): number {
    return Math.floor(this.element.getBoundingClientRect().height / (this.getConfig("size")[1] + this.getConfig("margin")[1])) || 1
  }

  /** 获取內容器可视范围的col  */
  public get contentBoxW(): number {
    return Math.ceil(this.contentElement.getBoundingClientRect().width / (this.getConfig("size")[0] + this.getConfig("margin")[0]))
  }

  /** 获取内容器可视范围的row */
  public get contentBoxH(): number {
    return Math.ceil(this.contentElement.getBoundingClientRect().height / (this.getConfig("size")[1] + this.getConfig("margin")[1]))
  }

  private _init() {
    this.initLayoutInfo()
    let items = this.getConfig('items')
    items.forEach((item) => this.addItem(item, {syncCustomItems: false}))
    this.bus.emit('init')
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
          this.bus.emit("warn", {
            message: `未指定layout的px值,传入的layout为${b}`
          })
          isBreak = true
        }
        return a.px - b.px
      })
    }
    this.layouts = JSON.parse(JSON.stringify(layoutInfo))    // items 可能用的通个引用源，这里独立给内存地址，这里包括所有的屏幕适配布局，也可能只有一种默认实例化未通过挂载layouts属性传入的一种布局
    // console.log(layoutInfo);
  }

  /** 将item成员从Container中全部移除，之后重新渲染  */
  public remount() {
    this.unmount()
    this.mount()
  }

  /**
   * 添加一个itemOptions配置信息创建一个Item实例到items列表中，不会挂载到dom中
   * 框架内部添加Item时所有的Item必须通过这里添加到容器中
   * @param itemOptions
   * @param options
   * @param options.syncCustomItems  同步到用户的items配置中
   * */
  public addItem(itemOptions: CustomItem | Item, options: { syncCustomItems?: boolean } = {}): Item {   //  html收集的元素和js生成添加的成员都使用该方法添加
    const {syncCustomItems = true} = options
    let item = <Item>itemOptions
    let customOpt = itemOptions
    if (itemOptions instanceof Item) customOpt = itemOptions.customOptions
    else item = new Item(customOpt)
    if (syncCustomItems) this.layout.items.push(customOpt)
    this.items.push(item)
    // console.log(item === itemOptions)
    item.customOptions = customOpt
    item.container = this
    item.parentElement = this.contentElement
    item.i = this.items.length
    return item
  }

  /** 在items列表中移除指定Item引用 */
  public removeItem(removeItem) {
    for (let i = 0; i < this.items.length; i++) {
      if (removeItem === this.items[i]) {
        this.items.splice(i, 1)
        break
      }
    }
  }

  /** 清除重置布局矩阵 */
  public reset(): void {
    this.layoutManager.reset(this.getConfig('col'), this.getConfig('row'))
  }

  /** 清除所有Items */
  public clear() {
    this.items.splice(0, this.items.length)
  }
}

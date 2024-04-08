// noinspection JSUnusedGlobalSymbols

import {debounce, getContainerFromElement, getItemFromElement, throttle} from "@/utils/tool";
import {Item} from "@/main/item/Item";
import {
  ComputedLayoutOptions,
  ContainerParameters,
  CustomLayoutOptions,
  EventBusType,
  GridPlugin,
  UseLayoutOptions
} from "@/types";
import {removeGlobalEvent, startGlobalEvent} from "@/events/listen";
import Bus, {Emitter} from 'mitt'
import {PluginManager} from "@/main/manager/PluginManager";
import {calculateContainerParametersKeepRatio, computeSmartRowAndCol} from "@/algorithm";
import {isString} from "is-what";
import {grid_container_class_name} from "@/constant";
import {updateStyle} from "@/utils";
import {createSTRect} from "@/global/singleThrottle";
import {DefaultEachPlugin} from "@/plugins-src/layout-plugins/defaultEachPlugin";
import {ThrowMessageEvent} from "@/plugins-src";
import {ContainerGeneralImpl, LayoutManager} from "@/main";


/**
 *  ## 栅格容器
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
  //----------------内部需要的参数---------------------//
  public bus: Emitter<EventBusType> = Bus()
  public pluginManager: PluginManager
  public layoutManager: LayoutManager
  public readonly customOptions: CustomLayoutOptions
  public readonly useLayout: UseLayoutOptions    //  当前使用的在用户传入layout布局方案的基础上，增加可能未传入的col,gap,size等等必要构建容器字段
  public element: HTMLElement = null //  container的挂载节点
  public containerElement: HTMLElement = null     // 放置Item元素的真实容器节点，被外层容器用户指定挂载点的element直接包裹
  public STRect?: ReturnType<typeof createSTRect> = null
  //----------------保持状态所用参数---------------------//
  public mounted?: boolean = false
  public readonly __ownTemp__ = {
    //-----内部可写外部只读变量------//
    _firstSetState: true,
    _setStateLocking: false,
    observers: {
      resize: void 0,
      mutation: void 0,
    },
  }

  constructor() {
    const _this = this
    this.pluginManager = new PluginManager(this)
    this.layoutManager = new LayoutManager()
    this.use(DefaultEachPlugin)
    this.customOptions = {items: []} as any
    const useLayout: UseLayoutOptions = new ContainerGeneralImpl() as any
    Object.defineProperties(<object>this, {
      /**
       * 每次获取 container.useLayout 都会重新计算 row 和 col
       * */
      useLayout: {
        get() {
          const {containerWidth, gapX, itemWidth} = useLayout
          useLayout.row = computeSmartRowAndCol(useLayout.items).smartRow
          const col = (containerWidth <= itemWidth ? 1 : Math.floor((containerWidth + gapX) / (gapX + itemWidth)))
          useLayout.col = !isNaN(col) && isFinite(col) ? col : 1
          return useLayout
        }
      }
    })
  }

  /**
   * @param plugin
   * @param opt
   * @param opt.hotSwappable  是否对该插件进行热插拔
   * */
  public use(plugin: GridPlugin, opt?: { hotSwappable?: boolean }): this {
    const {hotSwappable = false} = opt || {}
    if (this.mounted && !hotSwappable) {
      throw new Error('插件应该在容器挂载之前使用，如果你需要热插拔插件, 你应该在参数2中 使用 hotSwappable 明确指定')
    }
    if (typeof plugin === 'object' && plugin.each) {   // 将布局管理器的钩子分发
      this.layoutManager.setState({each: plugin.each})
    }
    this.pluginManager.use(plugin)
    return this
  }

  /**
   * 每次 setState 前建议都将 layout 配置传入给该函数进行验证是否通过， 不过没有验证直接使用 setState， 可能将会发生错误
   * 传入的 validateOptions 必须是完整且能构成容器的参数，
   * 例如必须包含 items 和 containerWidth 和 (gapX | itemWidth) 和 (gapY | itemHeight)
   * */
  public validate(customLayout: CustomLayoutOptions): Partial<ThrowMessageEvent> | null {
    const validateOptions = {...customLayout}
    let errorMessage: Partial<ThrowMessageEvent> | Record<any, any> | null = null
    let computedLayoutInfo: ContainerParameters
    try {
      computedLayoutInfo = this.computedLayout(validateOptions)
    } catch (e) {
      return {
        type: 'ComputedContainerParameters',
        message: e.message,
        errorLayout: validateOptions,
      }
    }
    /*-----------------------------------------------------------------------------------*/
    errorMessage = this.layoutManager.validate(computedLayoutInfo.col, validateOptions)
    /*-----------------------------------------------------------------------------------*/
    return errorMessage
  }

  /**
   * 直接修改布局配置, 所应用的配置即时生效到视图
   * 注意:
   *    第一次设置外部定义 items 时可以不需要完整指定 x, y, 但是需要在 layout 事件中进行算法实现并最终指定items最终x,y 的位置( 可以参考默认代码使用 )
   *    ```js
   *      // layout event
   *      const {container} = ev
   *      let res = container.layoutManager.autoAnalysis()
   *      const nextLayoutOptions = res.nextLayoutOptions
   *      container.setState(nextLayoutOptions)
   *    ```
   *    @param customLayout
   *    @param opt
   *    @param opt.applyStateOnly  仅应用当前的状态， 不会发起 layout 事件进行算法布局
   * */
  public setStateDirectly(customLayout: Partial<CustomLayoutOptions>, opt: { applyStateOnly?: boolean } = {}): void {
    const {applyStateOnly = false} = opt || {}
    if (!this.mounted) {
      throw new Error('[setState] 容器未挂载')
    }
    if (!Object.keys(customLayout).length) {
      return
    }
    const __ownTemp__ = this.__ownTemp__
    __ownTemp__._firstSetState = false
    /*-----------------------------------------------------------------------------------*/
    const usingItems = this.useLayout.items
    const finallyCustomOptions = {...this.customOptions, ...customLayout}  // 这个是最新的完整用户配置
    let computedLayoutInfo: ContainerParameters
    try {
      computedLayoutInfo = this.computedLayout(finallyCustomOptions)
    } catch (e) {
    }
    Object.keys(customLayout).forEach(name => (customLayout[name] === null || customLayout[name] === void 0) ? delete finallyCustomOptions[name] : null)   /* 删除主动设置成 null 或者 undefined 在 customOptions 中的配置 */
    Object.keys(this.customOptions).forEach(name => delete this.customOptions[name])  // 清空 customOptions
    Object.assign(this.customOptions, finallyCustomOptions)   // 应用最新的完整用户配置
    delete finallyCustomOptions.items
    Object.assign(this.useLayout, finallyCustomOptions, computedLayoutInfo)  // 更新生成当前容器布局的完整配置信息
    this.layoutManager.setState({...customLayout, col: this.useLayout.col})
    if (customLayout.items) {
      // console.log(options.items)
      const nextItems: Item[] = []
      const nextItemKeys = customLayout.items.map(item => item.key)
      for (const i in customLayout.items) {
        const itemOptions = customLayout.items[i]
        // console.log(itemOptions)
        const foundItem = usingItems.find(item => item instanceof Item && item.key === itemOptions.key)
        if (foundItem) {   // 上次存在，本次更新依然存在
          nextItems.push(foundItem)
          Object.assign(foundItem.pos, itemOptions.pos)
        } else {   // 还未挂载到DOM中的新 item
          nextItems.push(new Item({...itemOptions, container: this}))
        }
      }
      const removeItems = usingItems.filter(item => !nextItemKeys.includes(item.key))  // 过滤出上次有本次没有的需要移除的成员
      removeItems.forEach(item => item.mounted && item.unmount())
      usingItems.splice(0, usingItems.length, ...nextItems)
      this.layoutManager.setState({items: usingItems})
      usingItems.forEach((item: Item) => item.mounted && item.updateItemLayout())
    }
    this.updateContainerSizeStyle()
    /*-----------------------------------------------------------------------------------*/
    if (!applyStateOnly && !__ownTemp__._setStateLocking) {
      __ownTemp__._setStateLocking = true
      this.bus.emit('layout')
      usingItems.forEach((item: Item) => !item.mounted && item.mount())
      __ownTemp__._setStateLocking = false
    }
  }

  /**
   * 尝试设置新的容器状态，
   * 如果验证通过则使用 setStateDirectly 接口进行应用最新状态
   * 如果失败则发起error事件进行手动处理
   * @return {Partial<ThrowMessageEvent> | null} 是否产生错误
   * */
  public setState(options: Partial<CustomLayoutOptions>): Partial<ThrowMessageEvent> | null {
    const finallyCustomOptions = {...this.customOptions, ...options}  // 这个是最终最新的完整用户配置
    Object.keys(options).forEach(name => (options[name] === null || options[name] === void 0) ? delete finallyCustomOptions[name] : null)
    const err = this.validate(<CustomLayoutOptions>finallyCustomOptions)
    if (err) {
      if (this.__ownTemp__._firstSetState) {
        this.setStateDirectly(options, {applyStateOnly: true})
      }
      this.bus.emit('error', err)
    } else {
      this.setStateDirectly(options)
    }
    return err
  }

  /**
   * el 参数可以传入一个具名ID  或者一个原生的 Element 对象
   * 直接渲染Container到实例化传入的所指 ID 元素中, 将实例化时候传入的 items 数据渲染出来，
   * 如果实例化不传入 items 可以在后面自行创建item之后手动渲染
   * */
  public mount(el: string | HTMLElement): void {
    if (this.mounted) {
      throw new Error('重复挂载容器被阻止')
    }
    if (!el) {
      throw new Error('请指定需要绑定的el,是一个id或者class值或者原生的element')
    }
    startGlobalEvent()  // 开启全局事件监听， 多容器下只会开启一次
    //-----------------------容器dom初始化-----------------------//
    this.element = el instanceof Element ? el : <HTMLElement>document.querySelector(el)
    if (!this.element) {
      throw new Error('在DOM中未找到指定ID对应的:' + el + '元素')
    }
    /*--------------------容器布局信息初始化与检测----------------------*/
    this.STRect = createSTRect(this)
    /*--------生成真实的item挂载父级容器元素，并将挂到外层根容器上----------*/
    this.bus.emit('containerMountBefore')
    this.containerElement = document.createElement('div')
    this.containerElement['_gridContainer_'] = this
    this.containerElement['_isGridContainer_'] = true
    this.containerElement.classList.add(grid_container_class_name)
    this.element.appendChild(this.containerElement)
    // setTimeout(() => {
    //   updateStyle({transition: 'all 200ms'}, this.containerElement)
    // }, 360)
    //-------------------------其他操作--------------------------//
    this._observer_()
    this.mounted = true
    this.bus.emit('containerMounted')
  }

  /**
   * 将item成员从Container中全部移除
   * */
  public unmount(): void {
    if (!this.mounted) {
      return
    }
    Array.from(this.useLayout.items).forEach((item: Item) => item.unmount()) // 使用Array.from是不会被卸载过程影响到原数组导致卸载不干净
    this.mounted = false
    if (this.containerElement.isConnected) {
      this.element.removeChild(this.containerElement)
    }
    this.__ownTemp__._firstSetState = true
    const observers = this.__ownTemp__.observers || {}
    Object.values(observers).forEach(observer => observer && observer['disconnect']())
    this.bus.emit('containerUnmounted')
    removeGlobalEvent()
  }

  /**
   * 监听浏览器窗口resize
   * 监听container，item元素卸载
   * */
  private _observer_() {
    if (this.mounted) {
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
    mutationObserver.observe(this.containerElement, { // 监控所有的item移除
      childList: true,
    })
    this.__ownTemp__.observers.mutation = mutationObserver
  }

  /**
   * 使用css class 或者 Item的对应name, 或者 Element元素 或者 item.i的值 找到该对应的Item，并返回所有符合条件的Item
   * name的值在创建 Item的时候可以传入 或者直接在标签属性上使用name键值，在这边也能获取到
   * @return {Array} 所有符合条件的Item
   * @param elementOrKey
   * */
  public findItem(elementOrKey: string | HTMLElement): Item[] {
    return this.useLayout.items.filter((item) => isString(elementOrKey) && item.key === elementOrKey || item.element === elementOrKey)
  }

  /** 执行后会只能根据当前items占用的位置更新 container 的大小 */
  public updateContainerSizeStyle(opt: { col?: number, row?: number } = {}): void {
    let {col, row} = opt
    updateStyle({
      width: `${this.nowWidth(col)}px`,
      height: `${this.nowHeight(row)}px`,
    }, this.containerElement)
    this.STRect.updateCache("containerContent")
  }

  /** 计算当前Items所占用的Container宽度  */
  public nowWidth(nowCol?: number): number {
    nowCol = nowCol || this.useLayout.col
    const {gapX, itemWidth} = this.useLayout
    const allGapWidth = nowCol > 1 ? (nowCol - 1) * gapX : 0
    return (nowCol * itemWidth) + allGapWidth
  }

  /** 计算当前Items所占用的Container高度   */
  public nowHeight(nowRow?: number): number {
    nowRow = nowRow || this.useLayout.row
    const {gapY, itemHeight} = this.useLayout
    const allGapHeight = nowRow > 1 ? (nowRow - 1) * gapY : 0
    return (nowRow * itemHeight) + allGapHeight
  }

  /**
   *  px像素转栅格单位 w
   *  @param pxNum
   *  @param opt
   *  @param opt.floor        是否往下取整
   *  @param opt.keepSymbol   是否保持符号，比如传入pxNum是负数，返回也是负数
   *  */
  public pxToGridW(pxNum: number, opt: { floor?: boolean, keepSymbol?: boolean } = {}): number {
    const {floor = false, keepSymbol = false} = opt
    const toInteger = floor ? Math.floor : Math.ceil
    const {gapX, itemWidth} = this.useLayout
    let res: number
    res = itemWidth >= Math.abs(pxNum) ? 1 : toInteger(Math.abs(pxNum) / (gapX + itemWidth))
    if (keepSymbol) {
      res *= Math.sign(pxNum === 0 ? 1 : pxNum)
    }
    return res
  }

  /**
   * px像素转栅格单位 h
   * @param pxNum
   * @param opt
   * @param opt.floor        是否往下取整
   * @param opt.keepSymbol   是否保持符号，比如传入pxNum是负数，返回也是负数
   * */
  public pxToGridH(pxNum: number, opt: { floor?: boolean, keepSymbol?: boolean } = {}) {
    const {floor = false, keepSymbol = false} = opt
    const toInteger = floor ? Math.floor : Math.ceil
    const {gapY, itemHeight} = this.useLayout
    let res: number
    res = itemHeight >= Math.abs(pxNum) ? 1 : toInteger(Math.abs(pxNum) / (gapY + itemHeight))
    if (keepSymbol) {
      res *= Math.sign(pxNum === 0 ? 1 : pxNum)
    }
    return res
  }

  /**
   * 通过必要参数 ( itemWidth, itemHeight, containerWidth, containerHeight)
   * 和可选参数 (gapX, gapY, ratioCol, ratioRow)
   * 将会自动计算其余支撑用于生成容器的参数
   * */
  public computedLayout(layout: Partial<ComputedLayoutOptions>): ContainerParameters {
    return calculateContainerParametersKeepRatio(layout)
  }
}

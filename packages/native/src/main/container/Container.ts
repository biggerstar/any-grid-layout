import {defaultStyle} from "@/default/style/defaultStyle";
import {debounce, merge, throttle} from "@/utils/tool";
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import {Sync} from "@/utils/Sync";
import {Item} from "@/main/item/Item";
import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";
import {ContainerInstantiationOptions, CustomEventOptions, CustomItem} from "@/types";
import {DomFunctionImpl} from "@/utils/DomFunctionImpl";
import {Engine} from "@/main";
import {EventCallBack} from "@/utils/EventCallBack";
import {startGlobalEvent} from "@/events/listen";
import {tempStore} from "@/store";

//---------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------//

/** #栅格容器, 所有对DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 *   Container中所有对外部可以设置的属性都是在不同的布局方案下全局生效，如若有设定layout布局数组或者单对象的情况下,
 *   该数组内的配置信息设置优先于Container中设定的全局设置，比如 实例化传进
 *   ```javascript{
 *    col: 8,
 *    size:[80,80],
 *    layout:[{
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
 *  # size,margin, [col || row](后面简称CR) 在传入后的响应结果,
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
  public className: string = 'grid-container'
  public platform: 'native' | 'vue' = 'native'
  public el: HTMLElement | string = ''
  public events: CustomEventOptions = {} as any
  public global: ContainerGeneralImpl = {} as any
  public layouts: ContainerGeneralImpl[] = [] as any
  //----------------内部需要的参数---------------------//
  /**
   * 当前正在使用的布局，为layouts中的某一个适合当前屏幕的布局配置的地址引用
   * 该布局会信息会在切换布局的时候被修改，原因是为了同步当前最新布局保存到layouts中
   * */
  public readonly layout: ContainerGeneralImpl = {} as any
  public readonly useLayout: ContainerGeneralImpl = {} as any  //  当前使用的在用户传入layout布局方案的基础上，增加可能未传入的col,margin,size等等必要构建容器字段
  public classList: string[] = []
  public attr: any = []
  public engine: Engine
  public isNesting: boolean = false    // 该Container自身是否[被]嵌套
  public childContainer: Container[] = [] // 所有该Container的直接子嵌套容器
  public element: HTMLElement   //  container主体元素节点
  public contentElement: HTMLElement     // 放置Item元素的真实容器节点，被外层容器根element直接包裹
  public parent: Container   // 嵌套情况下上级Container
  public parentItem: Item
  public containerH: number
  public containerW: number
  public eventManager: EventCallBack      // events通过封装构建的类实例
  private readonly domImpl: DomFunctionImpl

  //----------------vue 支持---------------------//
  // TODO 后面在vue的layout模块使用declare module进行声明合并
  public vue: any
  public _VueEvents: object
  //----------------保持状态所用参数---------------------//
  private _mounted: boolean
  public readonly _default: ContainerGeneralImpl
  private __store__ = tempStore
  public __ownTemp__ = {
    //-----内部可写外部只读变量------//
    preCol: 0,   // 容器大小改变之前的col
    preRow: 0,   // 容器大小改变之前的row
    exchangeLock: false,
    firstInitColNum: null,
    firstEnterUnLock: false,   //  第一次进入的权限是否解锁
    nestingEnterBlankUnLock: false,   //  嵌套第一次进入是否是空白处
    moveExchangeLock: false,
    beforeOverItems: [],  // 保存响应式模式下开始拖拽后经过的Item,最多保存20个
    moveCount: 0,
    offsetPageX: 0,        // 容器距离浏览器可视区域左边的距离
    offsetPageY: 0,       //  容器距离浏览器可视区域上边的距离
    exchangeLockX: false,  // 锁定Item是否可以横向移动
    exchangeLockY: false, // 锁定Item是否可以纵向向移动
    beforeContainerSizeInfo: null,
    observer: null,
    nestingFirstMounted: false // 嵌套模式下第一次是否挂载，决定是否执行render函数
    //----------可写变量-----------//
  }

  constructor(options: ContainerInstantiationOptions) {
    if (!options.el) new Error('请指定需要绑定的el,是一个id或者class值或者原生的element')
    merge(this, options)
    this._define()
    this.eventManager = new EventCallBack(<any>options.events)
    this.engine = new Engine(options)
    this.engine.setContainer(this)
    this.domImpl = new DomFunctionImpl(this)
    this._default = new ContainerGeneralImpl()
    if (options.parent) {
      this.parent = options.parent
      this.parent.childContainer.push(this)
      this.isNesting = true
    }
    //-------------------------------------------------
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
          debugger
        }
      },
      useLayout: {
        get() {
          return useLayout
        },
        set(_: any) {
          debugger
        }
      }
    })
  }

  /** 传入配置名获取当前正在使用的配置值 */
  public getConfig<Name extends keyof ContainerGeneralImpl>(name: Name): Exclude<ContainerGeneralImpl[Name], undefined> {
    // console.log(name, this.useLayout[name], this._default[name])
    return this.useLayout[name] || this.layout[name] || this.global[name] || this._default[name]
  }

  /** 将值设置到当前使用的配置信息中 */
  public setConfig<Name extends keyof ContainerGeneralImpl>(name: Name, data: ContainerGeneralImpl[Name]): void {
    // if (name === 'row' && data === 503) debugger
    return this.useLayout[name] = data
  }

  /**
   * el 参数可以传入一个具名ID  或者一个原生的 Element 对象
   * 直接渲染Container到实例化传入的所指 ID 元素中, 将实例化时候传入的 items 数据渲染出来，
   * 如果实例化不传入 items 可以在后面自行创建item之后手动渲染
   * */
  public mount(): void {
    if (this._mounted) return console.warn('[mount Function] 容器重复挂载被阻止', this)
    const _mountedFun = () => {
      //-----------------------容器dom初始化-----------------------//
      if (this.el instanceof Element) this.element = this.el
      if (!this.element) {
        if (!this.isNesting) this.element = <HTMLElement>document.querySelector(<string>this.el)
        if (!this.element) throw new Error('在DOM中未找到指定ID对应的:' + this.el + '元素')
      }
      this.element['_gridContainer_'] = this       // TODO declare global
      this.element['_isGridContainer_'] = true
      if (this.platform === 'vue') {
        this.contentElement = <HTMLElement>this.element.querySelector('.grid-container-area')
      } else {
        this._patchGridContainerBox()
        this.domImpl.updateStyle(defaultStyle.gridContainerArea)   // 必须在engine.init之前
      }
      this.attr = Array.from(this.element.attributes)
      this.classList = Array.from(this.element.classList)

      //-----------------容器布局信息初始化与检测--------------------//
      this.engine.init()
      this._observer_()
      //-------------------------其他操作--------------------------//
      let nestingTimer: any = setTimeout(() => {
        this._isNestingContainer_()
        clearTimeout(nestingTimer)
        nestingTimer = null
      })
      this.updateContainerStyleSize()
      this.__ownTemp__.firstInitColNum = this.getConfig("col") as any
      this.__store__.screenWidth = window.screen.width
      this.__store__.screenHeight = window.screen.height
      this._mounted = true
      this.eventManager._callback_('containerMounted', this)
      // if (typeof mCallback === 'function') mCallback.bind(this)(this)
    }
    if (this.platform === 'vue') _mountedFun()
    else Sync.run(_mountedFun)
  }

  /** 生成真实的item挂载父级容器元素，并将挂到外层根容器上 */
  public _patchGridContainerBox = () => {
    this.contentElement = document.createElement('div')
    this.contentElement.classList.add('grid-container-area')
    this.contentElement['_isGridContainerArea'] = true
    this.element.appendChild(this.contentElement)
    this.domImpl.updateStyle(defaultStyle.gridContainer, this.contentElement)
    this.contentElement.classList.add(this.className)
  }

  /** 手动添加item渲染 */
  public render(renderCallback: Function) {
    Sync.run(() => {
      if (this.element && this.element.clientWidth <= 0) {
        return
      }
      if (typeof renderCallback === 'function') {
        renderCallback(this.layout.items || [], this.layout, this.element)
      }
      if (!this._mounted) this.mount()  // 第一次Container没挂载则挂载，后续添加后自动更新布局
      this.updateLayout(true)
    })
  }

  /**
   * 将item成员从Container中全部移除
   * @param {Boolean} isForce 是否移除element元素的同时移除掉现有加载的items列表中的对应item
   * */
  public unmount(isForce = false) {
    this.engine.unmount(isForce)
    this._mounted = false
    this._disconnect_()
    this.eventManager._callback_('containerUnmounted', this)
  }

  /** 将item成员从Container中全部移除，之后重新渲染  */
  public remount() {
    this.engine.remount()
  }

  public remove(removeItem) {
    this.engine.items.forEach((item) => {
      if (removeItem === item) item.remove()
    })
  }

  /** 以现有所有的Item pos信息更新Container中的全部Item布局，可以用于对某个单Item做修改后重新规划更新布局  */
  public updateLayout(items = null, ignoreList = []) {
    this.engine.updateLayout(items, ignoreList)
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
    if (this.getConfig("px") === useLayout.px) return;
    if (this.platform === 'native') {
      // vue中的Item是由vue自己管理，这边不参与，该注释段落保留后面可能有用
      this.engine.unmount(false)
      this.engine.clear();
      (useLayout.items as Item[]).forEach((item) => this.add(item))
    }
    this.eventManager._callback_('useLayoutChange', this.useLayout, this.element.clientWidth, this)
    const vueUseLayoutChange = this._VueEvents['vueUseLayoutChange']
    if (typeof vueUseLayoutChange === 'function') vueUseLayoutChange(useLayout)
  }

  /**
   * 监听浏览器窗口resize
   * */
  public _observer_() {
    const layoutChangeFun = () => {
      if (!this._mounted) return
      let useLayoutConfig /* 检测下一个配置，后面会通过px确定是否更换了配置 */ = this.useLayout
      const res = this.eventManager._callback_('mountPointElementResizing', useLayoutConfig, this.element.clientWidth, this)
      if (res === null || res === false) return
      this._trySwitchLayout()
      this.engine.updateLayout(true)
      this.updateContainerStyleSize()
    }
    const observerResize = () => {
      layoutChangeFun()
      _debounce() // 防抖，保证最后一次执行执行最终布局
    }
    const _debounce = debounce(layoutChangeFun, 300)
    const _throttle = throttle(observerResize, 80)
    this.__ownTemp__.observer = new ResizeObserver(_throttle)
    this.__ownTemp__.observer['observe'](this.element)
  }

  /**
   * 为dom添加新成员
   * @param { CustomItem} itemOptions
   * @return {Item}  添加成功返回该添加创建的Item，添加失败返回null
   * */
  public add(itemOptions: CustomItem): Item | null {
    this.layout.items.push(itemOptions)
    return this.engine.addItem(itemOptions)
  }

  /**
   * 使用css class 或者 Item的对应name, 或者 Element元素 找到该对应的Item，并返回所有符合条件的Item
   * name的值在创建 Item的时候可以传入 或者直接在标签属性上使用name键值，在这边也能获取到
   * @param { String,Element } nameOrClassOrElement  宽度 高度 是栅格的倍数
   * @return {Array} 所有符合条件的Item
   * */
  public find(nameOrClassOrElement: string | HTMLElement): Item[] {
    return this.engine.items.filter((item) => {
      return item.name === nameOrClassOrElement
        || item.classList.includes(nameOrClassOrElement)
        || item.element === nameOrClassOrElement
    })
  }

  /** 生成该栅格容器布局样式  */
  public genContainerStyle(): {
    width: string,
    height: string,
  } {
    const nowWidth = this.nowWidth() + 'px'
    const nowHeight = this.nowHeight() + 'px'
    return {
      width: nowWidth,
      height: nowHeight,
    }
  }

  /** 执行后会只能根据当前items占用的位置更新 container 的大小 */
  public updateContainerStyleSize(): void {
    this.domImpl.updateStyle(this.genContainerStyle(), this.contentElement)
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

  /** 确定该Item是否是嵌套Item，并将其保存到相关配置的字段 */
  public _isNestingContainer_(element = null): void {
    element = element ? element : this.element
    if (!element) return
    while (true) {
      if (element.parentElement === null) {    // 父元素往body方向遍历上去为null表示该Container是第一层
        this.__ownTemp__.offsetPageX = this.contentElement.offsetLeft
        this.__ownTemp__.offsetPageY = this.contentElement.offsetTop
        break
      }
      element = element.parentElement    //  不是null在链中往上取父元素
      // console.log(element._isGridItem_);

      if (element._isGridItem_) {      //  上级是Item表示是嵌套的， 父元素是Container元素执行自身offset加上父元素offset
        const upperItem = element._gridItem_
        this.__ownTemp__.offsetPageX = upperItem.element.offsetLeft + upperItem.container.__ownTemp__.offsetPageX
        this.__ownTemp__.offsetPageY = upperItem.element.offsetTop + upperItem.container.__ownTemp__.offsetPageY
        element._gridItem_.container.childContainer.push({
          parent: element._gridItem_.container,
          container: this,
          nestingItem: element._gridItem_
        })
        element._gridItem_.nested = true
        this.isNesting = true
        this.parentItem = upperItem
        break
      }
    }
  }
}

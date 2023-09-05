import {LayoutManager} from "@/algorithm";
import {Item} from "@/main";
import {AnalysisResult, CustomItemPos, MoveDirection} from "@/types";
import {tempStore} from "@/events";
import {autoSetSizeAndMargin} from "@/algorithm/common";

/**
 * 布局算法接口，实现真正的算法逻辑
 * */
export abstract class Layout {
  constructor(manager: LayoutManager) {
    this.manager = manager
    let old = 0;
    this.throttle = (func) => {
      let now = new Date().valueOf();
      let res
      if (now - old > this.wait) {
        res = func.apply(<object>this);
        old = now;
      }
      return res
    }
  }

  /**
   * 布局名称
   * */
  protected name: string = ''
  protected static: boolean = false

  /**
   * 下次要使用的布局，所有的算法操作都操作该数组，最终框架会自动
   * */
  public layoutItems: Item[]

  /**
   * 下次要修改的Item
   * */
  private _modifyItems: Array<{ item: Item, pos: CustomItemPos }> = []

  /**
   * 获取要修改的Items并清空当前列表,所有要修改的Item都添加到这里来，不要修改item本身的pos，后面检测能添加的时候会自动修改
   * */
  public addModifyItems(info: { item: Item, pos: CustomItemPos }) {
    this._modifyItems.push(info)
  }

  /**
   * 获取要修改的Items并清空当前列表
   * */
  public getModifyItems() {
    const _items = this._modifyItems
    this._modifyItems = []
    return _items
  }

  /**
   * 在某个item的基础上创建其要修改的pos信息
   * */
  public createModifyPosInfo(item: Item, pos: Partial<CustomItemPos>) {
    return {
      item,
      pos: {
        ...item.pos,
        ...pos
      }
    }
  }

  /**
   * 在某个item的基础上创建其要修改的pos信息
   * @param onlyOneItemFunc dragItem覆盖目标只有一个的时候执行的函数，默认为null
   * @param multipleItemFunc dragItem覆盖目标只有一个的时候执行的函数，默认为null
   *
   * */
  public patchDiffCoverItem(onlyOneItemFunc: Function | null, multipleItemFunc: Function = null): void {
    const {dragItem, gridX: x, gridY: y} = tempStore
    if (!dragItem) return;
    let toItemList = this.manager.findCoverItemsFromPosition(this.layoutItems, {
      ...dragItem.pos,
      x,
      y
    })
    if (!toItemList.length) return
    toItemList = toItemList.filter(item => item !== dragItem)
    if (toItemList.length === 1 && typeof onlyOneItemFunc === 'function') {
      onlyOneItemFunc(toItemList[0])
    } else {
      if (typeof multipleItemFunc === 'function') toItemList.forEach((item) => multipleItemFunc(item))
    }
  }

  /**
   * 节流时间
   * */
  public wait?: number = 66

  /**
   * 管理器实例化布局算法的时候传入的管理器实例
   * */
  public manager: LayoutManager

  /**
   * 通过改造过的异步节流函数,可用于高频布局请求节流，返回值是传入函数执行后的返回值
   * */
  public throttle: <Res>(func: () => infer Res, wait?: number) => Res

  /**
   * 判断两个item的大小是否相等
   * */
  public equalSize(item1: Item, item2: Item) {
    return (item1.pos.w === item2.pos.w) && (item1.pos.h === item2.pos.h)
  }

  /**
   * 用于初次加载Item到容器时初始化，用于设置容器的大小或其他操作
   * @return {AnalysisResult | void} 返回结果，如果failed长度不为0，表明有item没添加成功则会抛出警告事件
   * */
  public init() {
    const manager = this.manager
    const container = manager.container
    const engine = container.engine
    autoSetSizeAndMargin(container, true)
    engine.reset()
    const baseLine = container.getConfig("baseLine")
    const res = manager.analysis(engine.items, null, {
      baseLine,
      auto: this.hasAutoDirection(baseLine)
    })
    res.patch()
    this.layoutItems = res.successItems
    return res
  }

  /**
   * 外部调用进行布局的入口，子类需要进行实现
   * 你应该在里面修改你要布局的Item.pos位置，最终返回true外部将会帮你自动更新Item的样式以改变显示位置
   * @return {Promise<boolean>} 布局成功后需要返回true，外部会更新当前最新位置
   * */
  public abstract async layout(items, ...args: any[]): Promise<boolean>

  public abstract defaultDirection?(name?: MoveDirection): void

  /**
   * 调用对应移动方向的布局函数，如果没有则使用默认defaultDirection函数钩子
   * 可以所有方向都不指定直接实现defaultDirection，这样的话等于所有钩子都是使用defaultDirection逻辑
   * */
  public callDirectionHook(name: MoveDirection) {
    const hook = this[name]
    if (typeof this.anyDirection === 'function') this.anyDirection?.(name)
    if (typeof hook === 'function') hook.call(<object>this)
    else if (typeof this.defaultDirection === 'function') this.defaultDirection?.(name)
  }

  public patchStyle() {
    requestAnimationFrame(() => {
      this.layoutItems.forEach((item) => item.updateItemLayout())
    })
  }

  /**
   * 判断当前container的baseline方向盒子是否能自动增长
   * */
  public hasAutoDirection() {
    const baseLine = this.manager.container.getConfig("baseLine")
    const container = this.manager.container
    if (['top', 'bottom'].includes(baseLine) && container.autoGrowRow) return true
    else if (['left', 'right'].includes(baseLine) && container.autoGrowCol) return true
    return false
  }

  /**
   * 检测是否允许本次布局，检测方位drag，resize window
   * 目的：防止move事件太快造成item移动太过灵敏发生抖动
   * 检测规则:
   *      如果当前dragItem覆盖区域只有当前dragItem的源item，则忽略移动
   *      如果dragItem移动区域下为空位置，忽略移动
   * */
  public allowLayout() {
    const {toItem, dragItem, gridX, gridY} = tempStore
    if (!dragItem) return true   // 不是drag时就是resize浏览器或者元素盒子窗口
    if (!toItem || toItem === dragItem) {
      const foundItems = this.manager.findCoverItemsFromPosition(this.layoutItems, {
        ...dragItem?.pos,
        x: gridX,
        y: gridY
      })
      if (foundItems.length <= 1) return
    }
    return true
  }

  /**
   * 分析当前鼠标操作移动在源item的某个方向，并执行对应方向的钩子
   * */
  public patchDirection() {
    const {
      dragItem,
      toItem,
      gridX: x,
      gridY: y
    } = tempStore
    if (!dragItem) return
    const X = x - dragItem.pos.x
    const Y = y - dragItem.pos.y
    if (this.static) {
      if (!toItem || dragItem === toItem) {
        this.callDirectionHook('blank')
      }
    } else if (X !== 0 && Y !== 0) {
      if (X > 0 && Y > 0) this.callDirectionHook('rightBottom')
      else if (X < 0 && Y > 0) this.callDirectionHook('letBottom')
      else if (X < 0 && Y < 0) this.callDirectionHook('leftTop')
      else if (X > 0 && Y < 0) this.callDirectionHook('rightTop')
    } else if (X !== 0) {
      if (X > 0) this.callDirectionHook("right")
      if (X < 0) this.callDirectionHook("left")
    } else if (Y !== 0) {
      if (Y > 0) this.callDirectionHook("bottom")
      if (Y < 0) this.callDirectionHook("top")
    }
  }

  /**
   * 检测是否正在动画中,少用，容易回流
   * */
  public isAnimation(item: Item) {
    return Math.abs(
      item.offsetLeft() - item.element.offsetLeft
      || item.offsetTop() - item.element.offsetTop
    ) > 2
  }

  /**
   * 自动移动到当前鼠标位置的空白处，移动的前提是当前位置没有其他Item
   * */
  public moveToBlank() {
    let {
      dragItem,
      relativeX: x,
      relativeY: y,
    } = tempStore
    if (!dragItem || !x || !y) return
    const manager = this.manager
    const container = manager.container
    container.engine.reset()
    this.layoutItems.forEach((item) => {
      if (item === dragItem) return  // 当前的dragItem另外判断
      if (!manager.isBlank(item.pos)) return;
      manager.mark(item.pos)
    })
    const maxItemX = Math.min(x, container.getConfig("col") - dragItem.pos.w + 1)
    const maxItemY = Math.min(y, container.getConfig("row") - dragItem.pos.h + 1)
    x = maxItemX > 0 ? maxItemX : 1  // left和top边界
    y = maxItemY > 0 ? maxItemY : 1
    const toPos = {
      w: dragItem.pos.w,
      h: dragItem.pos.h,
      x,
      y
    }
    console.log(x, y)
    const hasDragPosBlank = manager.isBlank(toPos)
    if (!hasDragPosBlank) return
    manager.mark(toPos)
    dragItem.pos.x = x
    dragItem.pos.y = y
  }

  /** 往任何方向移动都会执行 */
  public abstract anyDirection?(name: MoveDirection): void

  /** 前往容器中空白处执行 */
  public abstract blank?(): void

  public abstract left?(): void

  public abstract right?(): void

  public abstract top?(): void

  public abstract bottom?(): void

  public abstract leftTop?(): void

  public abstract letBottom?(): void

  public abstract rightTop?(): void

  public abstract rightBottom?(): void

}

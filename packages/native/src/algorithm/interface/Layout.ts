import {LayoutManager} from "@/algorithm";
import {Item} from "@/main";
import {AnalysisResult, CustomItemPos, MoveDirection} from "@/types";
import {tempStore} from "@/events";

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
   * */
  public patchDiffCoverItem(onlyOneItemFunc: Function | null, multipleItemFunc: Function): void {
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
  public abstract init(...args: any[]): AnalysisResult | void


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
    this.layoutItems.forEach((item) => item.updateItemLayout())
  }

  /**
   * 分析当前鼠标操作移动在源item的某个方向，并执行对应方向的钩子
   * */
  public patchDirection() {
    const {
      dragItem,
      gridX: x,
      gridY: y
    } = tempStore
    if (!dragItem) return
    const X = x - dragItem.pos.x
    const Y = y - dragItem.pos.y
    if (X !== 0 && Y !== 0) {
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
   * 检测是否正在动画中
   * */
  public isAnimation(item: Item) {
    return Math.abs(
      item.offsetLeft() - item.element.offsetLeft
      || item.offsetTop() - item.element.offsetTop
    ) > 2
  }

  /** 往任何方向移动都会执行 */
  public abstract anyDirection?(name: MoveDirection): void

  public abstract left?(): void

  public abstract right?(): void

  public abstract top?(): void

  public abstract bottom?(): void

  public abstract leftTop?(): void

  public abstract letBottom?(): void

  public abstract rightTop?(): void

  public abstract rightBottom?(): void

}

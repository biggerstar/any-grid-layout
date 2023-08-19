import {LayoutManagerImpl} from "@/algorithm";
import {Item} from "@/main";


type MoveDirection = 'left' | 'right' | 'top' | 'bottom' | 'leftTop' | 'letBottom' | 'rightTop' | 'rightBottom'


/**
 * 布局算法接口，实现真正的算法逻辑
 * */
export abstract class Layout {
  constructor(manager: LayoutManagerImpl) {
    this.manager = manager
    let old = 0;
    this.throttle = (func) => {
      let now = new Date().valueOf();
      if (now - old > this.wait) {
        func.apply(this, arguments);
        old = now;
      }
    }
  }

  /**
   * 布局名称
   * */
  protected name: string = ''

  protected items: Item[]

  /**
   * layout函数参数2传入被保存起来的配置信息
   * */
  public options: {
    [key: string]: any,
    ev: Event & Record<any, any>,
    dragItem: Item,
    toItem: Item,  /* toItem 为null则是空白处 */
    x: number,
    y: number,
    distance: number,
    speed: number
  }

  /**
   * 节流时间
   * */
  protected wait?: number = 80

  /**
   * 管理器实例化布局算法的时候传入的管理器实例
   * */
  protected manager: LayoutManagerImpl

  /**
   * 通过改造过的立即执行无返回函数的节流函数,可用于高频布局请求节流
   * */
  public throttle: (func: Function, wait?: number) => void

  /**
   * 外部调用进行布局的入口，子类需要进行实现
   * @param items
   * @param options
   * @param options.dragItem  当前正在操作拖动的item
   * @param options.x  item的左上角X坐标，endX 是x坐标加上w - 1
   * @param options.y  item的左上角Y坐标，endY 是y坐标加上h - 1
   * @param options.distance  本次鼠标移动的距离
   * @param options.speed  本次鼠标移动的速度，距离/时间
   * @param args
   * */
  public abstract layout(items, options, ...args: any[]): any

  public abstract defaultDirection(name?: MoveDirection): void

  /**
   * 调用对应移动方向的布局函数，如果没有则使用默认defaultDirection函数钩子
   * 可以所有方向都不指定直接实现defaultDirection，这样的话等于所有钩子都是使用defaultDirection逻辑
   * */
  public callDirectionHook(name: MoveDirection) {
    const hook = this[name]
    if (typeof hook === 'function') hook.call(<object>this)
    else if (typeof this.defaultDirection === 'function') this.defaultDirection(name)
  }

  /**
   * 分析当前鼠标操作移动在源item的某个方向，并执行对应方向的钩子
   * */
  public patchDirection() {
    const {
      dragItem,
      x,
      y
    } = this.options
    const X = x - dragItem.pos.x
    const Y = y - dragItem.pos.y

    if (X !== 0 && Y !== 0) {
      if (X > 0 && Y > 0) this.callDirectionHook('rightBottom')
      if (X < 0 && Y > 0) this.callDirectionHook('letBottom')
      if (X < 0 && Y < 0) this.callDirectionHook('leftTop')
      if (X > 0 && Y < 0) this.callDirectionHook('rightTop')
    } else if (X !== 0) {
      if (X > 0) this.callDirectionHook("right")
      if (X < 0) this.callDirectionHook("left")
    } else if (Y !== 0) {
      if (Y > 0) this.callDirectionHook("bottom")
      if (Y < 0) this.callDirectionHook("top")
    }
  }

  public abstract left?(): void

  public abstract right?(): void

  public abstract top?(): void

  public abstract bottom?(): void

  public abstract leftTop?(): void

  public abstract letBottom?(): void

  public abstract rightTop?(): void

  public abstract rightBottom?(): void

}

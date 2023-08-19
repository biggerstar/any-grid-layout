import {LayoutManager} from "@/algorithm";
import {Item} from "@/main";
import {LayoutOptions, MoveDirection} from "@/types";

/**
 * 布局算法接口，实现真正的算法逻辑
 * */
export abstract class Layout {
  constructor(manager: LayoutManager) {
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

  public items: Item[]

  /**
   * layout函数参数2传入被保存起来的配置信息
   * */
  public options: LayoutOptions

  /**
   * 节流时间
   * */
  public wait?: number = 80

  /**
   * 管理器实例化布局算法的时候传入的管理器实例
   * */
  public manager: LayoutManager

  /**
   * 通过改造过的立即执行无返回函数的节流函数,可用于高频布局请求节流
   * */
  public throttle: (func: Function, wait?: number) => void

  /**
   * 外部调用进行布局的入口，子类需要进行实现
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
    if (!dragItem) return
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

import {LayoutManagerImpl} from "@/algorithm";
import {CustomItemPos} from "@/types";

/**
 * 布局算法接口，实现真正的算法逻辑
 * */
export abstract class Layout {
  constructor(manager: LayoutManagerImpl) {
    this.manager = manager
    let old = 0;
    this.throttle = (func, wait) => {
      let now = new Date().valueOf();
      if (now - old > (wait || this.wait)) {
        func.apply(this, arguments);
        old = now;
      }
    }
  }

  /**
   * 布局名称
   * */
  protected name: string = ''

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
   * */
  public abstract layout(...args: any[]): any

  /**
   * 保存移动路径的长度
   * */
  protected pathLen = 2

  /**
   * 保存移动路径的数组
   * */
  protected pathPassed = []

  /**
   * 添加到移动路径记录中,队列尾为索引0
   * */
  protected _addHistory(pos) {
    if (this.pathPassed.length >= this.pathLen) this.pathPassed.pop()
    this.pathPassed.unshift({...pos})
  }

  /** 查看记录看该位置经过的倒数几个路径位置是否之前有被经过 */
  public hasPassed(pos: CustomItemPos) {
    return !!this.pathPassed.find((pathPos) => pathPos.x === pos.x && pathPos.y === pos.y)
  }
}

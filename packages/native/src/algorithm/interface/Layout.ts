import {LayoutManagerImpl} from "@/algorithm";

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

  /**
   * 节流时间
   * */
  protected wait?: number = 200

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
}

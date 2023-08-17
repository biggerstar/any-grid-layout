import {LayoutManagerImpl} from "@/algorithm";

/** 布局算法接口，实现真正的算法逻辑 */
export abstract class Layout {
  constructor(manager: LayoutManagerImpl) {
    this.manager = manager
  }

  /**
   * 布局名称
   * */
  protected name: string = ''

  /**
   * 管理器实例化布局算法的时候传入的管理器实例
   * */
  protected manager: LayoutManagerImpl

  /**
   * 外部调用进行布局的入口，子类需要进行实现
   * */
  public abstract layout(...args: any[]): any
}

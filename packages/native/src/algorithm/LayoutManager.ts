import {LayoutManagerImpl} from "@/algorithm/interface";
import {DefaultLayout} from "@/algorithm/layout-method";
import {Layout} from "@/algorithm/interface/Layout";
import {Container, ContainerGeneralImpl} from "@/main";
import {ExchangeLayout, StaticLayout, StreamLayout} from "@/algorithm";

/**
 * 布局算法名称和`实现类`的映射
 * */
const ALL_LAYOUT_METHOD = {
  default: DefaultLayout,
  stream: StreamLayout,
  exchange: ExchangeLayout,
  static: StaticLayout,
}

//--------------------------------------------------------------------------------//

/**
 * 布局算法管理器
 * */
export class LayoutManager extends LayoutManagerImpl {
  /**
   * 所有当前使用的布局算法名和其`实例`的映射
   * */
  public method: Record<ContainerGeneralImpl['layoutMode'], Layout> = <any>{}
  public container: Container

  constructor(container: Container) {
    super();
    this.container = container
    for (const name in ALL_LAYOUT_METHOD) {
      this.method[name] = new ALL_LAYOUT_METHOD[name](this)
    }
  }

  /**
   * 算法执行入口，会自动分发并执行当前指定的算法
   * */
  layout(...args: any[]): void {
    // TODO 未找到指定算法自动降级到默认算法
    const layoutMode = this.container.getConfig('layoutMode')
    const layoutIns = this.method[layoutMode]
    if (!layoutIns) {
      return this.container.eventManager._error_(
        'NoFoundLayoutMethod',
        '未找到布局算法，请检查您指定的`算法名称`是否正确',
        this
      )
    }
    layoutIns.layout?.(...args)
    const engine = this.container.engine
    engine.items.forEach((item) => item.updateItemLayout())

  }
}


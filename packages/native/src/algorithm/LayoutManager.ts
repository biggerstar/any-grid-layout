import {LayoutManagerImpl} from "@/algorithm/interface";
import {DefaultLayout} from "@/algorithm/layout-method";
import {Layout} from "@/algorithm/interface/Layout";
import {Container, ContainerGeneralImpl} from "@/main";
import {ExchangeLayout, StaticLayout, StreamLayout} from "@/algorithm";
import {LayoutOptions} from "@/types";

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
  layout(options: LayoutOptions): void {
    // TODO 未找到指定算法自动降级到默认算法
    const layoutMode = this.container.getConfig('layoutMode')
    let layoutIns = this.method[layoutMode]
    if (!layoutIns) {
      layoutIns = this.method['default']
      this.container.eventManager._warn_(
        'NoFoundLayoutMethod',
        `未找到名为${layoutMode}的布局算法
             为保证可用性，已自动转为「default」算法`,
        this
      )
    }
    const engine = this.container.engine
    layoutIns.options = options
    layoutIns.items = engine.items
    layoutIns.layout?.(engine.items, options)
    engine.items.forEach((item) => item.updateItemLayout())
  }
}


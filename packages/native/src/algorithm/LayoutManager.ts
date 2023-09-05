import {LayoutManagerImpl} from "@/algorithm/interface";
import {DefaultLayout, StaticLayout} from "@/algorithm/interactive-layout-method";
import {Layout} from "@/algorithm/interface/Layout";
import {Container} from "@/main";
import {ExchangeLayout, SameSizeStaticLayout, StreamLayout} from "@/algorithm";

/**
 * 布局算法名称和`实现类`的映射
 * */
const ALL_INTERACTIVE_LAYOUT_METHOD = {
  default: DefaultLayout,
  stream: StreamLayout,
  exchange: ExchangeLayout,
  sameSizeStatic: SameSizeStaticLayout,
  static: StaticLayout,
}

//--------------------------------------------------------------------------------//
type LayoutMethodType = keyof typeof ALL_INTERACTIVE_LAYOUT_METHOD

/**
 * 布局算法管理器
 * */
export class LayoutManager extends LayoutManagerImpl {
  /**
   * 所有当前使用的布局算法名和其`实例`的映射
   * */
  public method: Record<LayoutMethodType, Layout> = <any>{}
  /**
   * 使用的默认布局名称
   * */
  public defaultMethod: LayoutMethodType = 'default'
  public container: Container

  constructor(container: Container) {
    super();
    this.container = container
    for (const name in ALL_INTERACTIVE_LAYOUT_METHOD) {
      this.method[name] = new ALL_INTERACTIVE_LAYOUT_METHOD[name](this)
    }
  }

  public getLayoutIns(method: LayoutMethodType) {
    if (!method) method = this.defaultMethod
    return this.method[method]
  }

  public init(method: LayoutMethodType) {
    let layoutIns = this.getLayoutIns(<any>method)
    const res = layoutIns.init()
    if (!res) return
    const engine = this.container.engine
    if (res) {
      engine.items = layoutIns.layoutItems
      layoutIns.layoutItems.forEach(item => item.mount())
      layoutIns.patchStyle()
    }
    if (!res.isSuccess) {
      this.container.eventManager._error_(
        'ContainerOverflowError',
        "容器溢出或者Item重叠，只有item明确指定了x,y或者容器col,row情况下会出现此错误"
        , res
      )
    }
  }

  /**
   * 算法执行入口，会自动分发并执行当前指定的算法
   * @return {Boolean} 本次是否执行布局成功
   * */
  async layout(method?: LayoutMethodType): Promise<boolean> {
    let layoutIns = this.getLayoutIns(<any>method)
    if (!layoutIns) {
      layoutIns = this.method[method]
      this.container.eventManager._warn_(
        'NoFoundLayoutMethod',
        `未找到名为${method}的布局算法
             为保证可用性，已自动转为「default」算法`,
        this
      )
    }
    const engine = this.container.engine
    layoutIns.layoutItems = Array.from(engine.items)
    const res = await layoutIns.layout(engine.items)
    if (res) {
      layoutIns.patchStyle()
      engine.items = layoutIns.layoutItems
    }
    return res
  }
}


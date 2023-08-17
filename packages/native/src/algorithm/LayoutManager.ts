import {LayoutManagerImpl} from "@/algorithm/interface";
import {StreamLayout} from "@/algorithm/layout-method";
import {Layout} from "@/algorithm/interface/Layout";
import {Container, ContainerGeneralImpl, Engine} from "@/main";


const ALL_LAYOUT_METHOD = {
  stream: StreamLayout
}

/**
 * 布局算法管理
 * */
export class LayoutManager extends LayoutManagerImpl {
  public method: Record<ContainerGeneralImpl['responseMode'], Layout> = <any>{}
  public container: Container

  // 'default' | 'exchange' | 'stream'
  constructor(container: Container) {
    super();
    this.container = container
    for (const name in ALL_LAYOUT_METHOD) {
      console.log(name)
      this.method[name] = new ALL_LAYOUT_METHOD[name](this)
    }
  }

  layout(...args: any[]): void {
    // TODO 未找到指定算法自动降级到默认算法
    const layoutMode = this.container.getConfig('responseMode')
    const layoutIns = this.method[layoutMode]
    if (!layoutIns){
      this.container.eventManager._error_(
        'NoFoundLayoutMethod',
        '未找到布局算法，请检查您指定的算法是否正确',
        this
      )
    }
    layoutIns.layout(...args)
  }
}


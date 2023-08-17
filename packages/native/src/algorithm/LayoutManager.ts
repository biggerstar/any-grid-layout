import {LayoutManagerImpl} from "@/algorithm/interface";
import {StreamLayout} from "@/algorithm/layout-method";
import {Layout} from "@/algorithm/interface/Layout";

/**
 * 布局算法管理
 * */
export class LayoutManager extends LayoutManagerImpl {
  public method: Layout = {}

  // 'default' | 'exchange' | 'stream'
  constructor() {
    super();
    this.method = new StreamLayout(this)

  }

  layout(...args:any[]): void {
    this.method.layout(...args)
    console.log(111111111111111111)
  }


}


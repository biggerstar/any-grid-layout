import {Container, Item} from "src/main";
// @copy-start
declare global {
  interface Window {
    AnyGridLayout: any  // TODO 完善导出名称
  }

  interface Element {
    _isGridItem_: boolean
    _gridItem_: Item
    _isGridContainer_: boolean
    _gridContainer_: Container
  }
  export {}
}

import {Container, Item} from "src/main";
// @copy-start
declare global {
  interface Window {
    AnyGridLayout: any  // TODO 完善导出名称
  }

  interface HTMLElement {
    _isGridItem_: boolean
    _gridItem_: Item | null
    _isGridContainer_: boolean
    _gridContainer_: Container | null
  }
}

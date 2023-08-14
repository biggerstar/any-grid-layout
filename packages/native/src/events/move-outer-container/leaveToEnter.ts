import {Container, Item} from "@/main";
import {tempStore} from "@/store";

export function leaveToEnter(fromContainer: Container, toContainer: Container) {
  if (!fromContainer || !toContainer) return
  let fromItem: Item = tempStore.fromItem
  let moveItem: Item = tempStore.moveItem
  let dragItem: Item = tempStore.moveItem ? moveItem : fromItem
  // console.log(fromContainer,toContainer,dragItem);
  //------------下方代码固定顺序-------------//
  this.mouseleave(null, fromContainer)
  // console.log(dragItem.container,toContainer)

  if (dragItem.container === toContainer) {
    tempStore.fromContainer = toContainer
    return
  }

  if (toContainer.isNesting) {   //  修复快速短距重复拖放情况下概率识别成父容器移动到子容器当Item的情况
    if (toContainer.parentItem === dragItem
      || toContainer.parentItem.element === dragItem.element) {
      return
    }
  }
  toContainer.__ownTemp__.nestingEnterBlankUnLock = true
  this.mouseenter(null, toContainer)
  //  如果现在点击嵌套容器空白部分选择的Item会是父容器的Item,按照mouseenter逻辑对应不可能删除当前Item(和前面一样是fromItem)在插入
  //  接上:因为这样是会直接附加在父级Container最后面，这倒不如什么都不做直接等待后面逻辑执行换位功能
}

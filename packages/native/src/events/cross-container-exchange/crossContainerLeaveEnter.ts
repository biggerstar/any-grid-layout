import {Container, Item} from "@/main";
import {crossContainer_mouseenter, crossContainer_mouseleave, tempStore} from "@/events";

/**用于嵌套情况两个【相邻】Container的直接过渡
 * @param {Container}  fromContainer   从那个Container中来
 * @param {Container}  toContainer      到哪个Container中去
 * 在嵌套容器中假设父容器为A，被嵌套容器为B,  如果A到 B 则fromContainer为A，toContainer为B,此时dragItem属于A，
 * 如果A到 B 此时鼠标不抬起继续从B返回A 则fromContainer为 B，toContainer为A，此时dragItem还是属于A,通过dragItem的归属能确定跨容器时候是否鼠标被抬起
 * */
export function crossContainerLeaveEnter(fromContainer: Container, toContainer: Container) {
  const {moveItem, fromItem} = tempStore
  if (!fromContainer || !toContainer) return
  let dragItem: Item | null = moveItem || fromItem
  if (!dragItem) return
  // console.log(fromContainer,toContainer,dragItem);
  //------------下方代码固定顺序-------------//
  crossContainer_mouseleave(null, fromContainer)
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
  crossContainer_mouseenter(null, toContainer)
  //  如果现在点击嵌套容器空白部分选择的Item会是父容器的Item,按照mouseenter逻辑对应不可能删除当前Item(和前面一样是fromItem)在插入
  //  接上:因为这样是会直接附加在父级Container最后面，这倒不如什么都不做直接等待后面逻辑执行换位功能
}

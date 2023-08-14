import {Container} from "@/main";
import {mousemoveFromClone} from "@/events/item-drag/mousemoveFromClone";
import {mousemoveFromItemChange} from "@/events/item-drag/mousemoveFromItemChange";
import {mousemoveExchange} from "@/events/item-drag/mousemoveExchange";

export const index = {
  /** 跨容器Item成员交换
   * @param {Container} container
   * @param {Function} itemPositionMethod(newItem)  执行该函数的前提是Item已经转移到当前鼠标对应的Container中，
   *                                                  itemPositionMethod函数接受一个参数newItem,
   *                                                  之后在该回调函数中可以决定该移动的Item在Items中的排序(响应式模式下)
   *                                                  静态模式下只要定义了pos后任何顺序都是不影响位置的。所以该函数主要针对响应式
   * */
  mousemoveExchange,
  mousemoveFromItemChange,
  mousemoveFromClone
}

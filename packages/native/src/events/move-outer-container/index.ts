import {Container} from "@/main";
import {leaveToEnter} from "@/events/move-outer-container/leaveToEnter";
import {mouseenter} from "@/events/move-outer-container/mouseenter";
import {mouseleave} from "@/events/move-outer-container/mouseleave";


export const moveOuterContainerEvent = {
  //  用于跨容器Item通信，转移的各种处理
  /**用于嵌套情况两个【相邻】Container的直接过渡
   * @param {Container}  fromContainer   从那个Container中来
   * @param {Container}  toContainer      到哪个Container中去
   * 在嵌套容器中假设父容器为A，被嵌套容器为B,  如果A到 B 则fromContainer为A，toContainer为B,此时dragItem属于A，
   * 如果A到 B 此时鼠标不抬起继续从B返回A 则fromContainer为 B，toContainer为A，此时dragItem还是属于A,通过dragItem的归属能确定跨容器时候是否鼠标被抬起
   * */
  leaveToEnter,
  mouseenter,
  mouseleave
}

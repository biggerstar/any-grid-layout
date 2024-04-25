import {CustomItemPos} from "@/types";
import {Container} from "@/main";

/**
 * 包含默认配置信息，用户配置找不到则会找该类的默认配置
 * */
export class ItemGeneralImpl implements Record<any, any> {
  // /**
  //  * id元素选择器，如果传入该id，框架内部会将该id添加到item的内容区域dom元素上，用户可以使用id查找到对应元素并进行操作
  //  * */
  // id?: string | null = null
  /**
   * item 要所属的容器
   * */
  container: Container
  /**
   * 类似 Vue 的 diff ,
   * 这是识别 Item 的唯一 key 名称，
   * 在setState时， 如果 key 相同则 dom 存在， 如果对比 key 不一样或者不存在， 则 DOM中 的item元素将会被移除
   *  */
  key: string = ''
  // /**
  //  * 可以传入class或者element元素，如果有目标元素会自动载入到到item中
  //  *  */
  // el: HTMLElement | string = null

  /**
   *  pos位置对象
   * */
  pos: CustomItemPos = null
}

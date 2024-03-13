import {CustomItemPos} from "@/types";
import {grid_item_class_name} from "@/constant";


/**
 * 包含默认配置信息，用户配置找不到则会找该类的默认配置
 * */
export class ItemGeneralImpl {
  /**
   * id元素选择器，如果传入该id，框架内部会将该id添加到item的内容区域dom元素上，用户可以使用id查找到对应元素并进行操作
   * */
  id?:string
  /**
   * 可以传入class或者element元素，如果有目标元素会自动载入到到item中
   *  */
  el?: HTMLElement | string

  /**
   * 给item命名
   * 命名后可以直接通过 `container.find(name)` 找到对应的Item
   * */
  name?: string = ''

  /**
   * Item在文档中默认的类名,可以由外部传入重新自定义
   *
   * @default grid-item
   * */
  className?: string = grid_item_class_name

  //----------被_define函数通过 defineProperties代理的字段-------------//

  // /**
  //  * 该item是否是静态布局，如果为true，则该item将会固定在外部指定的某行某列中
  //  * 优先级比autoOnce高，但是只有pos中指定x和y才生效
  //  *
  //  * @default false
  //  * */
  // static?: boolean = false

  /**
   * 该Item是否可以参与跨容器交换，和container的exchange不同的是该参数只控制Item自身，并且在要前往的container如果关闭了exchange则同时不会进行交换
   *
   * @default false
   * */
  exchange?: boolean = false

  /**
   *  pos位置对象
   * */
  pos: CustomItemPos
}

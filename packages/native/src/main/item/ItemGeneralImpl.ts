import {CustomItemPos} from "@/types";
import {grid_item_class_name} from "@/constant";

/**
 * 包含默认配置信息，用户配置找不到则会找该类的默认配置
 * */
export class ItemGeneralImpl {
  /**
   * id元素选择器，如果传入该id，框架内部会将该id添加到item的内容区域dom元素上，用户可以使用id查找到对应元素并进行操作
   * */
  id?: string

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

  /**
   *  pos位置对象
   * */
  pos: CustomItemPos
}

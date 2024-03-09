import {CustomItemPos, ItemTransition} from "@/types";
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

  /**
   *【不允许】 点击该范围内的元素拖动Item,数组内的值为css选择器或者目标子元素(Element)
   * */
  dragIgnoreEls?: Array<HTMLElement | string> = []

  /**
   *【只允许】 点击该范围内的元素拖动Item,数组内的值为css选择器或者目标子元素(Element)
   * */
  dragAllowEls?: Array<HTMLElement | string> = []
  //----------被_define函数通过 defineProperties代理的字段-------------//

  /**
   * time:动画过渡时长 ms, field: 要过渡的css字段
   * 可通过Container.animation函数修改全部Item,通过Item.animation函数修改单个Item
   * @default {
   *              time: 180,
   *              field: 'top,left,width,height'
   *           }
   *  */
  transition?: ItemTransition = {
    time: 120,
    field: 'top,left,width,height'
  }

  /**
   * item自身是否可以拖动
   *
   * @default false
   * */
  draggable?: boolean = false

  /**
   * 自身是否可以调整大小
   *
   * @default false
   * */
  resize?: boolean = false

  /**
   * 是否有关闭按钮，建议开发者自己实现按钮或者更改按钮样式
   *
   * @default false
   * */
  close?: boolean = false

  /**
   * 该item是否是静态布局，如果为true，则该item将会固定在外部指定的某行某列中
   * 优先级比autoOnce高，但是只有pos中指定x和y才生效
   *
   * @default false
   * */
  static?: boolean = false

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

import {CustomItem, CustomLayoutOptions} from "@/types";
import {ContainerBaseEvent} from "@/plugins-src/event-types/base/ContainerBaseEvent";

/**
 * 所有的内置错误事件
 * */
type ErrorFromTypeMap = {
  /**
   * 传入的键值 key 重复
   * */
  ItemKeysRepeated: CustomItem[],
  /**
   * Item 成员溢出容器, 当前存在 item 的静态位置 pos.x + pos.w 的值大于容器的 col
   * */
  ItemOverflow: CustomItem[],
  /**
   * 传入的 Items 中存在位置重叠.
   * */
  ItemsPositionsOverlap: CustomItem[],
  /**
   * Item 的 pos.w 尺寸超过容器的 col 尺寸.
   * */
  ItemSizeExceedsContainerSize: CustomItem[],
  /**
   * 缺失计算容器尺寸参数， 例如必须包含 items 和 containerWidth 和 (gapX | itemWidth) 和 (gapY | itemHeight)
   * */
  ComputedContainerParameters: void,
}

export class OnError extends ContainerBaseEvent {
  /**
   * 错误类型
   * */
  public readonly type: keyof ErrorFromTypeMap
  /**
   * 错误信息
   * */
  public readonly message: string = ''
  /**
   * 错误来源
   * */
  public readonly from: any = null
  /**
   * 本次布局失败使用的计算后的最终用户配置( 非 state 完整配置 )
   * */
  public readonly declare errorState: CustomLayoutOptions

}

import {BaseEvent} from "@/plugins";
import {ContainerInstantiationOptions} from "@/types";

export class InitOptionsEvent extends BaseEvent {
  /**
   * 实例化传入的配置，可以被事件拦截修改，支持插件自定义配置或者修改字段
   * 外部创建插件时也可以通过 createXXX(插件自有配置) 创建
   * */
  public readonly options: ContainerInstantiationOptions
}

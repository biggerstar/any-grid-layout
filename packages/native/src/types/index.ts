import {LayoutInstantiationField} from "@/main/container/LayoutInstantiationField";

export type LayoutDataItem = {
  pos?: {
    w?: number,
    h?: number,
    x?: number,
    y?: number,
    maxW?: number,
    minW?: number
  },
  static?: boolean
}

export type ContainerOptions = {
  [key: string]: any
  el: string | HTMLElement,
  platform?: 'native' | 'vue'
  layouts?: Partial<LayoutInstantiationField> | Array<Partial<LayoutInstantiationField>>,
  events?: Record<string, Function>,
  global?: Record<any, any>
  itemLimit?: Record<any, any>
}

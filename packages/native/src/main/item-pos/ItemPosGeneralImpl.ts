export class ItemPosGeneralImpl {
  [key: string]: any

  public w: number = 1
  public h: number = 1
  public x?: number = null
  public y?: number = null
  public minW?: number = 1          // 栅格倍数
  public maxW?: number = Infinity   // 栅格倍数
  public minH?: number = 1          // 栅格倍数
  public maxH?: number = Infinity   // 栅格倍数
}

import {tempStore} from "@/events";

/**
 * 做拖动结束的后续清理工作
 * */
export function endWork_mouseup(_) {
  const {
    fromItem,
    fromContainer,
  } = tempStore

  //  清除Item限制操作的遮罩层
  const maskList = document.querySelectorAll('.grid-item-mask')
  for (let i = 0; i < maskList.length; i++) {
    const maskEl = maskList[i]
    maskEl.parentElement.removeChild(maskEl)
  }


  //-------------------------------重置相关缓存-------------------------------//
  const resetKeys = [
    'fromContainer',
    'dragContainer',
    'cloneElement',
    'fromItem',
    'toItem',
    'moveItem',
    'offsetPageX',
    'offsetPageY',
    'isLeftMousedown',
    'handleMethod',
    'mousedownEvent',
    'mousedownItemOffsetLeft',
    'mousedownItemOffsetTop',
  ] as (NonNullable<keyof typeof tempStore>)[]
  resetKeys.forEach((key) => delete tempStore[key])
}

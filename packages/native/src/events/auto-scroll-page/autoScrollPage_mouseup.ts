import {Container} from "@/main";
import {tempStore} from "@/events";

export function autoScrollPage_mouseup(ev) {
  const {isLeftMousedown, isScrollPage, fromContainer, slidePageOffsetInfo} = tempStore
  if (!isLeftMousedown || !fromContainer || !isScrollPage) return
  const container: Container = fromContainer
  if (!container || !container.getConfig('autoScrollPage')) return
  const sPFI = slidePageOffsetInfo
  const offsetLeft = sPFI.newestPageX - ev.pageX
  const offsetTop = sPFI.newestPageY - ev.pageY
  // 实现container在鼠标释放之后惯性滑动
  let timeCont = 500
  if (offsetTop >= 20 || offsetLeft >= 20) {
    let timer: any = setInterval(() => {
      timeCont -= 20
      container.element.scrollTop += parseInt((((offsetTop / 100 * timeCont) / 30) || 0).toString())
      container.element.scrollLeft += parseInt((((offsetLeft / 100 * timeCont) / 30) || 0).toString())
      if (timeCont <= 0 || isLeftMousedown) {
        clearInterval(timer)
        timer = null
      }
    }, 20)
  }
}

import {parseContainer} from "@/utils";

export function nativeEventEmit_click(ev: any) {
  const clickContainer = parseContainer(ev)   // 必要，表明Item来源
  if (clickContainer) {
    clickContainer.bus.emit("click", {
      inputEvent: ev,
    })
  }
}

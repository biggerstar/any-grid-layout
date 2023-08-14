import {throttle} from "@/utils";
import {tempStore} from "@/store";

export const updateSlidePageInfo: Function = throttle((pageX, pageY) => {
  tempStore.slidePageOffsetInfo.newestPageX = pageX
  tempStore.slidePageOffsetInfo.newestPageY = pageY
})

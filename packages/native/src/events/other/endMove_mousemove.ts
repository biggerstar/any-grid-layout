import {throttle} from "@/utils";
import {tempStore} from "@/events";

export const endMove_mousemove: Function = throttle(() => {
  const {fromContainer} = tempStore
  if (!fromContainer) return
  fromContainer.engine.updateLayout()
}, 12)

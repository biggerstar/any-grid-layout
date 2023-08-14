import {touchendOrMouseup} from "@/events/container/touchendOrMouseup";
import {touchmoveOrMousemove} from "@/events/container/touchmoveOrMousemove";
import {touchstartOrMousedown} from "@/events/container/touchstartOrMousedown";
import {mouseup} from "@/events/container/mouseup";
import {mousedown} from "@/events/container/mousedown";
import {mousemove} from "@/events/container/mousemove";

export const containerEvent = {
  mousedown,
  mousemove,
  mouseup,
  //-------------------------------------------------------------------------------------------
  touchstartOrMousedown,
  touchmoveOrMousemove,
  touchendOrMouseup
}

// noinspection JSUnusedGlobalSymbols

import {definePlugin} from "@/global";
import {ContainerSizeChangeEvent, GridClickEvent} from "@/plugins";
import {updateContainerSize} from "@/plugins/common";

export const OtherEventBehavior = definePlugin({
  click(_: GridClickEvent) {
  },
  colChanged(ev: ContainerSizeChangeEvent) {
    updateContainerSize(ev.container)
  },
  rowChanged(ev: ContainerSizeChangeEvent) {
    updateContainerSize(ev.container)
  }
})

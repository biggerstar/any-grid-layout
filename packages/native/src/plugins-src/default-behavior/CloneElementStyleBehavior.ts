// noinspection JSUnusedGlobalSymbols

import {definePlugin} from "@/global";
import {CloneElementStyleEvent} from "@/plugins-src";

export const CloneElementStyleBehavior = definePlugin({
  updateCloneElementStyle(ev: CloneElementStyleEvent) {
    ev.autoCreateCloneElement()
    ev.updateLocation()
  },
})

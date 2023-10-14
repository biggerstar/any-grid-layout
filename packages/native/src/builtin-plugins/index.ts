// noinspection JSUnusedGlobalSymbols

import {ResponsiveLayoutPlugin} from "@/builtin-plugins/ResponsiveLayoutPlugin";
import {StreamLayoutPlugin} from "@/builtin-plugins/StreamLayoutPlugin";
import {GridPlugin} from "@/types";


export function createResponsiveLayoutPlugin(): GridPlugin {
  return ResponsiveLayoutPlugin
}

export function createStreamLayoutPlugin(): GridPlugin {
  return StreamLayoutPlugin
}

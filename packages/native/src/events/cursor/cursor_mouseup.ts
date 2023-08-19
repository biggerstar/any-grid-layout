import {cursor} from "@/events";
import {Container} from "@/main";
import {parseContainer} from "@/utils";

export function cursor_mouseup(ev) {
  const container: Container | null = parseContainer(ev)
  if (container && cursor.cursor !== 'in-container') cursor.inContainer()
}

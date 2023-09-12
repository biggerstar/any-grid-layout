import {cursor} from "@/events";
import {Container} from "@/main";
import {parseContainer} from "@/utils";
import {cursor_type_in_container} from "@/constant";

export function cursor_mouseup(ev) {
  const container: Container | null = parseContainer(ev)
  if (container && cursor.cursor !== cursor_type_in_container) cursor.inContainer()
}

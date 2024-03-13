import {
  definePlugin,
  GridPlugin,
  parseItemFromPrototypeChain
} from "@biggerstar/layout";

const grid_item_close_btn = 'grid-item-close-btn'
export default function createResizeBtnPlugin(): GridPlugin {
  return definePlugin({
    name: 'CloseBtnPlugin',
    containerMounted(ev) {
      ev.container.element.addEventListener("mousedown", (e) => {
        const downTarget: HTMLElement = <HTMLElement>e.target
        if (downTarget.classList.contains(grid_item_close_btn)) {
          ev.container.element.addEventListener("mouseup", () => {
            const upTarget: HTMLElement = <HTMLElement>e.target
            if (downTarget === upTarget) {
              const item = parseItemFromPrototypeChain(downTarget)
              if (item) {
                console.log(item)
                item.unmount()
              }
            }
          })
        }
      })
    },
    itemMounted(ev) {
      const isOpenResize = ev.item.customOptions.resize
      const grid_item_resize_text = "\u22BF";
      const grid_item_resizable_handle = 'grid-item-resizable-handle'
      if (isOpenResize) {
        const handleResizeEls = ev.item.element.querySelectorAll('.' + grid_item_resizable_handle)
        if (handleResizeEls.length > 0) return;
        const resizeTabEl = document.createElement('span')
        resizeTabEl.innerHTML = grid_item_resize_text
        ev.item.element.appendChild(resizeTabEl)
        resizeTabEl.classList.add(grid_item_resizable_handle)
      }
    },
  })
}


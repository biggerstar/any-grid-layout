import {definePlugin, GridPlugin, parseItemFromPrototypeChain} from "@biggerstar/layout";

const grid_item_close_btn = 'grid-item-close-btn'
export default function createCloseBtnPlugin(): GridPlugin {
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
      const isOpenClose = ev.item.customOptions.close
      if (isOpenClose) {
        const _closeEl = document.createElement('div')
        _closeEl.classList.add(grid_item_close_btn)
        _closeEl.innerHTML = `×`
        ev.item.element.appendChild(_closeEl)
      }
    },
  })
}


import {definePlugin, grid_item_close_btn, grid_item_close_text} from "@biggerstar/layout";


export default function createCloseBtnPlugin() {
  return definePlugin({
    name: 'CloseBtnPlugin',
    itemMounted(ev) {
      const isOpenClose = ev.item.customOptions.close
      if (isOpenClose) {
        const _closeEl = document.createElement('div')
        _closeEl.classList.add(grid_item_close_btn)
        _closeEl.innerHTML =  `×`
        ev.item.element.appendChild(_closeEl)
      }
    },
  })
}


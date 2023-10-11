import {Container} from "@biggerstar/layout";

export const createContainerControl = (container: Container) => {
  return {
    close: {
      type: 'switch',
      active: true,
      text: '关闭按钮',
      handler: (status: boolean) => container.items.forEach(item => item.close = status)
    },
    resize: {
      type: 'switch',
      text: '调整按钮',
      active: true,
      handler: (status: boolean) => container.items.forEach(item => item.resize = status)
    },
    draggable: {
      type: 'switch',
      text: '允许拖动',
      active: true,
      handler: (status: boolean) => container.items.forEach(item => item.draggable = status)
    },
    transition: {
      type: 'switch',
      text: '开启动画',
      active: true,
      handler: (status: boolean) => container.items.forEach(item => item.transition = status)
    },
    autoGrowX: {
      type: 'switch',
      text: '横向容器拓展',
      active: true,
      handler: (status: boolean) => {
        container.layout.autoGrow.horizontal = status
      }
    },
    autoGrowY: {
      type: 'switch',
      text: '纵向容器拓展',
      active: true,
      handler: (status: boolean) => {
        container.layout.autoGrow.vertical = status
      }
    },
    sizeWidth: {
      type: 'input-number',
      text: '宽度',
      value: 80,
      handler: (value: number) => {
        container.layout.sizeWidth = value
        container.updateLayout()
      }
    },
    sizeHeight: {
      type: 'input-number',
      text: '高度',
      value: 50,
      handler: (value: number) => {
        container.layout.sizeHeight = value
        container.updateLayout()
      }
    },
    marginX: {
      type: 'input-number',
      text: '横向间距',
      value: 5,
      handler: (value: number) => {
        container.layout.marginX = value
        container.updateLayout()
      }
    },
    marginY: {
      type: 'input-number',
      text: '纵向间距',
      value: 5,
      handler: (value: number) => {
        container.layout.marginY = value
        container.updateLayout()
      }
    },
    addItem: {
      type: 'button',
      text: '',
      value: '添加一个Item',
      handler: (ev: number) => {
        console.log(ev)
        const item = container.addItem({
          pos: {
            w: 1,
            h: 1
          },
          draggable: true,
          resize: true,
          close: true,
          exchange: true
        }, {findBlank: true})
        if (item) {
          item.mount()
          container.updateLayout()
        }
      }
    },
  }
}


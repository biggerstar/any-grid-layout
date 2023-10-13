import type {DefaultTheme} from "vitepress";

export default <DefaultTheme.SidebarItem[]>[
  {
    text: '让我们开始吧',
    collapsed: false,
    items: [
      {
        text: '安装',
        link: '/guide/installation'
      },
      {
        text: '开始',
        link: '/guide/usage'
      },
    ]
  },
  {
    text: '配置',
    collapsed: false,
    items: [
      {
        text: 'Container',
        link: '/guide/container'
      },
      {
        text: 'Item',
        link: '/guide/item'
      },
      {
        text: 'Layouts',
        link: '/guide/layouts'
      },
      {
        text: 'Plugins',
        link: '/guide/plugins'
      },
    ]
  },
  {
    text: '样式',
    collapsed: false,
    items: [
      {
        text: 'Css Style',
        link: '/guide/style'
      },
    ]
  },
  {
    text: '物料',
    collapsed: false,
    items: [
      {
        text: '快速获得配置',
        link: '/guide/material.md'
      },
    ]
  }
]

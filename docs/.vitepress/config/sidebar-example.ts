import type {DefaultTheme} from "vitepress";

export default <DefaultTheme.SidebarItem[]>[
  {
    text: '在线演示',
    collapsed: false,
    items: [
      {
        text: '默认布局演示',
        link: '/example/basic'
      },
    ]
  },
  {
    text: '插件',
    collapsed: false,
    items: [
      {
        text: '响应式布局插件',
        link: '/example/responsive'
      },
    ]
  },
]

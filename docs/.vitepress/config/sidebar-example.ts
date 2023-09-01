import type {DefaultTheme} from "vitepress";

export default <DefaultTheme.SidebarItem[]>[
  {
    text: '在线演示',
    collapsed: false,
    items: [
      {
        text: '基本',
        link: '/example/basic'
      },
    ]
  },
]

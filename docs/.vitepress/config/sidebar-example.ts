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
      {
        text: '动态尺寸',
        link: '/example/automatic'
      },
      {
        text: '跨容器交换',
        link: '/example/crossContainer'
      },
      {
        text: '容器嵌套',
        link: '/example/containerNesting'
      },
      {
        text: '自定义布局算法',
        link: '/example/customLayoutAlgo'
      },
      {
        text: '动画',
        link: '/example/animation'
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
      {
        text: '流式布局插件',
        link: '/example/stream'
      },
    ]
  },
]

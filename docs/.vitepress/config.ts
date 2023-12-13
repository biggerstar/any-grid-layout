import {defineConfig} from 'vitepress'
import sidebarGuide from './config/sidebar-guide'
import sidebarExample from './config/sidebar-example'
import nav from './config/nav'
import viteConfig from './config/vite'

export default defineConfig({
  base: '/any-grid-layout/',
  title: 'Any-Grid-Layout',
  titleTemplate: '多功能栅格布局',
  description: '多功能栅格布局',
  head: [],
  themeConfig: {
    logo: '/logo.webp',
    outline: 'deep',
    socialLinks: [
      {icon: 'github', link: 'https://github.com/biggerstar/any-grid-layout'},
    ],
    nav: nav,
    sidebar: {
      '/guide': sidebarGuide,
      '/example': sidebarExample,
    },
    lastUpdated: {
      text: '更新于',
      formatOptions: {
        // dateStyle: 'full',
        // timeStyle: 'medium'
      }
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  },
  vite: viteConfig
})

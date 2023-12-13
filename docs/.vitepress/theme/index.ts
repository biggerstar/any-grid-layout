import DefaultTheme from 'vitepress/theme'
import {Theme} from 'vitepress'
import AllComp from '../components'
import './css/grid-layout.css'
import './css/reset.css'
import './css/custom-any-grid-style.css'
import '@arco-design/web-vue/dist/arco.css'
import '@biggerstar/layout/dist/default-style.css'


export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    for (const name in AllComp) {
      ctx.app.component(name, AllComp[name])
    }
  }
} as Theme

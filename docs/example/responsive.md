# 响应式插件

响应式插件会让Item往主轴方向进行紧凑排列

### 代码

```javascript
import {Container, createResponsiveLayoutPlugin, fillItemLayoutList} from "@biggerstar/layout";

let container: Container = new Container({
  el: '#basic-container',
  layouts: {
    autoGrow: {
      vertical: true,
      horizontal: false,
    },
    // direction: 'row',
    // align: 'start',
    items: fillItemLayoutList(layoutData, {
      draggable: true,
      resize: true,
      close: true,
    }),
    margin: [5, 5],
    size: [80, 50],
  },
})
//  使用响应式布局插件
container.use(createResponsiveLayoutPlugin())


```

### 演示

<Responsive/>

## 流式布局插件

流式布局插件会根据items的顺序往主轴的方向进行紧凑排列，拖动的过程中是保持有序的

```javascript

import {Container, createStreamLayoutPlugin, fillItemLayoutList} from "@biggerstar/layout";

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
container.use(createStreamLayoutPlugin())

```


### 演示

<Stream/>

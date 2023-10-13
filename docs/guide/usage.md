## 定义您的第一个布局

### 初始数据

```javascript
export const layoutData: CustomItems = [
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1, minH: 1, maxW: 2, maxH: 4}},
  {pos: {w: 3, h: 3}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 2, h: 2}},
]

```

### 实例化并挂载

```html
<div id= "container"></div>
```

```javascript
import {Container,Item,fillItemLayoutList} from '@biggerstar/layout'
import '@biggerstar/layout/dist/default-style.css'  // 必须导入该css

const container = new Container({
  el: '#container',
  layouts: {
    items: layoutData,
    margin: [10, 10],
    size: [120, 80],
  },
})
container.mount()

```

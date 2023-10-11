
## 定义您的第一个布局

### 初始数据

```javascript
export const layoutData: CustomItems = [
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 2, x: 2, y: 1}, static: true, draggable: false},
  {pos: {w: 2, h: 1}},
  {pos: {w: 2, h: 1}},
  {pos: {w: 2, h: 2, x: 1, y: 2}, static: true, resize: false},
  {pos: {w: 2, h: 2}},
  {pos: {w: 2, h: 2}},
  {pos: {w: 2, h: 2}},
  {pos: {w: 2, h: 1}},
  {pos: {w: 2, h: 1}},
  {pos: {w: 2, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 1}},

  {pos: {w: 4, h: 3}},
  {pos: {w: 2, h: 3}},
  {pos: {w: 2, h: 3}},
  {pos: {w: 4, h: 3}},
  {pos: {w: 1, h: 3}},
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

```

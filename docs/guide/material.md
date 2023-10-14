# 快速获得布局测试数据

### 构造器

```ts
const container = new Container({
  el: '#container',
  // el: document.getElementById('container'),
  layouts: {
    autoGrow: {
      vertical: true,
      horizontal: false,
    },
    items: layoutData,
    ratioCol: 0.2,
    margin: [10, 10],
    size: [120, 80],
    minCol: 5,
    minRow: 5,
    exchange: true,
    // sizeWidth: 50,
    // sizeHeight: 80,
    // marginX: 30,
    // marginY: 50,
  },
  events:events,
  global: {
    exchange: true,
    ratioCol: 0.3,
  }
})
```

### 布局数据

```ts
export const layoutData: CustomItems = [
  {pos: {w: 1, h: 1}, resize: false},
  {pos: {w: 1, h: 1}},
  {pos: {w: 1, h: 2, x: 2, y: 1}},
  {pos: {w: 2, h: 1}},
  {pos: {w: 2, h: 2, x: 1, y: 2}},
  {pos: {w: 2, h: 2}},
  {pos: {w: 2, h: 2}, draggable: false},
  {pos: {w: 2, h: 2}, minH: 1, maxW: 2, maxH: 4},
  {pos: {w: 2, h: 1}},
  {pos: {w: 2, h: 1}, maxH: 2},
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

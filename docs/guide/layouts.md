# layouts

## 示例

```javascript
const container = new Container({
  el: '#container',
  layouts: {
    items: layoutData,
    margin: [10, 10],
    size: [120, 80],

    // 其他配置 ...
  },
})
```

### layouts

- type1: `CustomLayoutsOptions`
- type2: `CustomLayoutsOption | CustomLayoutsOption[]`
- required: `false`

  当前的布局配置，可以是一个配置对象或者配置对象数组

### layouts.items

- type1: `CustomItems`
- type2: `CustomItem[]`
- required: `false`
- default `[]`

  当前布局使用的数据, CustomItem配置详见 [Item](item.md)

### layouts.px

- type: `number`
- required: `false`

  使用多个layout预设布局方案请必须指定对应的像素px,单位为数字,
  假设px=1024表示Container宽度1024像素以下执行该布局方案

### layouts.autoGrow.vertical

- type: `boolean`
- required: `false`
- default `false`

  响应式下resize和drag是否自动撑开垂直方向的容器

### layouts.autoGrow.horizontal

- type: `boolean`
- required: `false`
- default `false`

  响应式下resize和drag是否自动撑开水平方向的容器

### layouts.col

- type: `number`
- required: `false`
- default `1`

  列数

### layouts.row

- type: `number`
- required: `false`
- default `1`

  行数, 响应模式下row由引擎管理且row不可固定，用户指定的row永远不会生效

### layouts.margin

- type: `MarginOrSizeDesc`
- required: `false`
- default `[null, null]`

  <br/>margin = [marginX, marginY]
  <br/>该margin最终会被解析为:
  <br/>marginX = margin[0]
  <br/>marginY = margin[1]
  <br/>后面提到的所有的marginX都表示 marginX 或者 margin[0]，marginY同理

### layouts.marginX

- type: `null | number`
- required: `false`
- default `null`

<br/>marginX = marginLeft + marginRight
<br/>marginLeft 和 marginRight是相等的

### layouts.marginY

- type: `null | number`
- required: `false`
- default `null`

  <br/>marginY = marginTop + marginBottom
  <br/>marginTop 和 marginBottom是相等的

### layouts.size

- type: `MarginOrSizeDesc`
- required: `false`
- default `[null, null]`

  <br/>size = [sizeWidth, sizeHeight]
  <br/>该margin最终会被解析为:
  <br/>sizeWidth = size[0]
  <br/>sizeHeight = size[1]
  <br/>后面提到的所有的sizeWidth都表示 sizeWidth 或者 size[0]，sizeHeight同理

### layouts.sizeWidth

- type: `null | number`
- required: `false`
- default `null`

  <br/>成员宽度
  <br/>sizeWidth优先级大于 size[0]
  <br/>在sizeWidth,col,marginX都未指定的情况下将和sizeHeight大小一致

### layouts.sizeHeight

- type: `null | number`
- required: `false`
- default `null`

  <br/>成员高度
  <br/>sizeHeight优先级大于 size[1]
  <br/>sizeHeight,row,marginY都未指定的情况下将和sizeWidth大小一致

### layouts.minCol

- type: `null | number`
- required: `false`
- default `null`

  最小列数

### layouts.maxCol(`* Future`)

- type: `null | number`
- required: `false`
- default `null`

  最大列数

### layouts.minRow

- type: `null | number`
- required: `false`
- default `null`

  最小行数，只是限制外层容器高度，实际行数超出部分会出现滚动条

### layouts.maxRow(`* Future`)

- type: `null | number`
- required: `false`
- default `null`

  最大行数，只是限制外层容器高度，实际行数超出部分会出现滚动条

### layouts.ratioCol

- type: `number`
- required: `false`
- default `0.1`

  <br/>只设置了`col`，而没有指定`marginX`和`sizeWidth`情况下实现col方向自动铺满,
  <br/>或者没有`col`只有`marginX`情况下， `ratioCol = marginX/sizeWidth`

  <br/>注意: 必须为container所挂载的元素指定宽高,且col方向没有指定size和margin才能生效

### layouts.ratioRow

- type: `number`
- required: `false`
- default `0.1`

  <br/>只设置了`row`，而没有指定`marginY`和`sizeHeight`情况下实现row方向自动铺满,
  <br/>或者没有`row`只有`marginY`情况下， `ratioRow = marginY/sizeHeight`

  <br/>注意: 必须为container所挂载的元素指定宽高,且col方向没有指定size和margin才能生效

### layouts.exchange

- type: `boolean`
- required: `false`
- default `false`

  <br/>该容器是否允许其他容器成员进入
  <br/>和Item的exchange不同的是container的控制整个自身容器

### layouts.pressTime

- type: `number`
- required: `false`
- default `360`

  触屏下长按多久响应拖拽事件,默认360ms


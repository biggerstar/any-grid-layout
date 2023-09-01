### 示例

```javascript
const container = new Container({
  el: '#container',
  layouts: { },
  events:{
    error(error){
      console.log(error)
    },
    itemMounted(item){
      console.log(item)
    }
    // 其他事件...
  },
})
```

### events

- type: `CustomEventOptions`
- required: `false`

  当前的事件钩子

### events.error

- type: `(err: HandleErrorType): void`
- required: `false`

  <br/>所有非阻断式错误都能在这里接受处理,如果未设定该函数取接受异常将直接将错误抛出到控制台
  <br/>如果没有使用该函数接受错误，框架则会直接使用 new Error抛出

### events.warn

- type: `(err: HandleErrorType): void`
- required: `false`

  <br/>所有非阻断式警告都能在这里接受处理,如果未设定该函数取接受异常将直接将警告抛出到控制台
  <br/>如果没有使用该函数接受错误，框架则会直接使用抛出warn

### events.updated

- type: `updated?(): void`
- required: `false`

  触发条件： items列表长度变化，item的宽高变化，item的位置变化都会触发

### events.containerMounted

- type: `(container: Container): void`
- required: `false`

  Container成功挂载事件

### events.containerUnmounted

- type: `(container: Container): void`
- required: `false`

  Container成功卸载事件

### events.itemMounted

- type: `(item: Item): void`
- required: `false`

  Item成功挂载事件

### events.itemUnmounted

- type: `(item: Item): void`
- required: `false`

  Item成功卸载事件

### events.addItemSuccess

- type: `(item: Item): void`
- required: `false`

  Item添加成功事件

### events.itemClosing

- type: `(item: Item): void`
- required: `false`

  item关闭前事件,返回null或者false将会阻止关闭该Item

### events.itemClosed

- type: `(item: Item): void`
- required: `false`

  item关闭后事件

### events.itemResizing

- type: `(w: number, h: number, item: Item): void`
- required: `false`

  item每次大小被改变时

### events.itemResized

- type: `(w: number, h: number, item: Item): void`
- required: `false`

  item大小改变结束

### events.itemMoving

- type: `(nowX: number, nowY: number, item: Item): void`
- required: `false`

  item拖动时在容器内所属位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数

### events.itemMoved

- type: `(nowX: number, nowY: number, item: Item): void`
- required: `false`

  item拖动结束时在容器内最终位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数

### events.itemMovePositionChange

- type: `(oldX: number, oldY: number, newX: number, newY: number): void`
- required: `false`

  item位置成功变化时响应的事件,只有位置变化才触发

### events.crossContainerExchange

- type: `(oldItem: Item, newItem: Item): void`
- required: `false`

  交换成功后oldItem会从原Container中卸载,而新Item将会自动添加进新容器中，无需手动添加，返回null或者false将会阻止该次交换

### events.autoScroll

- type: `(direction: 'X' | 'Y', offset: number, container: Container): void`
- required: `false`

  <br/>鼠标移动到容器边界自动滚动时触发，direction是方向X或Y,offset是滚动距离，触发间隔36ms，
  <br/>返回null或者false取消该次滚动，direction是方向, offset是滚动距离,负值为反方向滚动
  <br/>可以返回 {direction,offset} 对象临时指定该次滚动的新参数,允许返回{direction}或{offset}修改单个值

### events.itemExchange

- type: `(fromItem: Item, toItem: Item): void`
- required: `false`

  响应式模式中自身容器中的Item交换，fromItem:来自哪个Item，toItem:要和哪个Item交换，返回null或者false将会阻止该次交换

### events.containerSizeChange

- type: `(oldSize: number, newSize: number, container: Container): void`
- required: `false`

  内层容器(grid-container)
  col或者row大小改变触发的事件,oldSize和newSize包含以下信息`{ containerW,containerH,row,col,width,height }`

### events.mountPointElementResizing

- type: `(useLayout: any, containerWidth: any, container: Container): void`
- required: `false`

  <br/>外层容器(挂载点)大小正在改变时触发的事件(如果是嵌套容器,只会等col和row改变才触发，效果和containerResized一样),
  <br/>containerWidth是当前container的宽度，useLayout是当前使用的布局配置,使用的是实例化时传入的layout字段，
  <br/>可以直接修改形参useLayout的值或者直接返回一个新的layout对象，框架将会使用该新的layout对象进行布局,返回null或者false将会阻止布局切换
  <br/>可通过实例属性resizeReactionDelay控制触发间隔

### events.enterContainerArea

- type: `(container, item): void`
- required: `false`

  当前鼠标按下状态进入的ContainerArea，item是指当前正在操作的Item，如果没有则为null,可做贴边或者拖动到区域边界自动撑开容器大小

### events.leaveContainerArea

- type: `(container, item): void`
- required: `false`

  当前鼠标按下状态离开的ContainerArea，item是指当前正在操作的Item，如果没有则为null,可做贴边或者拖动到区域边界自动撑开容器大小

### events.colChange

- type: `(col, preCol, container): void`
- required: `false`

  col列数改变

### events.colChange

- type: `(row, preRow, container): void`
- required: `false`

  row列数改变





## 事件错误类型

- `ContainerOverflowError`： 容器溢出或相互重叠


- `itemLimitError` ： item限制异常，item不符合 itemLimit配置的限制


- `ContainerNotMounted` ： container未挂载


- `ItemAlreadyRemove` ： item已经被移除


- `NoFoundLayoutMethod` ： 算法名称指定错误

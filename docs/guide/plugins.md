# plugins

## 插件使用示例

### 方式1

```ts
const container = new Container({
  el: '#container',
  layouts: {},
  plugins:[{
    error(ev){
      console.log(ev)
    },
    itemMounted(ev){
      console.log(ev)
    }
  }],
})
```

### 方式2

```ts
container.use({
    error(ev){
      console.log(ev)
    },
    itemMounted(ev){
      console.log(ev)
    }
  })
```

### 方式3

```ts
container.use(function(ins:Container)=>{
   console.log(ins)
})

```

参考浏览器事件机制实现，每个事件基本都有默认行为和该事件相关的一些字段信息

- 若要获取事件详情，您可以通过回调函数`参数1`的`event对象`获取
- 若要阻止默认行为，您可以通过`ev,prevent()`进行阻止

## 通用插件钩子

### error

- type: `(ev: ThrowMessageEvent): void`
- required: `false`

  所有框架错误都会在这里接收，您可以通过ev.prevent()进行阻止框架抛出错误

### warn

- type: `(ev: ThrowMessageEvent): void`
- required: `false`

  所有框架警告都会在这里接收，您可以通过ev.prevent()进行阻止框架抛出警告

### config

- type: `(ev: InitOptionsEvent): void`
- required: `false`

  用户传入的配置信息

### configResolved

- type: `(ev: InitOptionsEvent): void`
- required: `false`

  经过各个插件的config之后的最终配置

### getConfig

- type: `(ev: ConfigurationEvent): void`
- required: `false`

  拦截获取配置事件，设置过程可被拦截(configName,configData)修改

### setConfig

- type: `(ev: ConfigurationEvent): void`
- required: `false`

  拦截获取配置事件，设置过程可被拦截(configName,configData)修改

### containerMountBefore

- type: `(ev: BaseEvent): void`
- required: `false`

  容器挂载之前

### containerMounted

- type: `(ev: BaseEvent): void`
- required: `false`

  Container成功挂载事件

### containerUnmounted

- type: `(ev: BaseEvent): void`
- required: `false`

  Container成功卸载事件

### containerResizing

- type: `(ev: BaseEvent): void`
- required: `false`

  Container dom盒子大小改变

### colChanged

- type: `(ev: ContainerSizeChangeEvent): void`
- required: `false`

  col列数改变

### rowChanged

- type: `(ev: ContainerSizeChangeEvent): void`
- required: `false`

  row列数改变

### addItemSuccess

- type: `(ev: BaseEvent): void`
- required: `false`

  Item添加成功事件

### itemMounted

- type: `(ev: BaseEvent): void`
- required: `false`

  Item成功挂载事件

### itemUnmounted

- type: `(ev: BaseEvent): void`
- required: `false`

  Item成功卸载事件

### itemPosChanged

- type: `(ev: ItemPosChangeEvent): void`
- required: `false`

  item 位置变化 或 尺寸变化 时响应的事件,pos变化才触发

### click

- type: `(ev: GridClickEvent): void`
- required: `false`

  点击容器或者item触发的事件

### exchangeVerification

- type: `(ev: ItemExchangeEvent): void`
- required: `false`

  跨容器交换前的验证，只有验证通过才执行交换

### exchangeProvide

- type: `(ev: ItemExchangeEvent): void`
- required: `false`

  跨容器移动时Item提供者，在提供的Container上触发

### exchangeProcess

- type: `(ev: ItemExchangeEvent): void`
- required: `false`
  <br/>跨容器移动时Item过程，主要用于处理如何挂载Item到新容器中
  <br/>通过provideItem添加要移动到目标容器的新item

### exchangeReceive

- type: `(ev: ItemExchangeEvent): void`
- required: `false`

  跨容器移动时Item接受者，在接收的Container上触发

## 布局职能插件钩子

### updateLayout

- type: `(ev: ItemLayoutEvent): void`
- required: `false`

  发起一次更新，由当前使用的布局插件自行实现更新逻辑

### each

- type: `(ev: MatrixEvent): void`
- required: `false`
  <br/>用作遍历矩阵的控制函数，可以自行实现遍历矩阵逻辑，
  <br/>比如螺旋遍历，交叉遍历...各种花里胡哨的功能，
  <br/>只需关心:
  <br/>       xxx(eachName) + start 方向作为遍历的主布局，后面的 xxx-reverse ,end 等相关功能由 flip 钩子实现

### flip

- type: `(ev: MatrixEvent): void`
- required: `false`
  <br/>翻转矩阵，无需关心实现逻辑，内部已经做了兼容和实现
  <br/>只需要关心使用遍历的名称 xxx, xxx-reverse 和 遍历的起点 start, end 在不同情况运行 verticalMirrorFlip 或
  horizontalMirrorFlip 就行
  <br/>使用翻转函数:
  <br/>        layoutManager.verticalMirrorFlip
  <br/>        layoutManager.horizontalMirrorFlip翻转

### updateCloneElementStyle

- type: `(ev: CloneElementStyleEvent): void`
- required: `false`

  更新克隆(影子)元素的尺寸,移动位置

### dragging

- type: `(ev: ItemDragEvent): void`
- required: `false`

  拖动Item中

### dragend

- type: `(ev: ItemDragEvent): void`
- required: `false`

  拖动Item结束

### dragToTop

- type: `(ev: ItemDragEvent): void`
- required: `false`

  往当前源Item的`top`方向拖动Item

### dragToRight

- type: `(ev: ItemDragEvent): void`
- required: `false`

  往当前源Item的`right`方向拖动Item

### dragToBottom

- type: `(ev: ItemDragEvent): void`
- required: `false`

  往当前源Item的`bottom`方向拖动Item

### dragToLeft

- type: `(ev: ItemDragEvent): void`
- required: `false`

  往当前源Item的`left`方向拖动Item

### dragToBlank

- type: `(ev: ItemDragEvent): void`
- required: `false`

  当前鼠标指针位置拖动到矩阵空白位置触发

### resizing

- type: `(ev: ItemResizeEvent): void`
- required: `false`

  调整大小中...

### resized

- type: `(ev: ItemResizeEvent): void`
- required: `false`

  调整大小结束

### resizeToTop

- type: `(ev: ItemResizeEvent): void`
- required: `false`

  往当前源Item的`top`方向调整大小

### resizeToRight

- type: `(ev: ItemResizeEvent): void`
- required: `false`

  往当前源Item的`right`方向调整大小

### resizeToBottom

- type: `(ev: ItemResizeEvent): void`
- required: `false`

  往当前源Item的`bottom`方向调整大小

### resizeToLeft

- type: `(ev: ItemResizeEvent): void`
- required: `false`

  往当前源Item的`left`方向调整大小

### closing

- type: `(ev: ItemLayoutEvent): void`
- required: `false`

  关闭Item中

### closed

- type: `(ev: ItemLayoutEvent): void`
- required: `false`

  关闭Item结束

## 事件错误类型

- `ContainerOverflowError`： 容器溢出或相互重叠

- `RepeatedContainerMounting`： 容器重复挂载

- `ContainerNotMounted` ： container未挂载

- `ItemAlreadyRemoved` ： item已经被移除



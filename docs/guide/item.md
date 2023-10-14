# Item

## Item配置

### pos

- type: `ItemPos`
- required: `false`

  pos位置对象,必须指定宽高

### pos.w

- type: `number`
- required: `true`

  Item宽度
-

### pos.h

- type: `number`
- required: `true`

  Item高度

### pos.x

- type: `number`
- required: `false`

  Item在容器初始X坐标位置，指定了`static`的话将被固定

### pos.y

- type: `number`
- required: `false`

  Item在容器初始Y坐标位置，指定了`static`的话将被固定

### pos.minW

- type: `number`
- required: `false`

  Item最小宽度，比如resize操作将不能小于该值，下面几个限制参数同理

### pos.maxW

- type: `number`
- required: `false`

  Item最大宽度

### pos.minH

- type: `number`
- required: `false`

  Item最小高度

### pos.maxH

- type: `number`
- required: `false`

  Item最大高度

### name

- type: `string`
- required: `false`

  开发者直接在元素标签上使用name作为名称，如果有指定后续可以通过能直接通过`container.find(name | Element | class)`
  快速找到对应的Item

### className

- type: `string`
- required: `false`
- default `'grid-item'`

  Item在文档中默认的类名,可以由外部传入重新自定义

### follow

- type: `boolean`
- required: `false`
- default `true`
  是否让Item在脱离Items覆盖区域的时候跟随鼠标实时移动，比如鼠标在Container空白区域或者在Container外部


### transition

- type: `true | number | ItemTransitionObject`
- required: `false`
- default `{ time: 180, field: 'top,left,width,height' } as ItemTransitionObject`

   <br/> time:动画过渡时长 ms,
   <br/> field: 要过渡的css字段
   <br/> 可通过`Container.animation`函数修改全部Item,通过Item.animation函数修改单个Item

### draggable

- type: `boolean`
- required: `false`
- default `false`

  item是否可以拖动

### resize

- type: `boolean`
- required: `false`
- default `false`

  item是否可以调整大小

### close

- type: `boolean`
- required: `false`
- default `false`

  是否有关闭按钮，建议开发者自己实现按钮或者css更改`.grid-item-close-btn`按钮样式

### static

- type: `boolean`
- required: `false`
- default `false`

  该item是否是静态布局，如果为true，则该item将会固定在外部指定的某行某列中
  <br/>指定了static后建议指定x,y，否则将会自动布局后固定在自动布局后的布局位置

### exchange

- type: `boolean`
- required: `false`
- default `false`

  该Item是否可以参与跨容器交换，和container的exchange不同的是该参数只控制Item自身
  交换前提: 前往的`其他container`打开了exchange功能，该item打开了exchange功能

### dragIgnoreEls

- type: `Array<Element>`
- required: `false`
- default `[]`

  【不允许】点击该范围内的元素拖动Item,数组内的值为css选择器或者目标子元素(Element)

### dragAllowEls

- type: `Array<Element>`
- required: `false`
- default `[]`

  【只允许】 点击该范围内的元素拖动Item,数组内的值为css选择器或者目标子元素(Element)

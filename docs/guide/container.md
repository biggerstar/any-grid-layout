# Container

## Container实例化配置

### el

- type: `HTMLElement | string`
- required: `true`

  指定容器Id名或者一个Element网页节点，该节点将作为当前布局数据的根容器
  <br/>请注意: 您必须为目标要挂载的container元素指定一个宽高，否则有可能不会显示容器

### name

- type: `string`
- required: `false`

  该容器的名称,只是给个命名，不影响执行的行为

### className

- type: `string`
- required: `false`
- default `'grid-container'`

  Container在文档中默认的类名,可以由外部传入该字段重新自定义

### global

- type: `CustomLayoutsOption`
- required: `false`

  <br/>当前的全局布局配置，配置参考 [layouts](layouts.md) ,配置字段完全一样
  <br/>该配置最终会和layouts中不同px下的配置合并作为最终使用的配置。
  <br/>该配置一般用于多尺寸布局
  <br/>合并规则： `finallyLayout = Object.assgin(global,layouts[index])`

### layouts

详见 [layouts](layouts.md)

### plugins

- type: `GridPlugin[]`
- required: `false`
-

详见 [plugins](plugins.md)

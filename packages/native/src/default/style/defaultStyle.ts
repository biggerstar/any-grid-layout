/**
 *  下面是内置类名，驼峰需转横杠，通过css横杆命名修改能定义覆盖这里的默认值
 *
 * */

export const defaultStyle = {
  gridContainerArea: {
    display: 'block',
  },
  gridContainer: {   // Container初始化使用的默认样式
    height: 'auto',
    width: '100%',
    position: 'relative',
    display: 'block',
    margin: '0 auto',
    mosUserSelect: 'none',
    webkitUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',   // 禁止用户选择文本或元素
  },
  gridItem: {   // Item初始化使用的默认样式
    height: '100%',
    width: '100%',
    display: 'block',
    overflow: 'hidden',
    position: 'absolute',
    touchCallout: 'none',  // 苹果禁用touch提示
    // touchAction: 'none',  // 阻止touch事件
    mosUserSelect: 'none',
    webkitUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',   // 禁止用户选择文本或元素
  },
  gridResizableHandle: {
    height: '20px',
    width: '20px',
    position: 'absolute',
    bottom: '0',
    right: '0',
    fontSize: '1.3rem',
    fontWeight: '800',
    color: 'grey',
    textAlign: 'right',
  },
  gridItemCloseBtn: {
    height: '20px',
    width: '20px',
    position: 'absolute',
    right: '0',
    top: '0',
    innerHTML: `×`,
    fontSize: '1.2rem',
    textAlign: 'center',
    lineHeight: '20px',
    borderRadius: '50%'
  }


}

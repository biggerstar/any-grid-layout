/**
 * 自动计算 margin，size 并设置到container上
 * @param direction {Number}  col | row 的值
 * @param containerBoxLen {Number}  element width or height
 * @param size {Number}  set custom size value
 * @param margin {Number} set custom margin value
 * @param ratio {Number} set custom ratio value, default value from container built-in param
 * */
export function autoComputeSizeInfo(direction, containerBoxLen, size = null, margin = null, ratio) {
  if (direction) {   //  col指定通常是执行静态布局，主算 size 和 margin
    if (size === null && margin === null) {   // 自动分配size和margin
      if (parseInt(direction.toString()) === 1) {
        margin = 0
        size = containerBoxLen / direction
      } else {
        //  自动分配时解二元一次方程
        //   marginAndSizeWidth +  margin[0]
        // ---------------------------------   =  1
        //     (margin  + size) * col
        // containerBoxLen +  margin = (margin  + size) * col
        // size = (containerBoxLen - ((col - 1) *  margin)) / col
        // margin=  size * ratioCol
        // 通过消元法消去 size
        // 得到： margin    = containerBoxLen /  ( col - 1 + (col / ratioCol) )
        margin = containerBoxLen / (direction - 1 + (direction / ratio))
        // size = margin / ratioCol
        size = (containerBoxLen - (direction - 1) * margin) / direction
        // console.log(size * col + (margin * (col - 1)));
      }
    } else if (size !== null && margin === null) {   // size[0]固定，自动分配margin
      if (parseInt(direction.toString()) === 1) margin = 0
      else margin = (containerBoxLen - (direction * size)) / (direction - 1)
      if (margin <= 0) margin = 0
    } else if (size === null && margin !== null) {  // margin固定，自动分配size
      if (parseInt(direction.toString()) === 1) margin = 0
      size = (containerBoxLen - ((direction - 1) * margin)) / direction
      if (size <= 0) throw new Error('在margin[*(0 or 1)]或在margin* (X or Y)为' + margin +
        '的情况下,size[*(0 or 1)]或size*(Width or Height)的Item主体宽度已经小于0,' +
        '您可以调小margin或者设定Container最小宽度或者高度(css:min-XXX),且保证margin*(col||row)大于最小宽度')
    } else if (size !== null && margin !== null) {
    } // margin和size都固定,啥事都不做，用户给的已知数太多,都不用计算了
  } else if (!direction) {   // col不指定执行动态布局， 主算 col数量，次算margin,size中的一个,缺啥算啥
    // if (margin !== null && size === null) {  }  // col = null size = null 没有这种情况！！
    if (margin === null && size !== null) {   // size固定，自动分配margin和计算col
      if (containerBoxLen <= size) {    //  别问为什么这里和上面写重复代码，不想提出来且为了容易理解逻辑，也为了维护容易，差不了几行的-_-
        margin = 0
        direction = 1
      } else {
        direction = Math.floor(containerBoxLen / size)
        margin = (containerBoxLen - (size * direction)) / direction
      }
    } else if (margin !== null && size !== null) {   // margin和size固定，自动计算col
      if (containerBoxLen <= size) {   //  Container宽度小于预设的size宽度，表示是一行，此时不设置margin将全部宽度给size
        margin = 0
        direction = 1
      } else {     //  上面不是一行那这里就是多行了~~~~~~
        direction = Math.floor((containerBoxLen + margin) / (margin + size))
      }
    } else if (margin !== null && size === null) {
      size = margin / ratio
      if (containerBoxLen <= size) {
        direction = 1
      } else {
        direction = Math.floor((containerBoxLen + margin) / (margin + size))
      }
    }
  }
  return {
    direction,
    size,
    margin
  }
}

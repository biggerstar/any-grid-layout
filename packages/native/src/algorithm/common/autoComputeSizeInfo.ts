import {isNumber} from "is-what";

/**
 * 自动计算 margin，size 并设置到container上
 * */
export function autoComputeSizeInfo(
  /** col | row 的值 */
  direction: number,
  /** element width or height */
  containerBoxLen: number,
  /** set custom size value */
  size = null,
  /** set custom margin value */
  margin = null,
  /** set custom ratio value, default value from container built-in param */
  ratio: number
):
  {
    direction: number,
    size: number,
    margin: number
  } {
  const hasSize = isNumber(size)
  const hasMargin = isNumber(margin)
  if (hasSize && size < 0) size = 0
  if (hasMargin && margin < 0) margin = 0
  // console.log(margin, size);
  if (direction) {   //  col指定通常是执行静态布局，主算 size 和 margin
    if (!hasSize && !hasMargin) {   // 自动分配size和margin
      if (parseInt(direction.toString()) === 1) {
        margin = 0
        size = containerBoxLen / direction
      } else {
        //  自动分配时解二元一次方程
        //   marginAndSizeWidth +  margin[0]
        // ---------------------------------   =  1
        //     (margin  + size) * col
        // containerBoxLen +  margin = (margin * 2 + size) * col
        // size = (containerBoxLen - ((col - 1) *  margin* 2)) / col
        // margin=  size * ratioCol
        // 通过消元法消去 size
        // 得到： margin    = containerBoxLen /  ( col - 1 + (col / ratioCol) )
        margin = containerBoxLen / (direction - 1 + (direction / ratio))
        // size = margin / ratioCol
        size = (containerBoxLen - (direction - 1) * margin * 2) / direction
        // console.log(size * col + (margin * (col - 1)));
      }
    } else if (hasSize && !hasMargin) {   // size[0]固定，自动分配margin
      if (parseInt(direction.toString()) === 1) margin = 0
      else margin = (containerBoxLen - (direction * size)) / (direction - 1) / 2
      if (margin <= 0) margin = 0
    } else if (!hasSize && hasMargin) {  // margin固定，自动分配size
      if (parseInt(direction.toString()) === 1) margin = 0
      size = (containerBoxLen - ((direction - 1) * margin) * 2) / direction
      if (size <= 0) size = margin / ratio
    } else if (hasSize && hasMargin) {
    } // margin和size都固定,啥事都不做，用户给的已知数太多,都不用计算了
  } else if (!direction) {   // col不指定执行动态布局， 主算 col数量，次算margin,size中的一个,缺啥算啥
                             // if (margin !== null && size === null) {  }  // col = null size = null 没有这种情况！！
    if (margin === null && hasSize) {   // size固定，自动分配margin和计算col
      margin = size * ratio
      if (containerBoxLen <= size) {    //  别问为什么这里和上面写重复代码，不想提出来且为了容易理解逻辑，也为了维护容易，差不了几行的-_-
        margin = 0
        direction = 1
      } else {
        direction = Math.floor(containerBoxLen / (size + margin * 2))
      }
    } else if (hasMargin && hasSize) {   // margin和size固定，自动计算col
      if (containerBoxLen <= size) {   //  Container宽度小于预设的size宽度，表示是一行，此时不设置margin将全部宽度给size
        margin = 0
        direction = 1
      } else {     //  上面不是一行那这里就是多行了~~~~~~
        direction = Math.floor((containerBoxLen + margin) / (margin * 2 + size))
      }
    } else if (hasMargin && !hasSize) {
      size = margin / ratio     // 只有margin的时候size以ratio为标准
      if (containerBoxLen <= size) {
        direction = 1
      } else {
        direction = Math.floor((containerBoxLen + margin) / (margin * 2 + size))
      }
    }
  }
  return {
    direction,
    size,
    margin
  }
}


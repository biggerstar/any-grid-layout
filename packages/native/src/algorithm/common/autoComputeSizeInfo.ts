import {isNumber} from "is-what";

/**
 * 自动计算 gap，size 并设置到container上
 * */
export function autoComputeSizeInfo(
  /** col | row 的值 */
  direction: number,
  /** element width or height */
  containerBoxLen: number,
  /** set custom size value */
  size = null,
  /** set custom gap value */
  gap = null,
  /** set custom ratio value, default value from container built-in param */
  ratio: number
):
  {
    direction: number,
    size: number,
    gap: number
  } {
  const hasSize = isNumber(size)
  const hasGap = isNumber(gap)
  if (hasSize && size < 0) {
    size = 0
  }
  if (hasGap && gap < 0) {
    gap = 0
  }
  // console.log(gap, size);
  if (direction) {   //  col指定通常是执行静态布局，主算 size 和 gap
    if (!hasSize && !hasGap) {   // 自动分配size和gap
      if (parseInt(direction.toString()) === 1) {
        gap = 0
        size = containerBoxLen / direction
      } else {
        //  自动分配时解二元一次方程
        //   gapAndSizeWidth +  gap[0]
        // ---------------------------------   =  1
        //     (gap  + size) * col
        // containerBoxLen +  gap = (gap + size) * col
        // size = (containerBoxLen - ((col - 1) *  gap)) / col
        // gap=  size * ratioCol
        // 通过消元法消去 size
        // 得到： gap    = containerBoxLen /  ( col - 1 + (col / ratioCol) )
        gap = containerBoxLen / (direction - 1 + (direction / ratio))
        // size = gap / ratioCol
        size = (containerBoxLen - (direction - 1) * gap) / direction
        // console.log(size * col + (gap * (col - 1)));
      }
    } else if (hasSize && !hasGap) {   // size[0]固定，自动分配gap
      if (parseInt(direction.toString()) === 1) {
        gap = 0
      } else {
        gap = (containerBoxLen - (direction * size)) / (direction - 1)
      }
      if (gap <= 0) {
        gap = 0
      }
    } else if (!hasSize && hasGap) {  // gap固定，自动分配size
      if (parseInt(direction.toString()) === 1) {
        gap = 0
      }
      size = (containerBoxLen - ((direction - 1) * gap)) / direction
      if (size <= 0) {
        size = gap / ratio
      }
    } else if (hasSize && hasGap) {
    } // gap和size都固定,啥事都不做，用户给的已知数太多,都不用计算了
  } else if (!direction) {   // col不指定执行动态布局， 主算 col数量，次算gap,size中的一个,缺啥算啥
                             // if (gap !== null && size === null) {  }  // col = null size = null 没有这种情况！！
    if (gap === null && hasSize) {   // size固定，自动分配gap和计算col
      gap = size * ratio
      if (containerBoxLen <= size) {    //  别问为什么这里和上面写重复代码，不想提出来且为了容易理解逻辑，也为了维护容易，差不了几行的-_-
        gap = 0
        direction = 1
      } else {
        direction = Math.floor(containerBoxLen / (size + gap))
      }
    } else if (hasGap && hasSize) {   // gap和size固定，自动计算col
      if (containerBoxLen <= size) {   //  Container宽度小于预设的size宽度，表示是一行，此时不设置gap将全部宽度给size
        gap = 0
        direction = 1
      } else {     //  上面不是一行那这里就是多行了~~~~~~
        direction = Math.floor((containerBoxLen + gap) / (gap + size))
      }
    } else if (hasGap && !hasSize) {
      size = gap / ratio     // 只有gap的时候size以ratio为标准
      if (containerBoxLen <= size) {
        direction = 1
      } else {
        direction = Math.floor((containerBoxLen + gap) / (gap + size))
      }
    }
  }
  return {
    direction,
    size,
    gap
  }
}


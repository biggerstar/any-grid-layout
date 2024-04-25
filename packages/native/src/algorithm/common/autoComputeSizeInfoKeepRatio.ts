import {isNumber} from "is-what";

/**
 * 自动计算 gap，size
 * */
export function autoComputeSizeInfoKeepRatio(
  /** element width or height */
  containerBoxLen: number,
  /** custom size value */
  size = null,
  /** custom gap value */
  gap = null,
  /** custom ratio value, default value from container built-in param */
  ratio: number
): {
  direction: number,
  size: number,
  gap: number
} {
  let direction: number
  let hasSize = isNumber(size)
  let hasGap = isNumber(gap)
  if (!hasSize && !hasGap) {
    throw new Error('您必须指定 size 或者 gap')
  }
  size = hasSize ? Math.max(size, 0) : gap / ratio
  gap = hasGap ? Math.max(gap, 0) : size * ratio
  direction = containerBoxLen <= size ? 1 : Math.floor((containerBoxLen + gap) / (gap + size))
  return {
    direction,
    size,
    gap
  }
}

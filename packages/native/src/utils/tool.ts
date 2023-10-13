// noinspection JSUnusedGlobalSymbols

import {Container, Item} from "@/main";
import {isNumber} from "is-what";


/**
 * 节流
 * */
export function throttle<T extends Function>(func: T, wait: number = 350): () => ReturnType<T> {  // 全局共用节流函数通道：返回的是函数，记得再执行
  let self
  let old = 0;
  return function () {
    let res
    self = this;
    let now = new Date().valueOf();
    if (now - old > wait) {
      res = func.apply(self, arguments);
      old = now;
    }
    return res
  }
}

/**
 * 防抖
 * */
export function debounce(fn: Function, delay: number = 500) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}

/**
 * 转首字母大写
 * */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 深度克隆对象,支持克隆数组
 * */
export const cloneDeep = (obj: any) => {  // 使用lodash.cloneDeep在lib模式下打包体积多了4k
  if (typeof obj !== 'object') return obj
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = cloneDeep(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

/**
 * 深度合并对象
 * */
export function mergeDeep(target, source) {
  if (typeof target !== 'object' || typeof source !== 'object') return source
  for (const key in source) {  // 判断属性是否是源对象自身的属性（非继承）
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object') {    // 判断源对象的属性是否是对象
        if (!target.hasOwnProperty(key)) target[key] = source[key]   // 如果目标对象没有该属性，直接赋值
        else target[key] = mergeDeep(target[key], source[key])    // 递归合并
      } else target[key] = source[key]
    }
  }
  return target;
}

/**
 * 螺旋遍历矩阵数组,使用回调手动处理
 * */
export function spiralTraversal(matrix: Array<Array<any>>, callback: (row: number, col: number, val: any) => void) {
  if (matrix.length === 0) return []
  let rows = matrix.length
  let columns = matrix[0].length
  let top = 0, bottom = rows - 1, left = 0, right = columns - 1
  let direction = 0

  while (top <= bottom && left <= right) {
    if (direction === 0) { // 向右遍历
      for (let i = left; i <= right; i++) {
        callback(top, i, matrix[top][i])
      }
      top++
    } else if (direction === 1) { // 向下遍历
      for (let i = top; i <= bottom; i++) {
        callback(i, right, matrix[i][right])
      }
      right--
    } else if (direction === 2) { // 向左遍历
      for (let i = right; i >= left; i--) {
        callback(bottom, i, matrix[bottom][i])
      }
      bottom--
    } else if (direction === 3) { // 向上遍历
      for (let i = bottom; i >= top; i--) {
        callback(i, left, matrix[i][left])
      }
      left++
    }
    direction = (direction + 1) % 4  // 改变方向
  }
}


/**
 * 驼峰转短横线
 * */
export function getKebabCase(str: string) {
  return str.replace(/[A-Z]/g, function (i) {
    return '-' + i.toLowerCase();
  })
}

/**
 * 获取传入args参数中第一个是数字类型的值并返回该值
 * */
export const getFirstNumber = (...args) => args.find(val => isNumber(val))

/**
 * 从一个新的对象合并到另一个原有对象中且 [ 只合并原有存在对象中的值 ],参数位置和Object.assign一样
 * 和 Object.assign不同的是该方法不会复制两者不同属性到to对象中, 会直接影响到原对象
 * @param {Object} to 接受者
 * @param {Object} from 提供者
 * @param {Boolean} clone 是否浅克隆(浅拷贝), true: 浅克隆  false: 直接合并到目标对象
 * @param {Array} exclude  排除合并的字段
 * */
export const merge = (to = {}, from = {}, clone = false, exclude = []) => {
  const cloneData = {}
  Object.keys(from).forEach((name) => {
    if (Object.keys(to).includes(name) && !exclude.includes(name)) {
      if (clone) {
        cloneData[name] = from[name] !== undefined ? from[name] : to[name]
      } else {
        to[name] = from[name] !== undefined ? from[name] : to[name]
      }
    }
  })
  return clone ? cloneData : to
}

/**
 * 用于将target Element在原型链中对象中往root方向最新的的Path链解析出来
 * 用于适配移动端获取target的目标不正确的问题
 * */
const genPrototypeToRootPath = (target: HTMLElement, touchEvent) => {
  const path = []
  if (touchEvent.touchTarget) target = touchEvent.touchTarget
  else {
    if (touchEvent.composedPath) return touchEvent.composedPath()
    else {
      target = <HTMLElement>document.elementFromPoint(touchEvent.clientX, touchEvent.clientY)
    }
  }
  // console.log(touchEvent);
  if (target instanceof HTMLElement) {
    do {
      path.push(target)
      target = <HTMLElement>target.parentNode
    } while (target && target.parentNode)
  }
  // console.log(path);
  return path
}

export function getEvTarget(ev: Event) {
  return ev.target || ev['toElement'] || ev['srcElement']
}

export function getItemFromElement(el): Item | null {
  return el._isGridItem_ ? el._gridItem_ : null
}

export function getContainerFromElement(el): Container | null {
  return el._isGridContainer_ ? el._gridContainer_ : null
}

/**
 * [parentNode方式] 用于将在原型链中对象中往root方向最新的的Container解析出来
 * */
export const parseContainerFromPrototypeChain = (target): Container | null => {
  let container
  if (target instanceof Element) {
    do {
      if (target._isGridContainer_) {
        container = target._gridContainer_
        break
      }
      target = target.parentNode
    } while (target && target.parentNode)
  }
  return container
}

/**
 * [path方式] 用于将domEvent对象中往root方向最新的的Container解析出来，reverse是最远的靠近root的Container
 * */
export const parseContainer = (ev, reverse = false): Container | null => {
  let container = null
  const target = ev.touchTarget ? ev.touchTarget : ev.target   // touchTarget是触屏设备下外部通过elementFromPoint手动获取的
  if (target._isGridContainer_) {
    container = target._gridContainer_
  } else {
    // 这里有不严谨的bug，能用，path在触屏下target固定时点击的目标，但是该目标的Container正常是一样的
    const target = getEvTarget(ev)
    const path = genPrototypeToRootPath(target, ev)
    for (let i = 0; i < path.length; i++) {
      if (path[i]._isGridContainer_) {
        container = path[i]._gridContainer_
        // console.log(ev.path[i]);
        if (!reverse) break
      }
    }
  }
  return container
}

/**
 * 用于将domEvent对象中往root方向最新的的Item解析出来，reverse是最远的靠近root的Item
 * */
export const parseItem = (ev): Item | null => {
  let item = null
  const target = ev.touchTarget ? ev.touchTarget : ev.target   // touchTarget是触屏设备下外部通过elementFromPoint手动获取的
  if (target._isGridItem_) {
    item = target._gridItem_
  } else {
    // 这里有不严谨的bug，能用，path在触屏下target固定时点击的目标，但是吧，后面else这部分在当前逻辑未用到，
    const target = getEvTarget(ev)
    const path = genPrototypeToRootPath(target, ev)
    for (let i = 0; i < path.length; i++) {
      const el = path[i]
      if (el._isGridContainer_) return null  // 嵌套情况下如果没有item但是找到了container，则直接返回null
      if (el._isGridItem_) return el._gridItem_
    }
  }
  return item
}


/**
 * 检测某个item 要放置的HTML元素目标是否被嵌套
 * */
export function parseItemFromPrototypeChain(target): Item | null {
  if (target instanceof Element) {
    do {
      if (target._isGridItem_) return target._gridItem_
      target = <HTMLElement>target.parentNode
    } while (target && target.parentNode)
  }
  return null
}

/**
 * 触屏模式下点击屏幕触发的触屏事件转成和鼠标事件类似的通用事件，只支持一个手指
 * 会将相关信息挂载到ev上并通过事件流分发到各个事件中
 * */
export const singleTouchToCommonEvent = (touchEvent) => {
  let useTouchKey = 'touches'
  if (touchEvent.touches && touchEvent.touches.length === 0) useTouchKey = 'changedTouches'  // 正常用于touchEnd获取最后改变的point
  if (touchEvent[useTouchKey] && touchEvent[useTouchKey].length) {
    for (let k in touchEvent[useTouchKey][0]) {
      if (['target'].includes(k)) continue
      if (touchEvent[k] === undefined) touchEvent[k] = touchEvent[useTouchKey][0][k]
    }
    touchEvent.touchTarget = document.elementFromPoint(touchEvent.clientX, touchEvent.clientY)
  }
  return touchEvent
}

export function getClientRect<T extends Element>(el: T, clone: boolean = false): DOMRect {
  let rect: {} = el.getBoundingClientRect()
  let rectObj: Record<any, any> = {}
  if (clone) {
    for (const k in rect) {
      rectObj[k] = rect[k]
    }
  }
  delete rectObj.toJSON
  return (clone ? rectObj : rect) as DOMRect
}

/**
 * 限制数字在某个范围内
 * */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

import {CustomItem, CustomItems} from "@/types";

/** 节流 */
export function throttle(func: Function, wait: number = 350): () => void {  // 全局共用节流函数通道：返回的是函数，记得再执行
  let self, args;
  let old = 0;
  return function () {
    self = this;
    args = arguments;
    let now = new Date().valueOf();
    if (now - old > wait) {
      func.apply(self, args);
      old = now;
    }
  }
}

/** 防抖 */
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

/** 深度克隆对象  */
export const cloneDeep = (obj: Record<any, any>) => {  // 使用lodash.cloneDeep在lib模式下打包体积多了4k
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

/** 深度合并对象  */
function mergeDeep(target, source) {
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


/** 驼峰转短横线  */
export function getKebabCase(str: string) {
  return str.replace(/[A-Z]/g, function (i) {
    return '-' + i.toLowerCase();
  })
}

/** 从一个新的对象合并到另一个原有对象中且 [ 只合并原有存在对象中的值 ],参数位置和Object.assign一样
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

/**  用于将target Element在原型链中对象中往root方向最新的的Path链解析出来 */
const genPrototypeToRootPath = (target, touchEvent) => {
  const path = []
  if (touchEvent.touchTarget) target = touchEvent.touchTarget
  else {
    if (touchEvent.composedPath) return touchEvent.composedPath()
    else {
      target = document.elementFromPoint(touchEvent.clientX, touchEvent.clientY)
    }
  }
  // console.log(touchEvent);
  if (target instanceof Element) {
    do {
      path.push(target)
      target = target.parentNode
    } while (target && target.parentNode)
  }
  // console.log(path);
  return path
}

/**  用于将在原型链中对象中往root方向最新的的Container解析出来 */
export const parseContainerFromPrototypeChain = (target) => {
  let container
  if (target instanceof Element) {
    do {
      if (target._isGridContainer_) {
        container = target._gridContainer_
        break
      }
      target = target.parentNode
      // console.log(target);
    } while (target.parentNode)
  }
  return container
}

/**  用于将domEvent对象中往root方向最新的的Container解析出来，reverse是最远的靠近root的Container*/
export const parseContainer = (ev, reverse = false) => {
  let container = null
  const target = ev.touchTarget ? ev.touchTarget : ev.target   // touchTarget是触屏设备下外部通过elementFromPoint手动获取的
  if (target._isGridContainer_) {
    container = target._gridContainer_
  } else {
    // 这里有不严谨的bug，能用，path在触屏下target固定时点击的目标，但是该目标的Container正常是一样的
    // 后面有相关需求也能通过parentNode进行获取
    const target = ev.target || ev['toElement'] || ev['srcElement']   // 兼容
    const path = genPrototypeToRootPath(target, ev)
    for (let i = 0; i < path.length; i++) {
      if (path[i]._isGridContainer_) {
        container = path[i]._gridContainer_
        // console.log(ev.path[i]);
        if (!reverse) break
      }
    }
  }
  // console.log(container);
  return container
}

/**  用于将domEvent对象中往root方向最新的的containerAreaElement解析出来，reverse是最远的靠近root的containerAreaElement*/
export const parseContainerAreaElement = (ev, reverse = false) => {
  let containerAreaElement = null
  const target = ev.touchTarget ? ev.touchTarget : ev.target   // touchTarget是触屏设备下外部通过elementFromPoint手动获取的
  if (target._isGridContainerArea) {
    containerAreaElement = target
  } else {
    // 这里有不严谨的bug，能用，path在触屏下target固定时点击的目标，但是该目标的Container正常是一样的
    // 后面有相关需求也能通过parentNode进行获取
    const target = ev.target || ev['toElement'] || ev['srcElement']   // 兼容
    const path = genPrototypeToRootPath(target, ev)
    for (let i = 0; i < path.length; i++) {
      if (path[i]._isGridContainerArea) {
        containerAreaElement = path[i]
        if (!reverse) break
      }
    }
  }
  return containerAreaElement


}

/** 用于将domEvent对象中往root方向最新的的Item解析出来，reverse是最远的靠近root的Item */
export const parseItem = (ev, reverse = false) => {
  let item = null
  const target = ev.touchTarget ? ev.touchTarget : ev.target   // touchTarget是触屏设备下外部通过elementFromPoint手动获取的
  if (target._isGridItem_) {
    item = target._gridItem_
  } else {
    // 这里有不严谨的bug，能用，path在触屏下target固定时点击的目标，但是吧，后面else这部分在当前逻辑未用到，
    // 后面有相关需求也能通过parentNode进行获取
    const target = ev.target || ev['toElement'] || ev['srcElement']   // 兼容
    const path = genPrototypeToRootPath(target, ev)
    for (let i = 0; i < path.length; i++) {
      if (path[i]._isGridItem_) {
        item = path[i]._gridItem_
        // console.log(ev.path[i]);
        if (!reverse) break
      }
    }
  }
  return item
}

/** 触屏模式下点击屏幕触发的触屏事件转成和鼠标事件类似的通用事件，只支持一个手指 */
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

/**
 * 为传入的items填充默认数据, 会返回一个深度克隆后的对象
 * 合并方式: 使用 `Object.assign` 合并首层数据
 * 比如
 * @param items  最小可用成员构造对象数组，比如 {pos: {w: 1,h: 1 }}
 * @param fillFields  要为items所有成员添加 填充 的字段
 * @param isDeepClone 是否强制使用fillFields覆盖原本items成员数组，内部使用Object.assign函数实现fillFields覆盖item对象键值
 * @example
 *    const items = [{
 *      pos:{w:h}
 *    }]
 *    // 调用函数
 *    fillInItemLayoutList(items,{ close:true })
 *    //  items结果: [{  pos:{w:h},close:true }]
 * */
export function fillItemLayoutList(items: CustomItems = [], fillFields: CustomItem = {}, isDeepClone: boolean = true): CustomItems {
  return items.map((item) => {
    if (isDeepClone) item = cloneDeep(item)
    item = mergeDeep(item, fillFields)
    return item
  })
}

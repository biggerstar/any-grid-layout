import {getKebabCase, throttle} from "@/utils/tool";

export default class DomFunctionImpl {
  element = null
  observer = null

  constructor() {
  }

  /** 直接将符合style对象形式的表达对象传入，会对Item`自身`的样式进行覆盖更新
   *  isCssText 是否通过 cssText 防止回流重绘
   * */
  updateStyle(style, element = null, isCssText = true) {
    if (Object.keys(style).length === 0) return
    element = element ? element : this.element
    let cssText = ''
    Object.keys(style).forEach((key) => {
      if (!isCssText) element.style[key] = style[key]
      else cssText = `${cssText} ${getKebabCase(key)}:${style[key]}; `
    })
    if (isCssText) element.style.cssText = element.style.cssText + ';' + cssText
  }

  hasClass(className) {
    return this.element.classList.contains(className)
  }

  addClass(...arg) {
    this.element.classList.add(...arg)
  }

  removeClass(...arg) {
    this.element.classList.remove(...arg)
  }

  replaceClass(oldCls, newCls) {
    this.element.classList.replace(oldCls, newCls)
  }

  /** 添加一个元素的属性
   * @param {String} attrName 一个包含元素属性名和对应值的对象
   * */
  getAttr(attrName) {
    return this?.element?.attributes?.getNamedItem(attrName) || null
  }

  /** 添加一个元素的属性  这里也能用element.setAttribute 进行设置
   * @param {Object} attrs 一个包含元素属性名和对应值的对象
   * */
  addAttr(attrs) {
    try {
      Object.keys(attrs).forEach((attrName) => {
        const attrNode = document.createAttribute(attrName);
        attrNode.value = attrs[attrName];
        this?.element?.attributes?.setNamedItem(attrNode)
      })
    } catch (e) {
    }
  }

  /**
   * @param {string} dataSetName  该参数为 '' 空时默认返回所有 DataSet
   */
  getDataSet(dataSetName = '') {
    if (dataSetName.replace(' ', '') === '') return Object.assign({}, this.element.dataset)
    return this.element.dataset[dataSetName]
  }

  /** 移除元素的属性
   * @param {Array,String} attrs 一个属性名集合的数组
   * */
  removeAttr(attrs) {
    try {
      if (typeof attrs === 'string') this.element.attributes.removeNamedItem(attrs)
      else if (Array.isArray(attrs)) {
        attrs.forEach((attrName) => {
          this.element.attributes.removeNamedItem(attrName)
        })
      }
    } catch (e) {
    }
  }


  /** 用于监听自身属性变化, unObserver结束观测后可在通过调用 observe 观测，观测的配置参数可由新传入的为准
   *  该函数多次运行只会保留一个 observer 的实例
   *  @param {Function} func  观测变化之后执行的函数, 不设返回值
   *  @param {Number} throttleTime 节流时间，default = 200ms
   *  @param {Array} attrNames 要监测的属性名称 默认内置 [style , class] 且不可被覆盖
   * */
  observe(func, throttleTime = 200, attrNames = []) {
    if (this.observer === null) {
      let MutationObserver = window['MutationObserver'] || window['WebKitMutationObserver'] || window['MozMutationObserver']
      this.observer = new MutationObserver(throttle(func, throttleTime))
    }
    const attributeFilter = ['style', 'class'].concat(attrNames)
    this.observer.observe(this.element, {attributeFilter, attribute: true, attributeOldValue: true})
  }

  /** 结束上次的观测,可以再次通过调用observe 进行再度观测 */
  unObserve() {
    this.observer.disconnect()
  }

  /** 非原生DomEvent方法，只有监听方法,调用后可以通过 unObserve 取消监听
   * @param {Function} callback 是tagResize后回调,回调的返回值是tag新的 宽 高
   * */
  onResize(callback) {
    // if (this.i > 0) return
    this.observe((mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          let width = getComputedStyle(this.element).getPropertyValue('width')
          let height = getComputedStyle(this.element).getPropertyValue('height')
          if (typeof callback === 'function') callback.call(callback, {
            width: parseInt(width),
            height: parseInt(height)
          })
        }
      })
    }, 500)
  }

  /** 用于监听参数eventName指定名称的事件，如果没有on的事件前缀会自动加上on,
   * 通过直接函数赋值到dom树上的方式下，该函数触发的时候只会添加一次且也只运行一次
   * @param {String} eventName  监听事件名称
   * @param {Function}callback  事件触发后执行的函数
   * @param {Element} dom  可选，为该Element绑定上这次事件
   * @param {Number} throttleTime  可选，节流时间，默认 350ms
   * */
  onEvent(eventName, callback, dom = null, throttleTime = 350) {
    const element = dom || this.element
    if (!eventName.includes('on')) eventName = 'on' + eventName
    if (!element[eventName]) element[eventName] = throttle(callback, throttleTime)
  }

  /** 用于监听参数eventName指定名称的事件，如果没有on的事件前缀会自动加上on,
   * 需要注意的是调用删除事件需要原始函数的时候需要使用返回的函数 throttleFun , 因为原始函数已经被包装，两者地址不一样
   * 通过直接添加事件集，和上面 onEvent 不同是可以添加多个， 参数见 onEvent 函数
   * */
  addEvent(eventName, callback, dom = null, args = {}) {
    let throttleTime = 350, capture = false
    if (args['throttleTime']) throttleTime = args['throttleTime']
    if (args['capture']) capture = args['capture']

    const element = dom || this.element
    const throttleFun = throttle(callback, throttleTime)
    element.addEventListener(eventName, throttleFun, capture)
    return throttleFun
  }

  /**  移除事件 */
  removeEvent(eventName, callbackFun, dom = null) {
    const element = dom || this.element
    element.removeEventListener(eventName, callbackFun)

  }

  throttle(callback, throttleTime) {
    return throttle(callback, throttleTime)
  }
}

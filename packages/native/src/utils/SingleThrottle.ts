// noinspection JSUnusedGlobalSymbols

import {isFunction, isNumber} from "is-what";
import {throttle} from "@/utils/tool";

/**
 * 单通道节流,可使用new创建多个通道,不支持函数参数，只是单纯运行函数
 * 第一次运行do会直接先运行一次函数
 * */
export class SingleThrottle<T extends Record<any, any>> {
  public do: (func: () => void, wait?: number) => void
  public rules: (() => boolean)[] = []
  public updateMethods: Record<keyof T, (...args: any[]) => any> = {}     // 包装后的节流函数
  public _updateMethods: Record<keyof T, (...args: any[]) => any> = {}    // 直接更新的原函数
  public wait: number = 320
  public cache: T & {} = {}

  constructor(wait?: number) {
    if (isNumber(wait) && wait > 0) this.wait = wait
    let old = 0;
    this.do = (func, wait) => {
      const isDirectExec = this.rules.length && !this.rules.every(rule => rule())  // 只要一个不符合，则直接更新
      let now = new Date().valueOf();
      if (!isDirectExec && now - old < (wait || this.wait)) return
      old = now
      return func.apply(<object>this)
    }
  }

  /**
   * 直接运行函数
   * */
  public direct(func: Function): this {
    this.do(func, 0)
    return this
  }

  /**
   * 添加规则，每次需要符合所有规则(都返回true)才开启节流, 如果没添加任何规则直接默认开启节流
   * */
  public addRules(rule: Function): this {
    isFunction(rule) && this.rules.push(rule)
    return this
  }

  public addUpdateMethod(name: keyof T, updateMethod: (...args: any[]) => any, wait?: number): this {
    if (isFunction(updateMethod)) {
      this._updateMethods[name] = <any>updateMethod
      this.updateMethods[name] = <any>throttle(updateMethod, isNumber(wait) ? wait : this.wait)
    }
    return this
  }

  /**
   * @param name 名称
   * @param args 传入 addUpdateMethod 所添加回调函数参数的的变量
   * */
  public getCache<Name extends keyof T>(name: Name, ...args: any[]): T[Name] {
    return this.update(name, false, ...args)
  }

  /**
   * @param name 名称
   * @param direct 是否直接更新
   * @param args
   * */
  public update<Name extends keyof T>(name: Name, direct: boolean = false, ...args): T[Name] {
    const fn: Function = direct ? this._updateMethods[name] : this.updateMethods[name]
    let data = fn.apply(null, args)
    return !data ? this.cache[name] : this.cache[name] = data
  }
}

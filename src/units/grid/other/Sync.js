/** 所有的DOM操作都通过这个类进行，保证正常拿到DOM对象 */
export default class Sync {
    static ready = false
    static ins = false
    static timeout = 12000  //  默认timeout时间
    static intervalTime = 50   //  轮询间隔
    constructor() {
        Sync.intervalTime = 10
        const readystatechange = () => {
            Sync.ready = true
            Sync.intervalTime = 50
            document.removeEventListener('readystatechange',readystatechange)
        }
        document.addEventListener('readystatechange',readystatechange)
        // window.onload = () => Sync.ready = true
    }

    /** 接受一个函数或者包含obj = {
     * func : 执行的函数 , 及时空逻辑也必须传
     * callback: 回调函数，回调func的运行结果在 callback 的第一个形参中能拿到
     * rule函数 : 是否执行判断规则，返回 true 表示执行func，false不执行,会一直轮询,直到 timeout或者max条件不符合才退出本次func的运行,
     *          也可以用于轮询中逻辑操作，以更正运行数据
     * timout :  timeout  单位ms
     * max :  轮询的次数 ,
     * intervalTime :  轮询的间隔  ,
     * }的对象，
     * rule@return boolean函数是执行func的判断条件,直到 返回true 才执行
     * */
    static init() {
        if (!Sync.ins) {
            new Sync()
            Sync.ins = true
        }
    }

    static run(obj, ...args) {   // 等待dom加载完成后执行，无返回值
        Sync.init()
        let maxCount = 0
        let timeout = typeof obj["timeout"] === 'number' ? obj["timeout"] : Sync.timeout
        let intervalTime = typeof obj["intervalTime"] === 'number' ? obj["intervalTime"] : Sync.intervalTime
        let doSync = () => {
            let result
            if (typeof obj === "function") result = obj.call(obj, ...args)   // 只传入一个函数的情况
            else if (typeof obj === "object") {  // 对象形式传入
                if (!obj["func"]) throw new Error("func函数必须传入")
                result = obj["func"].call(obj['func'], ...args) || undefined  // 通过rule函数校验或者无rule限制情况正常执行
            }
            if (obj["callback"]) obj["callback"](result)
        }
        let isObeyRule = () => {
            // console.log(Boolean(obj["rule"]));
            if (obj["rule"]) {
                return obj["rule"]()
            }
            return Sync.ready   // 如果已经都准备好了直接就能运行了
        }
        if (isObeyRule()) {
            doSync()
            return true
        }
        let timer = setInterval(() => {
            // 最大次数
            if (typeof obj["max"] === 'number' && obj["max"] < maxCount) {
                clearInterval(timer)
            }
            // 超时停止
            if (timeout < (maxCount * intervalTime)) {
                clearInterval(timer)
            }
            // 符合条件即运行
            if (isObeyRule()) {
                clearInterval(timer)
                doSync()
            }
            maxCount++
        }, intervalTime)
    }
}

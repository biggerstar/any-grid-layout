export function throttle(func, wait = 350) {  // 节流函数：返回的是函数，记得再执行
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

export function debounce(fn, delay) {
    let timer;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(fn, delay);
    }
}

/** 驼峰转短横线  */
export function getKebabCase(str) {
    return str.replace(/[A-Z]/g, function (i) {
        return '-' + i.toLowerCase();
    })
}

/** 从一个新的对象合并到另一个原有对象中且只合并原有存在对象中的值,参数位置和Object.assign一样
 * 和 Object.assign不同的是该方法不会复制两者不同属性到to对象中, 会直接影响到原对象
 * @param {Object} to 接受者
 * @param {Object} from 提供者
 * @param {Boolean} clone 是否浅克隆(浅拷贝)
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


export const cloneDeep = (obj) => {
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

/**  用于将domEvent对象中往root方向最新的的Container解析出来，reverse是最远的靠近root的Container*/
export const parseContainer = (ev, reverse = false) => {
    let container
    if (ev.target._isGridContainer_) {
        container = ev.target._gridContainer_

    } else {
        for (let i = 0; i < ev.path.length; i++) {
            if (ev.path[i]._isGridContainer_) {
                container = ev.path[i]._gridContainer_
                // console.log(ev.path[i]);
                if (!reverse) break
            }
        }
    }
    return container
}

/** 用于将domEvent对象中往root方向最新的的Item解析出来，reverse是最远的靠近root的Item */
export const parseItem = (ev, reverse = false) => {
    let item
    if (ev.target._isGridItem_) {
        item = ev.target._gridItem_
    } else {
        for (let i = 0; i < ev.path.length; i++) {
            if (ev.path[i]._isGridItem_) {
                item = ev.path[i]._gridItem_
                // console.log(ev.path[i]);
                if (!reverse) break
            }
        }
    }
    return item
}

/**  */
export const singleTouchToCommonEvent = (touchEvent) => {
    if (touchEvent.touches && touchEvent.touches.length){
        for(let k in touchEvent.touches[0]){
            if (['target'].includes(k)) continue
            touchEvent[k] = touchEvent.touches[0][k];
        }
    }
    return touchEvent
}

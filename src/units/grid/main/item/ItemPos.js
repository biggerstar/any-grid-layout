import {merge} from "@/units/grid/other/tool.js";

export default class ItemPos {
    el = null
    i = ''
    w = 1
    h = 1
    x = 1
    y = 1
    col = null        //  默认
    row = null        //  默认
    minW = 1          // 栅格倍数
    maxW = Infinity   // 栅格倍数
    minH = 1          // 栅格倍数
    maxH = Infinity   // 栅格倍数
    static = false     // 静态布局模式下指定是否可拖动【只支持静态布局】
    iName = ''
    nextStaticPos = null
    nextStaticPosDemo = {     // 静态布局下用于算法检测是否空位的缓存
        w: 1,
        h: 1,
        x: 1,
        y: 1,
        isNext: false,
        beforeIndex: null,
    }
    beforePos = null   //  跨容器时候保存上一个容器的位置
    __temp__ = {
        _autoOnce: null,  // 静态布局下指定是否自动寻找当前空位,
    }

    constructor(pos) {
        if (typeof pos === 'object') this.update(pos)
    }

    update(pos) {
        // console.log(pos);
        merge(this, this._typeCheck(pos))
        return this
    }

    _typeCheck(pos) {
        Object.keys(pos).forEach((posKey) => {
            if (['w', 'h', 'x', 'y', 'col', 'row', 'minW', 'maxW', 'minH', 'maxH'].includes(posKey)) {
                if (pos[posKey] === Infinity) return
                pos[posKey] = parseInt(pos[posKey])
            }
            if (['static'].includes(posKey)){
                pos[posKey] = pos[posKey]
            }
        })
        // console.log(pos);
        return pos
    }


}

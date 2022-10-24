import {merge} from "@/units/grid/other/tool.js";

export default class ItemPos {
    el = null
    i = ''
    w = 1
    h = 1
    x = null
    y = null
    col = null        //  默认
    row = null        //  默认
    minW = 1          // 栅格倍数
    maxW = Infinity   // 栅格倍数
    minH = 1          // 栅格倍数
    maxH = Infinity   // 栅格倍数
    static = false
    constructor(pos) {
        if (typeof pos === 'object') this.update(pos)
    }
    update(pos){
        // console.log(pos);
        merge(this,this._typeCheck(pos))
        return this
    }

    _typeCheck(pos){
        Object.keys(pos).forEach((posKey)=>{
            if (['w','h','x','y','col','row','minW','maxW','minH','maxH'].includes(posKey)){
                if (pos[posKey] === Infinity) return
                pos[posKey] = parseInt(pos[posKey])
            }
        })
        // console.log(pos);
        return pos
    }



}

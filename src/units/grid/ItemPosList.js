import ItemPos from "@/units/grid/ItemPos.js";

export default class ItemPosList {
    data = []
    i = 0  // 和Item的i一样一一对应
    constructor(data = []) {
        data.forEach(pos => {
            this.createPos(pos)
        })
    }

    /** 根据当前的 i 获取对应的ItemPos */
    index(indexVal) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].i === indexVal) return this.data[i]
        }
        return  null
    }

    len(){
        return this.data.length
    }

    getPosList() {
        return this.data
    }

    /** 创建一个pos对象， */
    createPos(pos) {
        const itemPos = new ItemPos(pos)
        if (itemPos.static === true) this.data.unshift(itemPos)
        else this.data.push(itemPos)
        // console.log(itemPos);
        return itemPos
    }

    removePos(pos) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === pos) this.data.splice(i, 1);
        }
    }

    clear() {
        this.data = []
    }

    itemToData(items) {
        return items.map((item) => {
            // console.log(item.pos);
            return {
                w: item.pos.w,
                h: item.pos.h,
                i: item.i
            }
        })
    }

    // /** 转成静态优先的data布局数据,如果没转换将可能布局错乱重叠！！
    //  * 原理是将static=true移动到前面先行布局，后面动态成员自行插入
    //  * 如果没转的话可能静态成员指定的位置已经被前面的动态成员占用，会照成重叠
    //  * */
    // toStaticData(){
    //     this.data.map((pos)=>{
    //
    //     })
    //     return data
    // }
}

import { defineStore } from 'pinia'

const useGlobalConfig = defineStore('globalConfig',
    {
        state: () => {
            return {
                defaultConfig: {
                    iconSize:60,
                    layoutConfig:{
                        colNum:12,
                        rowNum:8,
                        rowSizePx:100,  // 行(水平方向 == )矩阵宽度
                        colSizePx:100,  // 列(垂直方向 || )矩阵高度
                        marginRow: 10,  // 水平margin值(上下==)
                        marginColum: 10, // 垂直margin值(左右||)
                        // responsive: false,  // 响应式
                        // preventCollision: true,  //   阻止碰撞检测
                        // verticalCompact: false,  //   是否垂直压缩
                        // isEditMode: true,
                        // horizontallyOffset: 10,
                        // verticalOffset: 10,
                    },
                    layout : {

                    }
                }
            }
        },
        actions:{ }
    })

export default useGlobalConfig

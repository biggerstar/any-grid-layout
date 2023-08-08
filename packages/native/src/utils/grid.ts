

/** 生成 网格布局grid-templates-areas 属性的模板矩阵值  */
export const genGridAreasLayout = (count,colum)=>{
    let areasString = ''
    let prefix = 'a'
    for (let i = 0; i < count; i++) {
        if (i % colum === 0 && i !== 0){
            areasString　=  areasString + `' '`
        }
        areasString = areasString + ` ${prefix + i} `
    }
    return `'${areasString}'`
}


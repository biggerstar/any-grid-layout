export const defaultStyle = {
    containerDefaults :{
        // minWidth: '100px',
        // minHeight: '100px',   // 建议和下面size[1] 值一样
        // width:'100%',
        height: 'auto',
        display: 'block',
        boxSizing: 'border-box',
        backgroundColor: '#2196F3',
        position: 'relative',
        overflow: 'hidden',
        // cursor: 'grab',
    },
    itemDefaults:{
        // height: '100%',
        // width: '100%',
        display:'block',
        overflow: 'hidden',
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    containerStyleConfigField : {
        opacity: '0.3',
        transform: 'scale(1.1)',
    },
    itemDragUp:{
        transform: 'scale(1)',
        pointerEvents: 'auto',
        opacity :'1',
        zIndex: '1',
    },
    gridHandleResize:{
        cursor: 'nw-resize',
        height: '20px',
        width: '20px',
        position: 'absolute',
        bottom: '0',
        right: '0',
        fontSize: '1.3rem',
        fontWeight:'800',
        color:'grey',
        textAlign:'right',
    },
    gridItemCloseBtn:{
        backgroundColor: 'skyblue',
        height: '20px',
        width: '20px',
        position: 'absolute',
        right: '0',
        top: '0',
        innerHTML: `×`,
        fontSize:'1.2rem',
        textAlign:'center',
        lineHeight:'20px',
        cursor : 'pointer',
        borderRadius: '20px'
    }


}

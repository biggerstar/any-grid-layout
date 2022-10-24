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
    handleResize:{
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

}

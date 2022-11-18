export class ContainerOverflowError extends Error {
    name = ContainerOverflowError.name
    message = "getErrAttr=>[name|message] 容器溢出，只有静态模式下会出现此错误,您可以使用error事件函数接收该错误，那么该错误就不会抛出而是将错误传到error事件函数的第二个形参"
}

export default {
    ContainerOverflowError,
}




//--------------其他未抛出异常的error名(通过控制台error)-------------------//
// itemLimitError

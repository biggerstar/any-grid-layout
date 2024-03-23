// noinspection JSUnusedGlobalSymbols

import {getOffsetClientRect, getPerspectiveTransform} from "@/utils";

/**
 * 用于快捷的框架矩阵转换， 支持在 3D 情况下获取任何坐标和应用了矩阵的视图元素之间的关系
 * */
export class MatrixTransform {
  public readonly element: HTMLElement
  public readonly originOffsetPoses: number[][]   //
  public transformOrigin: [number, number]   // 变形原点, 基于页面左上角的位置
  public transformAxisOrigin: [number, number]   // 变形原点, 变形原点即2d平面的坐标轴原点， 基于最初始元素的变形原点
  public matrix: DOMMatrix

  constructor(element: HTMLElement) {
    if (!element) {
      throw new Error('not found transform element.')
    }
    this.matrix = new (WebKitCSSMatrix || DOMMatrix)() as any
    this.element = element
    this.originOffsetPoses = this.getElementOriginPoints()
    this.transformOrigin = [0, 0]
    this.transformAxisOrigin = [0, 0]
  }

  /**
   * 根据元素四个角进行仿射变换获得该元素的矩阵，支持2d 和 3d
   * */
  public updateMatrix(): void {
    const offsetRect = getOffsetClientRect(this.element)
    const elementStyleSheet = getComputedStyle(this.element)
    const transformOriginString = elementStyleSheet.transformOrigin
    const [tox, toy] = <any>transformOriginString.split(' ').map((str: string) => Number(parseFloat(str).toFixed(0)))
    this.transformAxisOrigin = [tox, toy]
    this.transformOrigin = [tox + offsetRect.left, toy + offsetRect.top]
    if (elementStyleSheet.transform && elementStyleSheet.transform !== 'none') {  // 没有使用 transform 的情况下，BFC没有生效，且元素将会是个正矩阵
      const positioningPointElements = MatrixTransform.createPositioningPoints(this.element)  // 创建定位点
      const curPositioningPoints = MatrixTransform.getCurrentPositioningPoints(positioningPointElements)  // 获取当前最新的四个角定位点
      positioningPointElements.forEach((el: HTMLElement) => el.parentElement.removeChild(el))  // 移除临时的定位点
      const from: number[] = this.transformOffsetPoints(this.originOffsetPoses)
      const to: number[] = this.transformOffsetPoints(curPositioningPoints);
      const H: number[] = getPerspectiveTransform(...from, ...to)
      const transform = `matrix3d(${H.join(',')})`
      this.matrix.setMatrixValue(transform)
      // console.log(this.matrix)
      // console.log('\noriginOffsetPoses', this.originOffsetPoses, '\ncurPositioningPoints', curPositioningPoints, '\nfrom', from, '\nto', to)
    }
  }

  /**
   * 坐标转换:
   *    将屏幕中的任意点坐标 --> 当前应用矩阵后的视图元素相对元素左上角的坐标(和 offsetLeft, offsetTop 类似)
   *    注意: 如果使用鼠标事件clientX, clientY 的话, 需要加上window.scrollX 或 window.scrollY
   * @param clientX  在窗口中的距离元素左上角的X坐标
   * @param clientY  在窗口中的距离元素左上角的Y坐标
   * */
  public transformCoordinates(clientX: number, clientY: number) {
    const offsetPointX = clientX - this.transformOrigin[0]
    const offsetPointY = clientY - this.transformOrigin[1]
    const inverseMatrix = this.matrix.inverse()
    // console.log('offset: ', offsetPointX, offsetPointY)
    // console.log(inverseMatrix)
    const point = inverseMatrix.transformPoint({
      x: offsetPointX,
      y: offsetPointY,
    })
    // console.log(point)
    // 计算出鼠标位置在当前矩阵对应于实际显示的视图元素的平面坐标，最后减去坐标轴原点与元素左上角真实偏移的 transformAxisOrigin 值
    let x = (point.x / point.w) + this.transformAxisOrigin[0]
    let y = (point.y / point.w) + this.transformAxisOrigin[1]
    return {
      x,
      y,
    }
  }

  /**
   * 获取元素原来在DOM中未变幻之前的的初始位置
   * */
  public getElementOriginPoints() {
    const rect = getOffsetClientRect(this.element)
    return [
      [rect.left, rect.top],   // 左上角
      [rect.right, rect.top],   // 右上角
      [rect.left, rect.bottom],   // 左下角
      [rect.right, rect.bottom],   // 右下角
    ]
  }

  /**
   * 获取以源元素左上角作为坐标轴原点的其他点的偏移
   * */
  public transformOffsetPoints(poses: number[][]) {
    const result = [];
    for (let k = 0; k < poses.length; k++) {
      let p = poses[k]
      result.push([
        // p[0] - this.originOffsetPoses[0][0],   // 所有的变换都将基于最原始元素位置的左上角进行
        // p[1] - this.originOffsetPoses[0][1],
        p[0] - this.transformOrigin[0],
        p[1] - this.transformOrigin[1]
      ])
    }
    return result
  }

  /**
   * 获取当前实时的四个定位点位置
   * */
  public static getCurrentPositioningPoints(elements: HTMLElement[]) {
    const result = [];
    for (let element of elements) {
      const rect = element.getBoundingClientRect()
      result.push([window.scrollX + rect.x, window.scrollY + rect.y]);
    }
    // console.log(result)
    return result
  }

  /**
   * 为某个元素创建四个定位点
   * */
  public static createPositioningPoints(el: HTMLElement): HTMLElement[] {
    const posNames = ['lt', 'rt', 'lb', 'rb']
    const result = []
    for (const index in posNames) {
      const directionName = posNames[index]
      const point_el = document.createElement("div")
      if (directionName === 'lt') {
        point_el.style.left = `0`
        point_el.style.top = `0`
      }
      if (directionName === 'rt') {
        point_el.style.right = `0`
        point_el.style.top = `0`
      }
      if (directionName === 'lb') {
        point_el.style.left = `0`
        point_el.style.bottom = `0`
      }
      if (directionName === 'rb') {
        point_el.style.right = `0`
        point_el.style.bottom = `0`
      }
      point_el.style.background = 'none'
      point_el.style.height = '0px'
      point_el.style.width = '0px'
      point_el.style.position = 'absolute'
      point_el.classList.add(`point-${directionName}`)
      el.appendChild(point_el)
      result.push(point_el)
    }
    return result
  }
}

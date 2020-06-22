import html2canvas from 'html2canvas'
import Canvas2Image from '@/lib/canvas2image'

// 创建用于绘制的基础canvas画布
function createBaseCanvas(width, height) {
  const canvas = document.createElement('canvas')
  // canvas.width = width * scale
  // canvas.height = height * scale
  // 不需要scale因为在页面head已经设置过
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  // 关闭抗锯齿
  context.mozImageSmoothingEnabled = false
  context.webkitImageSmoothingEnabled = false
  context.msImageSmoothingEnabled = false
  context.imageSmoothingEnabled = false
  // context.scale(scale, scale)
  return canvas
}

// 生成快照
function convertToImage(container, options = {}) {
  // 设置放大倍数
  // const scale = window.devicePixelRatio
  // 传入节点原始宽高
  const width = container.offsetWidth
  const height = container.offsetHeight
  // 创建用于绘制的基础canvas画布
  const canvas = createBaseCanvas(width, height)
  // html2canvas配置项
  const ops = {
    scale: 1,
    width,
    height,
    canvas,
    useCORS: true,
    allowTaint: false,
    ...options
  }
  return html2canvas(container, ops).then(canvas => {
    // 下载图片
    // Canvas2Image.saveAsPNG(canvas, canvas.width, canvas.height)
    // 返回base64
    return Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height)
  })
}

export default {
  convertToImage
}

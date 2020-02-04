<template>
  <div class="ocx"/>
</template>

<script>

export default {
  name: 'OCX',
  data() {
    return {
      // 超时时间（毫秒）
      dwWaitTime: 10000,
      // 0:USB,2:COM2,3:COM3,4:COM4,5:COM5
      device: 0
    }
  },
  computed: {
  },
  mounted() {
    this.creatObject()
  },
  methods: {
    // 创建设备对象
    creatObject() {
      const has = document.getElementById('fpDevObj')
      // 已经存在那就不创建了
      if (!has) {
        const target = document.createElement('OBJECT')
        target.setAttribute('id', 'fpDevObj')
        target.setAttribute('classid', 'CLSID:0B6CD28F-5650-4FC9-877D-F8398F5A656F')
        target.setAttribute('codebase', 'mxCapacitiveDriver.ocx')
        target.setAttribute('width', '0')
        target.setAttribute('height', '0')
        const body = document.getElementsByTagName('body')[0]
        body.appendChild(target)
      }
    },
    // 获取当前路径
    getCurrentDirectory() {
      // const locHref = location.href
      // const locArray = locHref.split('/')
      // delete locArray[locArray.length - 1]
      // const dirTxt = locArray.join('//')
      // const temp = dirTxt.substring(11)
      // let newTemp = ''
      // // 需要过滤空格%20 UNICODE显示
      // for (let i = 0; i < temp.length; i++) {
      //   if (temp.substr(i, 3) === '%20') {
      //     newTemp = newTemp + ' '
      //     i = i + 2
      //   } else {
      //     newTemp = newTemp + temp.substr(i, 1)
      //   }
      // }
      return 'C://'
    },
    // 设备开启状态码
    isSuccess(tmp) {
      const varOpenDeviceFailed = '打开设备失败'
      const varCancel = '取消'
      const varTimeout = '超时'
      const varReadImageFailed = '采集失败'
      const varUpImageFailed = '上传失败'
      const varGetTzFailed = '提取特征失败'
      const varGetMbFailed = '合并模板失败'
      const varParameterIllegal = '参数非法'
      const varIsGettingImage = '已经在采集图像'
      if (tmp === '-1') {
        this.$emit('onerror', varOpenDeviceFailed)
        return -1
      } else if (tmp === '-2') {
        this.$emit('onerror', varCancel)
        return -2
      } else if (tmp === '-3') {
        this.$emit('onerror', varTimeout)
        return -3
      } else if (tmp === '-4') {
        this.$emit('onerror', varReadImageFailed)
        return -4
      } else if (tmp === '-5') {
        this.$emit('onerror', varUpImageFailed)
        return -5
      } else if (tmp === '-6') {
        this.$emit('onerror', varGetTzFailed)
        return -10
      } else if (tmp === '-7') {
        this.$emit('onerror', varGetMbFailed)
        return -10
      } else if (tmp === '-10') {
        this.$emit('onerror', varParameterIllegal)
        return -10
      } else if (tmp === '-11') {
        this.$emit('onerror', varIsGettingImage)
        return -11
      } else {
        return 0
      }
    },
    // 获取指纹图像
    getZhiWenTuXiang() {
      let text = ''
      let imgUrl = ''
      if (this.device === 0) {
        const img1 = window.fpDevObj.GetImage(this.device, this.dwWaitTime)
        if (this.isSuccess(img1) === 0) {
          text = img1
          const curPath = this.getCurrentDirectory()
          window.fpDevObj.ImageToBmpFile(curPath + 'Img.bmp', img1)
          imgUrl = curPath + 'Img.bmp'
        }
      } else {
        this.$emit('onerror', '串口不支持采集图像')
      }
      return {
        text,
        imgUrl
      }
    },
    // 获取指纹模板
    getZhiWenMuBan() {
      let text = ''
      const imgUrlList = ['', '', '']
      let zhiWenMuBan = 0
      if (this.device === 0) {
        zhiWenMuBan = window.fpDevObj.GetTemplate(this.device, this.dwWaitTime)
        if (this.isSuccess(zhiWenMuBan) === 0) {
          const curPath = this.getCurrentDirectory()
          // 图片1
          const mbImg1 =	window.fpDevObj.GetTemplateImage(1)
          window.fpDevObj.ImageToBmpFile(curPath + 'ImgMb1.bmp', mbImg1)
          imgUrlList[0] = curPath + 'ImgMb1.bmp'
          // 图片2
          const mbImg2 =	window.fpDevObj.GetTemplateImage(2)
          window.fpDevObj.ImageToBmpFile(curPath + 'ImgMb2.bmp', mbImg2)
          imgUrlList[1] = curPath + 'ImgMb2.bmp'
          // 图片3
          const mbImg3 =	window.fpDevObj.GetTemplateImage(3)
          window.fpDevObj.ImageToBmpFile(curPath + 'ImgMb3.bmp', mbImg3)
          imgUrlList[2] = curPath + 'ImgMb3.bmp'
          text = zhiWenMuBan
        }
      } else {
        zhiWenMuBan = window.fpDevObj.GetComTemplate(this.device, this.dwWaitTime)
        if (this.isSuccess(zhiWenMuBan) === 0) {
          text = zhiWenMuBan
        }
      }
      return {
        text,
        imgUrlList
      }
    },
    // 获取指纹特征
    getZhiWenTezheng() {
      let text = ''
      let imgUrl = ''
      let zhiWenTeZheng = 0
      if (this.device === 0) {
        zhiWenTeZheng = window.fpDevObj.GetFeature(this.device, this.dwWaitTime)
        if (this.isSuccess(zhiWenTeZheng) === 0) {
          const curPath = this.getCurrentDirectory()
          const tzImg =	window.fpDevObj.GetFeatureImage()
          window.fpDevObj.ImageToBmpFile(curPath + 'ImgTz.bmp', tzImg)
          imgUrl = curPath + 'ImgTz.bmp'
          text = zhiWenTeZheng
        }
      } else {
        zhiWenTeZheng = window.fpDevObj.GetComFeature(this.device, this.dwWaitTime)
        if (this.isSuccess(zhiWenTeZheng) === 0) {
          text = zhiWenTeZheng
        }
      }
      return {
        text,
        imgUrl
      }
    },
    // 指纹比对
    getMatch(zhiWenMuBan, zhiWenTeZheng) {
      if (!zhiWenTeZheng) {
        this.$emit('onerror', '请先获取指纹特征')
        return
      }
      if (!zhiWenMuBan) {
        this.$emit('onerror', '请先获取指纹模板')
        return
      }
      return window.fpDevObj.FingerMatch(zhiWenMuBan, zhiWenTeZheng, 3)
    },
    // 获取设备版本
    getDevVer() {
      if (this.device === 0) {
        return window.fpDevObj.GetDevVersion(this.device)
      } else {
        return window.fpDevObj.GetComDevVersion(this.device)
      }
    },
    // 获取库版本
    getOcxVer() {
      return window.fpDevObj.GetOcxVersion()
    },
    // 获取算法版本
    getAlgVer() {
      return window.fpDevObj.GetAlgVersion()
    }
  }
}
</script>


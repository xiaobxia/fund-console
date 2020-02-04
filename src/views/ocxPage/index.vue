<template>
  <div class="app-container">
    <o-c-x ref="ocx" @onerror="errorHandler"/>
    <div>
      <el-button @click="getZhiWenTuXiang">获取指纹图像</el-button>
      <el-button @click="getZhiWenMuBan">获取指纹模板</el-button>
      <el-button @click="getZhiWenTezheng">获取指纹特征</el-button>
      <el-button @click="getMatch">指纹比对</el-button>
      <el-button @click="getDevVer">获取设备版本</el-button>
      <el-button @click="getOcxVer">获取库版本</el-button>
      <el-button @click="getAlgVer">获取算法版本</el-button>
    </div>
    <div>
      <div>{{ text }}</div>
      <div>
        <p>模板</p>
        <div>{{ zhiWenMuBan }}</div>
        <img v-for="(item, index) in imgList" v-if="item" :key="index" :src="item" alt="">
      </div>
      <div>
        <p>特征</p>
        <div>{{ zhiWenTezheng }}</div>
        <img v-if="imgUrl" :src="imgUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import OCX from '@/components/OCX'

export default {
  name: 'OCXPage',
  components: { OCX },
  data() {
    return {
      text: '',
      imgUrl: '',
      zhiWenMuBan: '',
      zhiWenTezheng: '',
      imgList: []
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    errorHandler(text) {
      this.$message({
        message: text,
        type: 'error',
        duration: 5 * 1000
      })
    },
    getZhiWenTuXiang() {
      const res = this.$refs.ocx.getZhiWenTuXiang()
      this.text = res.text
      this.imgUrl = res.imgUrl
    },
    getZhiWenMuBan() {
      const res = this.$refs.ocx.getZhiWenMuBan()
      this.zhiWenMuBan = res.text
      this.imgList = res.imgUrlList
    },
    getZhiWenTezheng() {
      const res = this.$refs.ocx.getZhiWenTezheng()
      this.zhiWenTezheng = res.text
      this.imgUrl = res.imgUrl
    },
    getMatch() {
      const res = this.$refs.ocx.getMatch(this.zhiWenMuBan, this.zhiWenTezheng)
      if (res === 0) {
        alert('通过')
      } else if (res) {
        alert(res)
      }
    },
    getAlgVer() {
      alert(this.$refs.ocx.getAlgVer())
    },
    getOcxVer() {
      alert(this.$refs.ocx.getOcxVer())
    },
    getDevVer() {
      alert(this.$refs.ocx.getDevVer())
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

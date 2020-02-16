<template>
  <div class="app-container">
    <el-alert
      title="主页"
      type="success"/>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
    console.log(this.$route)
    console.log(this.$router)
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

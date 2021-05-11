<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
    title="编辑">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="名称" prop="name">
        <div>{{ form.name }}</div>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <div>{{ form.code }}</div>
      </el-form-item>
      <el-form-item label="usdt添加">
        <el-input
          v-model="usdt"
          maxlength="200"
          placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="初始usdt数量" prop="usdt">
        <div>{{ usdtNew }}</div>
      </el-form-item>
      <el-form-item label="剩余usdt数量" prop="now_usdt">
        <div>{{ nowUsdtNew }}</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button :loading="loading" type="primary" @click="okHandler">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
function createForm(tar) {
  let raw = {
    name: '',
    code: '',
    usdt: '',
    now_usdt: '',
    frequency: '',
    status: 0
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'AddUsdtDialog',
  data() {
    return {
      dialogVisible: false,
      form: createForm(),
      rules: {
      },
      usdt: '',
      loading: false
    }
  },
  computed: {
    usdtNew() {
      return this.$parseValue(this.form.usdt) + this.$parseValue(this.usdt)
    },
    nowUsdtNew() {
      return this.$parseValue(this.form.now_usdt) + this.$parseValue(this.usdt)
    }
  },
  created() {
  },
  methods: {
    open(row) {
      this.usdt = ''
      this.form = createForm(row)
      this.dialogVisible = true
    },
    okHandler() {
      this.$http.post('btbIndex/updateBtbIndex', {
        _id: this.form._id,
        usdt: this.usdtNew,
        now_usdt: this.nowUsdtNew
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功！'
        })
        this.dialogVisible = false
        this.loading = false
        this.$emit('ok')
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

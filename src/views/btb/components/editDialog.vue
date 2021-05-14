<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
    title="编辑">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          maxlength="200"
          placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="form.code"
          maxlength="200"
          placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="频率" prop="frequency">
        <el-select
          v-model="form.frequency"
          style="width: 100%"
        >
          <el-option value="H" label="小时"/>
          <el-option value="D" label="天"/>
        </el-select>
      </el-form-item>
      <el-form-item label="禁用/启用" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="买策略" prop="buy_status">
        <el-radio-group v-model="form.buy_status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="卖策略" prop="sell_status">
        <el-radio-group v-model="form.sell_status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="占比" prop="proportion">
        <el-input
          v-model="form.proportion"
          maxlength="200"
          placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="条件买策略" prop="condition_buy_status">
        <el-radio-group v-model="form.condition_buy_status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="条件买数量" prop="condition_buy_number">
        <el-radio-group v-model="form.condition_buy_number">
          <el-radio :label="0.5">1/2</el-radio>
          <el-radio :label="1">1</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="条件卖策略" prop="condition_sell_status">
        <el-radio-group v-model="form.condition_sell_status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="条件卖数量" prop="condition_sell_number">
        <el-radio-group v-model="form.condition_sell_number">
          <el-radio :label="0.5">1/2</el-radio>
          <el-radio :label="1">1</el-radio>
        </el-radio-group>
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
    status: 0,
    buy_status: 0,
    sell_status: 0,
    condition_buy_status: 0,
    condition_sell_status: 0,
    condition_buy_number: 1,
    condition_sell_number: 1
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'EditDialog',
  data() {
    return {
      dialogVisible: false,
      form: createForm(),
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        proportion: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {},
  created() {
  },
  methods: {
    open(row) {
      this.form = createForm(row)
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'btbIndex/addBtbIndex'
          if (this.form._id) {
            url = 'btbIndex/updateBtbIndex'
          }
          this.$http.post(url, {
            ...this.form
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
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

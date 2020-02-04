<template>
  <div class="roles-container page-wrap">
    <div class="filter-wrap">
      <span class="f-label">角色状态</span>
      <el-select v-model="state" placeholder="" popper-class="ad-el" @change="reQueryList">
        <el-option
          :value="2"
          label="全部"/>
        <el-option
          :value="0"
          label="启动"/>
        <el-option
          :value="1"
          label="停用"/>
      </el-select>
      <div class="right">
        <el-input
          v-model="searchText"
          class="has-right"
          placeholder="角色编码/名称"
          suffix-icon="el-icon-search"
          @change="reQueryList"
        />
        <el-button type="primary" class="admin-t-btn" @click="addHandler">新增</el-button>
        <el-button type="primary" class="admin-t-btn" @click="editHandler">修改</el-button>
        <el-button type="primary" class="admin-t-btn" @click="deleteHandler">删除</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        prop="roleId"
        label="序号"
        width="80"/>
      <el-table-column
        prop="roleCode"
        label="角色编码"/>
      <el-table-column
        prop="roleName"
        label="角色名称"/>
      <el-table-column
        label="角色状态">
        <template slot-scope="scope">
          <span>
            <i v-if="scope.row.status===1" class="el-icon-error table-icon"/>
            <i v-else class="el-icon-success table-icon"/>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"/>
    </el-table>
    <div class="pageing">
      <el-pagination
        :current-page.sync="current"
        :page-size="10"
        :total="total"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :visible.sync="dialogVisible" :destroy-on-close="true" :title="dialogType==='add'?'新增':'修改'">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="必填,15个汉字内"/>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="必填,10位任意字符"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" :rows="2" type="textarea" placeholder="选填,30个汉字内"/>
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio v-model="form.status" :label="0">启用</el-radio>
          <el-radio v-model="form.status" :label="1">停用</el-radio>
        </el-form-item>
        <div slot="footer" class="dialog-footer">
          <el-button class="admin-c-btn" @click="cancelHandler">取消</el-button>
          <el-button type="primary" class="admin-t-btn" @click="saveHandler">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
function createFormKey(tar) {
  let raw = {
    roleName: '',
    roleCode: '',
    remark: '',
    status: 0
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}
export default {
  name: 'Roles',
  data() {
    return {
      searchText: '',
      state: 2,
      total: 0,
      current: 1,
      dialogVisible: false,
      dialogType: 'add',
      form: createFormKey(),
      rules: {
        roleName: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 15, message: '15个汉字内', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 10, max: 10, message: '10位任意字符', trigger: 'blur' }
        ],
        remark: [
          { max: 30, message: '30个汉字内', trigger: 'blur' }
        ]
      },
      tableData: []
    }
  },
  computed: {
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.queryList()
    },
    queryList() {
    },
    reQueryList() {
      this.current = 1
      this.tableData = []
      this.queryList()
    },
    handleCurrentChange() {
      this.queryList()
    },
    handleSelectionChange() {
    },
    cancelHandler() {
      this.dialogVisible = false
      this.resetForm()
    },
    resetForm() {
      this.form = createFormKey()
    },
    addHandler() {
      this.resetForm()
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    deleteHandler() {
    },
    editHandler() {
    },
    toEdit() {
    },
    saveHandler() {
    }
  }
}
</script>

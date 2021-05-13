<template>
  <el-card v-loading="tableLoading" class="box-card-body">
    <div>
      <el-form ref="form" :model="searchForm" size="small">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input
              v-model="searchForm.code"
              style="width: 100%"
              class="enter-item"
              placeholder="请输入关键词"
              size="small"
            />
          </el-col>
          <el-col :span="4">
            <el-button size="small" type="primary" @click="reQueryList">查询</el-button>
            <el-button size="small" type="primary" @click="addNew">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :border="true"
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 220px)"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        align="center"
        label="编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="频率">
        <template slot-scope="scope">
          <span>{{ scope.row.frequency === 'H' ? '小时' : '天' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">开启</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="占比">
        <template slot-scope="scope">
          <span>{{ scope.row.proportion }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="买状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.buy_status === 1" type="success">开启</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="卖状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sell_status === 1" type="success">开启</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="150"
        label="时间">
        <template slot-scope="scope">
          <span>{{ $formatToDateTime(scope.row.create_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addNew(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
          <!--<el-button type="text" @click="addUsdt(scope.row)">增加usdt</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px;text-align: right">
      <pagination :page="current" :limit="size" :total="total" @pagination="paginationChange"/>
    </div>
    <edit-dialog ref="editDialog" @ok="reQueryList"/>
    <add-usdt-dialog ref="addUsdtDialog" @ok="reQueryList"/>
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import EditDialog from './components/editDialog'
import AddUsdtDialog from './components/addUsdtDialog'

function createSearchForm(tar) {
  let raw = {
    'code': ''
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'InfoFlow',
  components: {
    AddUsdtDialog,
    Pagination,
    EditDialog
  },
  data() {
    return {
      searchForm: createSearchForm(),
      tableData: [],
      current: 1,
      size: 10,
      total: 0,
      multipleSelection: [],
      tableLoading: false
    }
  },
  computed: {
  },
  created() {
    this.reQueryList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    paginationChange(info) {
      this.current = info.page
      this.size = info.limit
      this.queryList()
    },
    reQueryList() {
      this.current = 1
      this.queryList()
    },
    queryList() {
      this.tableLoading = true
      this.$http.get('btbIndex/getBtbIndexByPage', {
        current: this.current,
        pageSize: this.size,
        ...this.searchForm
      }).then((res) => {
        const data = res.data || {}
        this.total = parseInt(data.page.total || 0) || 0
        this.tableData = data.list || []
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    addNew(row) {
      this.$refs.editDialog.open(row || {})
    },
    addUsdt(row) {
      this.$refs.addUsdtDialog.open(row || {})
    },
    deleteRow(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('btbIndex/deleteBtbIndex', {
          _id: row._id
        }).then(({ message }) => {
          this.$message.success('成功')
          this.reQueryList()
        })
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

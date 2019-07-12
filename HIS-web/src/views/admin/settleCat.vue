<template>
  <div class="app-container">
    <!--搜索功能 -->
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.id" placeholder="编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-input v-model="listQuery.name" placeholder="结算类别名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索结算类别
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
        新增结算类别
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出结算类别
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-download" @click="handleSomeDelete">
        批量删除
      </el-button>
    </div>
    <!--结算类别列表 -->
    <el-table v-loading="listLoading" :data="depList" style="width: 100%;margin-top:30px;" border @selection-change="changedep">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" align="center" label="编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算类别" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
   
    <el-dialog :visible.sync="dialogVisible" width="500px" :title="dialogType==='edit'?'修改结算类别信息':'新增结算类别'" @close="getDeplist">
      <el-form ref="depart" :model="depart" label-width="80px"  label-position="left" :rules="rules">
        <el-form-item label="结算类别" prop="name">
          <el-input v-model="depart.name" placeholder="结算类别" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDep('depart')">确认</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDeplist" />
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getSettleCatlist,getAllSettleCat,createSettleCat,deleteSettleCat,updateSettleCat } from '@/api/admin'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Promise } from 'q';

const defaultDepart = {
  id:'',
  code: '',
  name: '',
}

export default {
  components: {Pagination},
  data() {
    return {
      SettleCatList:[],
      SettleCat:{},
      depart: Object.assign({},defaultDepart),
      depList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      deptype:[1,2,3,4],
      total: 0,
      listLoading: true,
      allCatId:[],
      allDep:[],
      allType:[],
      listQuery: {
        id: '',
        code: '',
        name: '',
        status:'',
        page: 1,
        limit: 20
      },
      downloadLoading: false,
      rules:{
        name:[
          {required: true, message: '请输入结算类别名称',trigger: 'blur'}
        ]
      },
      deplistref:[]
    }
  },
  computed: {

  },
  created() {
    // Mock: get all routes and roles list from server
    this.getDeplist()
  },
  methods: {
    async getDeplist() {
      this.listLoading = true
      const response = await getSettleCatlist(this.listQuery)
      console.log(response)
      this.depList = response.data.list
      this.total = response.data.total
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getDeplist()
    },
    handleAdd() {
      this.resetTemp()
      this.dialogType = 'new'
      this.dialogVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs['depart'].clearValidate()
      })
    },
    handleEdit(row) {
      this.resetTemp()
      this.depart = Object.assign({}, row) // copy obj
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs['depart'].clearValidate()
      })
    },
    resetTemp() {
      this.depart.id=''
      this.depart.name=''
      this.depart.catId=''
      this.depart.code=''
      this.depart.type=''
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    changedep(val){
      this.deplistref=val;
    },
    handleSomeDelete(){
      this.$confirm('确认删除选中结算类别?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
      let delsom =''
      for(let i=0;i<this.deplistref.length;i++){
        if(i!==this.deplistref.length-1)
          delsom=delsom+(this.deplistref[i].id)+','
        else
          delsom=delsom+(this.deplistref[i].id)
      }

      console.log(delsom)
      deleteSettleCat(delsom).then(res=>{
      this.$notify({
        title: '成功',
        message: res.message,
        type: 'success',
        duration: 2000
      })
            this.getDeplist()
      }
      )
      })
    }
    ,
    handleDelete(row) {
      this.$confirm('确认删除当前结算类别?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
      deleteSettleCat(row.id).then(res=>{
        this.$notify({
        title: '成功',
        message: '已删除该结算类别',
        type: 'success',
        duration: 2000
      })
      this.getDeplist()
      })
      })
    },
    async handleDownload() {
      let res = await getAllSettleCat()
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '结算类别名']
        const filterVal = ['id', 'name']
        const data = this.formatJson(filterVal, res.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '结算类别'
        })
        this.downloadLoading = false
      })
    },
    async confirmDep(formName){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          const isEdit = this.dialogType === 'edit'
          this.listLoading=true
          if(isEdit){
            console.log(this.depart.id)
            updateSettleCat(this.depart).then(res=>{
                this.getDeplist()
                this.$notify({
                title: '成功',
                message: '已修改该结算类别',
                type: 'success',
                duration: 2000
              })
            })
            this.dialogVisible=false
          }else{
            createSettleCat(this.depart).then(res=>{
              this.getDeplist()
              this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.dialogVisible=false
            })
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
body .el-table th.gutter{
display: table-cell!important;
}
</style>


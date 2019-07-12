<template>
  <div class="app-container">
    <!-- 挂号级别 -->
    <!--搜索功能 -->
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="号别编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="号别名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索号别
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
        新增号别
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出号别
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-download" @click="handleSomeDelete">
        批量删除
      </el-button>
    </div>
    <!--号别列表 -->
    <el-table v-loading="listLoading" :data="regList" style="width: 100%;margin-top:30px;" border @selection-change="changedep">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" align="center" label="号别编码" width="220">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="号别名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="挂号费" width="220">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示顺序号">
        <template slot-scope="scope">
          {{ scope.row.seqNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
   
    <el-dialog :visible.sync="dialogVisible" width="500px" :title="dialogType==='edit'?'修改号别信息':'新增号别'" @close="getReglist">
      <el-form ref="reg" :model="reg" label-width="80px"  label-position="left" :rules="rules">
        <el-form-item label="号别编号" prop="code">
          <el-input v-model="reg.code" placeholder="编号" />
        </el-form-item>
        <el-form-item label="号别名称" prop="name">
          <el-input v-model="reg.name" placeholder="号别名称" />
        </el-form-item>
        <el-form-item label="挂号费" prop="price">
          <el-input v-model="reg.price" placeholder="号别名称" />
        </el-form-item>
        <el-form-item label="顺序号" prop="seqNo">
          <el-select v-if="dialogType==='edit'"  v-model="reg.seqNo" placeholder="号别类别" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in total" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select v-if="dialogType!=='edit'"  v-model="reg.seqNo" placeholder="号别类别" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in total+1" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDep('reg')">确认</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getReglist" />
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import {getReglist,getAllReg,createReg,deleteReg,updateReg} from '@/api/admin'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Promise } from 'q';

const defaultDepart = {
  id:'',
  code: '',
  catId: '',
  name: '',
  type: ''
}

export default {
  components: {Pagination},
  data() {
    return {
      regList:[],
      reg:{},
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      listLoading: true,
      listQuery: {
        code: '',
        name: '',
        price: '',
        seqNo: '',
        status: '',
        page: 1,
        limit: 20
      },
      reglistref:[],
      downloadLoading: false,
      rules:{
        code:[
          {required: true, message: '请输入号别编码',trigger: 'blur'}
        ],
        name:[
          {required: true, message: '请输入号别名称',trigger: 'blur'}
        ],
        price:[
          {required: true, message: '请输入挂号费',trigger: 'blur'}
        ],
        seqNo:[
          {required: true, message: '请选择显示顺序号',trigger: 'blur'}
        ],
        status:[
          {required: true, message: '请设置状态',trigger: 'blur'}
        ]
      },
      allReg:[]
    }
  },
  computed: {

  },
  created() {
    this.getReglist()
  },
  methods: {
    async getReglist() {
      this.listLoading = true
      const response = await getReglist(this.listQuery)
      this.regList = response.data.list
      this.total = response.data.total
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getReglist()
    },
    handleAdd() {
      this.resetTemp()
      this.dialogType = 'new'
      this.dialogVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs['reg'].clearValidate()
      })
    },
    handleEdit(row) {
      this.resetTemp()
      this.reg = Object.assign({}, row) // copy obj
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs['reg'].clearValidate()
      })
    },
    resetTemp() {
      this.reg={}
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
      this.reglistref=val;
    },
    handleSomeDelete(){
      this.$confirm('确认删除选中号别?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
      let delsom =''
      for(let i=0;i<this.reglistref.length;i++){
        if(i!==this.reglistref.length-1)
          delsom=delsom+(this.reglistref[i].id)+','
        else
          delsom=delsom+(this.reglistref[i].id)
      }

      console.log(delsom)
      deleteReg(delsom).then(res=>{
      this.$notify({
        title: '成功',
        message: res.message,
        type: 'success',
        duration: 2000
      })
            this.getReglist()
      }
      )
      })
    }
    ,
    handleDelete(row) {
      this.$confirm('确认删除当前号别?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
      deleteReg(row.id).then(res=>{
        this.$notify({
        title: '成功',
        message: '已删除该号别',
        type: 'success',
        duration: 2000
      })
      this.getReglist()
      })
      })
    },
    handleDownload() {
      
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['号别编码', '号别名称', '挂号费', '显示顺序号']
        const filterVal = ['code', 'name', 'price', 'seqNo']
        const data = this.formatJson(filterVal, this.allReg)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '号别目录'
        })
        this.downloadLoading = false
      })
    },
    confirmDep(formName){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          const isEdit = this.dialogType === 'edit'
          this.listLoading=true
          if(isEdit){
            console.log(this.reg)
            updateReg(this.reg).then(res=>{
                this.getReglist()
                this.$notify({
                title: '成功',
                message: '已修改该号别',
                type: 'success',
                duration: 2000
              })
            })
            this.dialogVisible=false
          }else{
            console.log(this.reg)
            createReg(this.reg).then(res=>{
              this.getReglist()
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


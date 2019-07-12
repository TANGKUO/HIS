<template>
  <div class="app-container">
    <!--搜索功能 -->
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="科室编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="科室名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.catId" placeholder="科室分类" clearable style="width: 130px" class="filter-item" filterable>
        <el-option v-for="item in allCatId" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="科室类别" clearable class="filter-item" style="width: 130px" filterable>
        <el-option v-for="item in allType" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
        新增科室
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出科室
      </el-button>
      <el-button type="primary" icon="el-icon-upload2" class="filter-item" @click="uploaddept">导入科室</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-download" @click="handleSomeDelete">
        批量删除
      </el-button>
    </div>
    <!--科室列表 -->
    <el-table v-loading="listLoading" :data="depList" style="width: 100%;margin-top:30px;" border @selection-change="changedep">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" align="center" label="科室编码" width="220">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室分类" width="220">
        <template slot-scope="scope">
          {{ scope.row.catId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室类别" width="220">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" width="500px" :title="dialogType==='edit'?'修改科室信息':'新增科室'" @close="getDeplist">
      <el-form ref="depart" :model="depart" label-width="80px"  label-position="left" :rules="rules">
        <el-form-item label="科室编号" prop="code">
          <el-input v-model="depart.code" placeholder="编号" />
        </el-form-item>
        <el-form-item label="科室名称" prop="name">
          <el-input v-model="depart.name" placeholder="科室名称" />
        </el-form-item>
        <el-form-item label="科室分类" prop="catId">
          <el-select v-model="depart.catId" placeholder="科室分类" clearable style="width: 130px" class="filter-item">
            <el-option v-for="item in allCatId" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室类别" prop="type">
          <el-select v-model="depart.type" placeholder="科室类别" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in allType" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDep('depart')">确认</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDeplist" />
    <el-dialog :visible.sync="uploadVisible" title="上传Excel数据">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getDeplist,getAllDep,createDep,deleteDep,updateDep } from '@/api/department'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
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
  components: {Pagination,UploadExcelComponent},
  
  data() {
    return {
      tableData: [],
      tableHeader: [],
      uploadVisible:false,
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
        catId: '',
        name: '',
        type: '',
        status:'',
        page: 1,
        limit: 20
      },
      downloadLoading: false,
      rules:{
        code:[
          {required: true, message: '请输入科室编码',trigger: 'blur'}
        ],
        name:[
          {required: true, message: '请输入科室名称',trigger: 'blur'}
        ],
        catId:[
          {required: true, message: '请选择科室分类',trigger: 'blur'}
        ],
        type:[
          {required: true, message: '请选择科室类别',trigger: 'blur'}
        ]
      },
      deplistref:[]
    }
  },
  computed: {

  },
  created() {
    Promise.all([
    this.getAllDep(),
    this.getDeplist()
    ])
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      this.tableData.forEach(item=>{
        createDep(item).then(res=>{
          this.getDeplist()
          this.$notify({
          title: '成功',
          message: '成功从Excel导入科室数据',
          type: 'success',
          duration: 2000
        })
          this.uploadVisible = false
        })
      })
      
    },
    uploaddept(){
      this.uploadVisible = true
    },
    async getAllDep(){    
      const response = await getAllDep()
      this.allDep = response.data
      this.allDep.forEach(item=>{
        if(this.allCatId.indexOf(item.catId)===-1){
          this.allCatId.push(item.catId)
        }
        if(this.allType.indexOf(item.type)===-1){
          this.allType.push(item.type)
        }
      })
    },
    async getDeplist() {
      this.listLoading = true
      const response = await getDeplist(this.listQuery)
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
      this.$confirm('确认删除选中科室?', '警告', {
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

      deleteDep(delsom).then(res=>{
        this.$notify({
          title: '成功',
          message: '删除成功',
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
      this.$confirm('确认删除当前科室?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
      deleteDep(row.id).then(res=>{
        this.$notify({
        title: '成功',
        message: '已删除该科室',
        type: 'success',
        duration: 2000
      })
      this.getDeplist()
      })
      })
    },
    handleDownload() {
      this.getAllDep()
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['科室编码', '科室名称', '科室分类', '科室类型']
        const filterVal = ['code', 'name', 'catId', 'type']
        const data = this.formatJson(filterVal, this.allDep)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '科室目录'
        })
        this.downloadLoading = false
      })
    },
    async confirmDep(formName){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          console.log(this.depart)
          const isEdit = this.dialogType === 'edit'
          this.listLoading=true
          if(isEdit){
            console.log(this.depart.id)
            updateDep(this.depart).then(res=>{
                this.getDeplist()
                this.$notify({
                title: '成功',
                message: '已修改该科室',
                type: 'success',
                duration: 2000
              })
            })
            this.dialogVisible=false
          }else{
            createDep(this.depart).then(res=>{
              this.getDeplist()
              this.$notify({
              title: '成功',
              message: '新增科室成功！',
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


<template>
  <div class="app-container">
    <!--搜索功能 -->
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="药品编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="药品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.typeID" placeholder="药品分类" clearable style="width: 130px" class="filter-item" filterable>
        <el-option v-for="item in [{key:'101',label:'西药'},{key:'102',label:'中成药'},{key:'103',label:'中草药'}]" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索药品
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
        新增药品
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出药品
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-download" @click="handleSomeDelete">
        批量删除
      </el-button>
    </div>
    <!--药品列表 -->
    <el-table v-loading="listLoading" :data="drugList" style="width: 100%;margin-top:30px;" border @selection-change="changedep">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" align="center" fixed label="药品编码" width="150">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="药品名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品规格" width="140">
        <template slot-scope="scope">
          {{ scope.row.format }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品单价" width="70">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="包装单位" width="70">
        <template slot-scope="scope">
          {{ scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="生产厂家" width="120">
        <template slot-scope="scope">
          {{ scope.row.manufacturer }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品剂型"> 
        <template slot-scope="scope">
          {{ scope.row.dosage.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品单价">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品类型">
        <template slot-scope="scope">
          <span v-if="scope.row.typeId===101">西药</span>
          <span v-if="scope.row.typeId===102">中成药</span>
          <span v-if="scope.row.typeId===103">中草药</span> 
        </template>
      </el-table-column>
      <el-table-column align="center" label="助记码" width="120">
        <template slot-scope="scope">
          {{ scope.row.mnemonicCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存">
        <template slot-scope="scope">
          {{ scope.row.stock }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="通用名">
        <template slot-scope="scope">
          {{ scope.row.genericName }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
   
    <el-dialog :visible.sync="dialogVisible" width="650px" :title="dialogType==='edit'?'修改药品信息':'新增药品'" @close="getDeplist">
      <el-form ref="depart" :model="drug" label-width="80px"  inline  label-position="left" :rules="rules">
        <el-form-item label="药品编号">
          <el-input v-model="drug.code" placeholder="编号" style="width:350px" />
        </el-form-item>
        <el-form-item label="药品名称">
          <el-input v-model="drug.name" placeholder="药品名称" style="width:350px" />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="drug.manufacturer"  style="width:350px" placeholder="生产厂家" />
        </el-form-item>
        <el-form-item label="药品类型">
          <el-select v-model="drug.typeId" placeholder="药品类型" clearable style="width: 180px" class="filter-item" filterable>
            <el-option v-for="item in [{key:101,label:'西药'},{key:102,label:'中成药'},{key:103,label:'中草药'}]" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="药品规格">
          <el-input v-model="drug.format"  style="width:180px" placeholder="药品规格" />
        </el-form-item>
        <el-form-item label="药品单价">
          <el-input v-model="drug.price"  style="width:180px" placeholder="药品单价" />
        </el-form-item>
        <el-form-item label="包装单位">
          <el-select v-model="drug.unit" placeholder="包装单位" clearable style="width: 130px" class="filter-item" filterable>
            <el-option v-for="item in ['支','瓶','袋','盒','克']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="助记码">
          <el-input v-model="drug.mnemonicCode"  style="width:180px" placeholder="助记码" />
        </el-form-item>
        <el-form-item label="药品剂型">
          <el-select v-model="drug.dosage.id" placeholder="药品剂型" clearable style="width: 130px" class="filter-item" filterable>
            <el-option v-for="item in allDosage" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="通用名">
          <el-input v-model="drug.genericName"  style="width:180px" placeholder="通用名" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="drug.stock"  style="width:180px" placeholder="库存" />
        </el-form-item>
        
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDep('depart')">确认</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getdrugList" />
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import {getdrugList,getAlldrug,updatedrug,deletedrug,createdrug,getAlldosage} from '@/api/drug'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Promise } from 'q';

const defaultDrug = {
  id:'',
  code: '',
  name: '',
  format: '',
  price: '',
  unit: '',
  manufacturer:'',
  dosage:{
    id: '',
  },
  dosageId:'',
  typeID:'',
  mnemonicCode:'',
  stock:'',
  genericName:''
}

export default {
  components: {Pagination},
  data() {
    return {
      drug: Object.assign({},defaultDrug),
      drugList:[],
      allDosage:[],
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
        id:'',
        code: '',
        name: '',
        format: '',
        price: '',
        unit: '',
        manufacturer:'',
        dosage:{},
        typeId:'',
        mnemonicCode:'',
        stock:'',
        genericName:'',
        pageNum: 1,
        pageSize: 20
      },
      downloadLoading: false,
      rules:{
       
      },
      deplistref:[]
    }
  },
  computed: {

  },
  created() {
    // Mock: get all routes and roles list from server
    Promise.all([
    this.getDosage(),
    this.getdrugList()
    ])
  },
  methods: {
    async getDosage(){    
      const response = await getAlldosage()
      this.allDosage = response.data
    },
    async getdrugList() {
      this.listLoading = true
      const response = await getdrugList(this.listQuery)
      this.drugList = response.data.list
      this.total = response.data.total
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.typeId = this.listQuery.typeID
      this.getdrugList()
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
      this.drug = deepClone(row)
      this.drug.typeID = deepClone(row.typeId)
      console.log(this.drug)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs['depart'].clearValidate()
      })
    },
    resetTemp() {
      this.drug = Object.assign({},defaultDrug)
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
      this.$confirm('确认删除选中药品?', '警告', {
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
      deletedrug(delsom).then(res=>{
      this.$notify({
        title: '成功',
        message: res.message,
        type: 'success',
        duration: 2000
      })
      this.getdrugList()
      }
      )
      })
    }
    ,
    handleDelete(row) {
      this.$confirm('确认删除当前药品?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
      deletedrug(row.id).then(res=>{
        this.$notify({
        title: '成功',
        message: '已删除该药品',
        type: 'success',
        duration: 2000
      })
      this.getdrugList()
      })
      })
    },
    handleDownload() {
      getAlldrug().then(res=>{
      let alldrug = res.data
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['索引', '药品编码', '药品名称', '药品规格','药品单价','包装单位','生产厂家','药品类型','拼音助记码','通用名','库存']
        const filterVal = ['id', 'code', 'name', 'format','price','unit','manufacturer','typeId','mnemonicCode','genericName','stock']
        const data = this.formatJson(filterVal, alldrug)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '药品清单'
        })
        this.downloadLoading = false
      })
      })
    },
    async confirmDep(formName){
      this.$refs[formName].validate((valid)=>{
        this.drug.dosageID = this.drug.dosage.id
        this.drug.dosageId = this.drug.dosage.id 
        this.drug.typeID = this.drug.typeId
        if(valid){
          const isEdit = this.dialogType === 'edit'
          this.listLoading=true
          if(isEdit){
            updatedrug(this.drug).then(res=>{
                this.getdrugList()
                this.$notify({
                title: '成功',
                message: '已修改该药品',
                type: 'success',
                duration: 2000
              })
            })
            this.dialogVisible=false
          }else{
            createdrug(this.drug).then(res=>{
              this.getdrugList()
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

</style>


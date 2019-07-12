<template>
    <!-- 非药品模板管理 -->
  <div class="div1">
    <el-container>
    <!--  -->
    <transition name="el-zoom-in-left">

    <el-aside :width="asidewidth" style="margin-top:0;background:white;padding: 0 0 0 0">
          <aside style="height:50px;margin:0 0 0 0">
            <el-tag size="large">非药品模板</el-tag>
            
          </aside>
        <div style="padding: 0 10px 0 10px">
        <el-card v-if="!isaside">
          <el-form style="background:white" :model="listQuery" inline>
            <el-form-item label="模板名称:" style="width:280px">
              <el-input v-model="listQuery.name" placeholder="模板名称"></el-input>
            </el-form-item>
            <el-form-item label="范围:" style="width:280px">
              <el-select placeholder="请选择范围" v-model="listQuery.scope" clearable style="width: 130px" class="filter-item">
               <el-option v-for="item in [{key:0,value:'个人'},{key:1,value:'科室'},{key:2,value:'全院'}]" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="类型:" style="width:280px">
              <el-select placeholder="请选择类型" v-model="listQuery.type" clearable style="width: 130px" class="filter-item">
                <el-option v-for="item in [{key:0,value:'检查'},{key:1,value:'检验'},{key:2,value:'处置'}]" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item style="width:400px">
              <el-button type="primary" @click="searchModel" v-if="!isaside">搜索模板</el-button>
              <el-button type="primary" @click="showaside('add')" v-if="!isaside">新建模板</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <div style="background:white;">
        <el-table v-loading="loading" :data="modelList" stripe border highlight-current-row>
          <el-table-column align="center" label="模板编号" prop="id" width="80">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="模板名称" prop="name">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="模板简介" prop="aim">
            <template slot-scope="scope">
              {{scope.row.aim}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="模版编码" prop="code">
            <template slot-scope="scope">
              {{scope.row.code}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="范围" prop="scope" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.scope===0">个人</span>
              <span v-if="scope.row.scope===1">科室</span>
              <span v-if="scope.row.scope===2">全院</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="模板类型" prop="type"  width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.type===0">检查</span>
              <span v-if="scope.row.type===1">检验</span>
              <span v-if="scope.row.type===2">处置</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="id" width="150px">
            <template slot-scope="scope"> 
              <el-button type="primary" size="mini" @click="editModel(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" @click="deleteModel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
         <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getModelList" />
        </div>
      </div>
    </el-aside>
    </transition>
    <!-- 编辑模板 -->
    <el-main style="padding:0 0 0 0;"  v-if="isaside">
      <el-button type="primary" style="margin-left:30px;margin-top:30px;margin-bottom:30px" v-if="edit" @click="updateModel">提交修改</el-button>
      <el-button type="primary" style="margin-left:30px;margin-top:30px;margin-bottom:30px" v-if="!edit" @click="createModel">新建模板</el-button>
      <el-button type="danger" @click="showaside">取消</el-button>
      <el-form :model="model" label-width="140px" inline>
        <el-form-item label="模板名称">
          <el-input placeholder="请输入模板名称" v-model="model.name" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="模板简介">
          <el-input placeholder="模板简介" v-model="model.aim" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item v-if='edit' label="模板编码">
          <el-input placeholder="模板编码" v-model="model.code" disabled style="width:300px"></el-input>
        </el-form-item>
        <el-form-item v-if='edit'  label="创建时间">
          <el-input placeholder="" v-model="model.createTime"  style="width:300px" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="!edit" label="记录类型">
          <el-select placeholder="请选择类型" v-model="model.type" clearable style="width: 130px" class="filter-item">
              <el-option v-for="item in [{key:0,value:'检查'},{key:1,value:'检验'},{key:2,value:'处置'}]" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-bottom:10px;margin-left:10px" @click="addItem">编辑项目</el-button>
      <el-table style="margin-bottom:50px" :data="nondrugList" stripe border highlight-current-row>
        <el-table-column label="项目编码" prop="code"></el-table-column>
        <el-table-column label="项目名称" prop="name" width="300px"></el-table-column>
        <el-table-column label="项目规格" prop="format"></el-table-column>
        <el-table-column label="项目单价(元)" prop="price"></el-table-column>
        <el-table-column label="所属费用科目" prop="expClassId"></el-table-column>
      </el-table>
    </el-main>
    </el-container>
    <el-dialog title="添加非药品项目" width="800px" :visible.sync="dialogVisible">
      <div style="height:370px">
      <el-transfer
      filterable
      style="width:1000px"
      :titles="['非药品项目','模板内容']"
      filter-placeholder="项目名搜索"
      v-model="choices"
      :data="chonondruglist">
    <span slot-scope="{option}">{{option.name}}</span>
      </el-transfer>
      <el-button type="danger" style="margin-top:20px;margin-left:20px;float:right" @click="dialogVisible=!dialogVisible">取消</el-button>
      <el-button type="primary" style="margin-top:20px;float:right" @click="confirmItem">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getNondrugModelList,updateModel,createModel,deleteModel} from '@/api/nondrugmodel'
import {getAllNondrug} from '@/api/non_drug'
import Pagination from '@/components/Pagination'
import { deepClone,parseTime } from '@/utils'
export default {
    components: {Pagination},
  data(){
    return{
      chonondruglist:[],
      choices:[],
      dialogVisible:false,
      alldrugList:[],
      nondrugList:[],
      edit:0,
      model:{},
      loading:false,
      isaside:false,
      asidewidth:"100%",
      total:0,
      listQuery:{
        nonDrugIdList:'',
        id:'',
        status:1,
        name:'',
        scope:0,
        ownId:this.$store.getters.id,
        aim:'',
        code:'',
        type:'',
        pageSize:20,
        pageNum:1,
        isAdmin:'0'
      },
      modelList:[],
      queryModel:{
        name:'',
        range:'',
        type:''
      }
    }
  },
  created(){
    this.getModelList()
    this.getAllNondrug()
  },
  methods:{
    deleteModel(row){
       this.$confirm('确认删除当前模板?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{      deleteModel(row.id).then(res=>{
        this.getModelList()
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
      })})

    },
    createModel(){
      let data = deepClone(this.model)
      data.status = 1
      data.ownId = this.$store.getters.id
      data.nonDrugIdList = deepClone(this.choices)
      data.scope = 0
      createModel(data).then(res=>{
        this.getModelList()
        this.$notify({
          title: '成功',
          message: '成功创建模板',
          type: 'success',
          duration: 2000
        })
      })
      this.showaside()
    },
    updateModel(){
      let data = deepClone(this.model)
      data.nonDrugIdList = deepClone(this.choices)
      updateModel(data).then(res=>{
        this.getModelList()
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
      })
      this.showaside()
    },
    confirmItem(){
      this.nondrugList = this.alldrugList.filter(item=>{
        if(this.choices.includes(item.id))
          return true
      })
      this.dialogVisible=!this.dialogVisible
    },
    addItem(){
      if(this.model.type===0||this.model.type===1||this.model.type===2){
        this.chonondruglist = this.alldrugList.filter(item=>{
          if(item.recordType===this.model.type+1)
            return true
          return false
        })
        this.dialogVisible = true
        return
      }
      this.getModelList()
        this.$notify({
          title: '警告',
          message: '请先选择类型！',
          type: 'warning',
          duration: 2000
        })
    },
    getAllNondrug(){
      getAllNondrug().then(res=>{
        this.alldrugList = res.data
        this.alldrugList.forEach(item=>{
          item.label = item.name
          item.key = item.id
        })
      })
    },
    async getModelList(){
      getNondrugModelList(this.listQuery).then(res=>{
        this.modelList = res.data.list
        this.total = res.data.total
      })
      
    },
    searchModel(){
      this.loading = true
      this.getModelList()
      this.loading = false
    },
    showaside(type){
      if(this.asidewidth==="100%")
        this.asidewidth="0%"
      else
        this.asidewidth="100%"
      this.isaside=!this.isaside
      if(type==='edit')
        this.edit = 1
      else if(type==='add'){
        this.choices = []
        this.nondrugList = []
        this.model = {}
        this.edit = 0 
      }
      else
        this.edit = 0
    },
    editModel(row){
      this.choices = deepClone(row.nonDrugIdList)
      this.nondrugList = this.alldrugList.filter(item=>{
        if(row.nonDrugIdList.includes(item.id))
          return true
      })
      this.model = deepClone(row)
      this.model.createTime = parseTime(this.model.createTime)
      this.showaside('edit')
    }
  }
}
</script>
<style>
  body .el-table th.gutter{
display: table-cell!important;
}
.el-transfer-panel{
    width: 300px;
}
</style>

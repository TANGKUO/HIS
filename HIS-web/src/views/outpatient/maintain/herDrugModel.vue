<template>
    <!-- 草药模板管理 -->
  <div class="div1">
    <el-container>
    <!--  -->
    <transition name="el-zoom-in-left">

    <el-aside :width="asidewidth" style="margin-top:0;background:white;padding: 0 0 0 0">
          <aside style="height:50px;margin:0 0 0 0">
            <el-tag size="large">药品模板</el-tag>
            
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
              <span v-if="scope.row.type===1">成药模板</span>
              <span v-if="scope.row.type===2">草药模板</span>
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
    <!-- 医生工作台 -->
    <el-main style="padding:0 0 0 0;"  v-if="isaside">
      <el-button type="primary" style="margin-left:30px;margin-top:30px;margin-bottom:30px" v-if="edit" @click="updateModel">提交修改</el-button>
      <el-button type="primary" style="margin-left:30px;margin-top:30px;margin-bottom:30px" v-if="!edit" @click="createModel">新建模板</el-button>
      <el-button type="danger" @click="showaside">取消</el-button>
      <el-form :model="model" label-width="140px" inline>
        <el-form-item label="模板名称">
          <el-input placeholder="请输入模板名称" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="模板简介">
          <el-input placeholder="模板简介" v-model="model.aim"></el-input>
        </el-form-item>
        <el-form-item v-if='edit' label="模板编码">
          <el-input placeholder="模板编码" disabled v-model="model.code"></el-input>
        </el-form-item>
        <el-form-item label="嘱托">
          <el-input v-model="model.medicalAdvice" placeholder="嘱托"></el-input>
        </el-form-item>
        <el-form-item label="治法">
          <el-input v-model="model.therapy" placeholder="治法"></el-input>
        </el-form-item>
        <el-form-item label="用法">
          <el-input v-model="model.frequency" placeholder="用法"></el-input>
        </el-form-item>
        <el-form-item label="付数">
          <el-input v-model="model.pairNum" placeholder="付数"></el-input>
        </el-form-item>
        <el-form-item v-if='edit'  label="创建时间">
          <el-input placeholder="" v-model="model.createTime"  style="width:300px" disabled></el-input>
        </el-form-item>
        <el-form-item label="模板范围">
          <el-select placeholder="请选择范围" v-model="model.scope" clearable style="width: 130px" class="filter-item">
               <el-option v-for="item in [{key:0,value:'个人'},{key:1,value:'科室'},{key:2,value:'全院'}]" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-bottom:10px;margin-left:10px" @click="addItem">编辑项目</el-button>
      <el-table style="margin-bottom:50px" :data="itemdrugList" stripe border highlight-current-row>
        <el-table-column label="药品名" prop="name" width="330px"></el-table-column>
        <el-table-column label="药品规格" prop="format" width="200px"></el-table-column>
        <el-table-column label="药品单价(元)" prop="price" width="70px"></el-table-column>
        <el-table-column label="药品数量" prop="num" width="70px"></el-table-column>
        <el-table-column label="总价" prop="totalprice" width="70px"></el-table-column>
        <el-table-column label="拼音码" prop="mnemonicCode"></el-table-column>
        <el-table-column label="使用建议" prop="medicalAdvice"></el-table-column>
        <el-table-column label="频次" prop="frequency">
          <template slot-scope="scope">
            <span v-if="scope.row.frequency===1">一天一次</span>
            <span v-if="scope.row.frequency===2">一天三次</span>
          </template>
        </el-table-column>
        <el-table-column label="天数" prop="days"></el-table-column>
        <el-table-column label="用量" prop="usageNum"></el-table-column>
        <el-table-column label="单位" prop="usageNumUnit">
          <template slot-scope="scope">
            <span v-if="scope.row.usageNumUnit===1">片</span>
            <span v-if="scope.row.usageNumUnit===2">支</span>
            <span v-if="scope.row.usageNumUnit===3">瓶</span>
            <span v-if="scope.row.usageNumUnit===4">克</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    </el-container>
    <el-dialog title="增加药品" :visible.sync="dialogVisible" width="1500px" top="10px">
        <el-container>
        <el-aside width="30%" style="padding:0 0 0 0;margin:0 0 0 0">
            <el-tag type="primary" style="width:100%;height:30px">药品目录
            <el-button type="primary" size="mini"  style="width: 20px;;float:right"><svg-icon icon-class="search" style="margin-left:-6px"/></el-button>
            <el-input  size="mini" placeholder="药品名称" v-model="searchdrug" style="width:60%;float:right" @change="getdrugList(0)"></el-input>
            </el-tag>
            <el-table :data="drugList" height="500px" @row-click="choosedrug">
              <el-table-column label="药品名" prop="name"></el-table-column>
              <el-table-column label="价格(元)" prop="price" width="100px"></el-table-column>
            </el-table>
            <pagination layout="prev, pager, next" auto-scroll="false" style="margin-top:0px" page-sizes="[]"  v-show="total2>0" :total="total2" :page.sync="page.pageNum" :limit.sync="page.pageSize" @pagination="getdrugList(0)" />
          <div>
          </div>
        </el-aside>
        <el-main>
          <el-tag type="primary">项目金额总计:</el-tag>
          <el-tag type="warning">{{oneprescription.amount}}元</el-tag>
          <el-button type="primary" style="float:right" @click="addDrug">确定</el-button>
          <el-table  height="500px" :data="oneprescription.druglist" cell-style="text-align:center" header-cell-style="text-align:center">
              <el-table-column width="50px">
                <template slot-scope="scope">
                  <el-button type="text" @click="deldrug(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            <el-table-column property="name" label="药品名" width="150"></el-table-column>
            <el-table-column property="format" label="规格" width="200"></el-table-column>
            <el-table-column property="price" label="单价"></el-table-column>
            <el-table-column label="数量" width="130px"> 
              <template slot-scope="scope">
                <el-input-number controls-position="right" style="width:100px" :min="1" :max="100" size="mini" @change="changenum(scope.row)" v-model="scope.row.num"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="剂型" width="130px" prop="dosage.name">
            </el-table-column>
            <el-table-column label="医嘱" width="130">
          <template slot-scope="scope">
            <el-input placeholder="医嘱" v-model="scope.row.medicalAdvice"></el-input>
          </template>  
        </el-table-column>
        <el-table-column label="脚注" width="130">
          <template slot-scope="scope">
            <el-input placeholder="脚注" v-model="scope.row.footnote"></el-input>
          </template>  
        </el-table-column>
        <el-table-column label="频次" width="130px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.frequency" placeholder="" style="width:120px">
              <el-option  v-for="item in [{key:1,label:'一天一次'},{key:2,label:'一天三次'}]" :key="item.key" :label="item.label" :value="item.key" ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="用量" width="100px">
          <template slot-scope="scope">
           <el-input v-model="scope.row.usageNum" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="130px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.usageNumUnit" placeholder="" style="width:120px">
              <el-option  v-for="item in [{key:1,label:'片'},{key:2,label:'支'},{key:3,label:'瓶'},{key:2,label:'克'}]" :key="item.key" :label="item.label" :value="item.key" ></el-option>
            </el-select>
          </template>
        </el-table-column>
          </el-table>
        </el-main>
        </el-container>
      </el-dialog>
  </div>
</template>
<script>
import {listModel,updateModel,createModel,deleteModel} from '@/api/drugmodel'
import {getdrugList,selectById} from '@/api/drug'
import Pagination from '@/components/Pagination'
import { deepClone,parseTime } from '@/utils'
export default {
    components: {Pagination},
  data(){
    return{
      page:{
        pageNum:1,
        pageSize:10,
      },
      oneprescription:{
        name:'',
        druglist:[],
        amount:0,
        status:0,
      },
      itemdrugList:[],
      drugList:[],
      searchdrug:'',
      choices:[],
      dialogVisible:false,
      alldrugList:[],
      nondrugList:[],
      edit:0,
      model:{},
      total2:0,
      loading:false,
      isaside:false,
      asidewidth:"100%",
      total:0,
      listQuery:{
        id:'',
        status:1,
        name:'',
        scope:0,
        ownId:this.$store.getters.id,
        aim:'',
        code:'',
        type:2,
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
  },
  methods:{
    addDrug(){
      this.dialogVisible = false
      this.itemdrugList = this.oneprescription.druglist
      this.itemdrugList.forEach(item=>{
        item.totalprice = Math.floor((item.price*item.num)*100)/100
      })
    },
    async getdrugList(type) {
      let data = {}
      data.pageSize = this.page.pageSize
      data.pageNum = this.page.pageNum
      data.typeId = 103
      data.name = this.searchdrug
      const response = await getdrugList(data)
      this.drugList = response.data.list
      this.total2 = response.data.total
    },
    deldrug(row){
      this.oneprescription.druglist = this.oneprescription.druglist.filter(item=>{
        if(item.id===row.id)
          return false
        return true
      })
      this.oneprescription.amount = 0
      this.oneprescription.druglist.forEach(item=>{
        this.oneprescription.amount += item.price
      })
      this.oneprescription.amount = Math.floor((this.oneprescription.amount+0.5)*100)/100
    },
    choosedrug(val){
      let flag = 1
      this.oneprescription.druglist.forEach(item=>{
        if(item.id===val.id){
          item.num+=1
          flag=0
        }
      })
      if(flag){
        this.oneprescription.amount +=val.price
        this.oneprescription.amount = Math.floor((this.oneprescription.amount+0.5)*100)/100
        this.oneprescription.druglist.push(val)
        this.oneprescription.druglist.forEach(item=>{
          if(item.num===undefined)
            item.num=1
        })
      }
    },
    deleteModel(row){
       this.$confirm('确认删除当前模板?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{      
        deleteModel(row.id).then(res=>{
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
      data.dmsMedicineModelItemList = deepClone(this.itemdrugList)
      data.type = 2
      createModel(data).then(res=>{
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
      this.dialogVisible = true
      this.getdrugList()
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
      listModel(this.listQuery).then(res=>{
        this.modelList = res.data.list
        this.total = res.data.total
        this.modelList.forEach(model=>{
          model.dmsMedicineModelItemList.forEach(item=>{
          selectById(item.id).then(res=>{
            item.name = res.data.name
            item.format = res.data.format
            item.price = res.data.price
            item.totalprice = item.price*item.num
            item.mnemonicCode = res.data.mnemonicCode
            })
          })
          model.createTime = parseTime(model.createTime)
        })
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
        this.itemdrugList = []
        this.model = {}
        this.edit = 0 
      }
      else
        this.edit = 0
    },
    editModel(row){
      this.itemdrugList = row.dmsMedicineModelItemList
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

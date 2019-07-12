<template>
  <!-- 草药处方 -->
  <div>
  <el-container>
  <el-aside :width="mainwidth" style="background:white;padding:0 10px 0 0">
    <aside style="margin:0 0 0 0">
      <el-button type="text" size="medium" @click="addpre"><i class="el-icon-circle-plus-outline"  />新增处方</el-button>
      <el-button type="text" size="medium" @click="deletepre"><i class="el-icon-remove-outline" />删除处方</el-button>
      <el-button type="text" size="medium" @click="apply"><i class="el-icon-circle-check" />开立处方</el-button>
      <el-button type="text" size="medium" @click="invalid"><i class="el-icon-circle-close" />作废处方</el-button>
      <el-button type="text" size="medium" @click="saveDrugPrescription"><i class="el-icon-upload2" />暂存</el-button>
      <el-button type="text" size="medium" @click="getDrugPrescription"><i class="el-icon-download" />取出暂存项</el-button>
      <el-button type="text" size="mini" @click="refresh"><i class="el-icon-refresh" />刷新</el-button>
      <el-button style="float:right" @click="controlfast"><i v-show="!isclose" class="el-icon-caret-right" /><i v-show="isclose" class="el-icon-caret-left" />  </el-button>
    </aside>
    <el-table
    ref="multipleTable"
    :data="prescriptionList"
    tooltip-effect="dark"
    style="width: 100%"
    cell-style="text-align:center"
    header-cell-style="text-align:center"
    @selection-change="handleSelectionChange">
    <el-table-column
      align="center"
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
    align="center"
      label="处方名称">
      <template slot-scope="scope">{{ scope.row.name }}</template>
    </el-table-column>
    <el-table-column
     align="center"
      prop="amount"
      label="总金额(元)">
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.status===-1">未开立</el-tag>
        <el-tag type="success" v-if="scope.row.status===0">已作废</el-tag>
        <el-tag type="success" v-if="scope.row.status===1">未缴费</el-tag>
        <el-tag type="success" v-if="scope.row.status===2">未发药</el-tag>
        <el-tag type="success" v-if="scope.row.status===3">已发药</el-tag>
        <el-tag type="success" v-if="scope.row.status===4">已过期</el-tag>
      </template>
    </el-table-column>
    <el-table-column
    align="center"
      label=""
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-button type="text" v-if="scope.row.status===-1" @click="showDetail(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-aside>
  <transition name="el-zoom-in-left">
  <el-main width="50%" v-show="isclose" style="border-style: dotted;border-width: 0px 0px 0px 1px;border-color:#C0C0C0;margin-top:-12px">
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="草药模板" name="first">
        <el-table :data="models" height="230" @row-click="selectmodel" @row-dblclick="addmodel">
          <el-table-column label="模板名">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="目的">
            <template slot-scope="scope">
              {{scope.row.aim}}
            </template>
          </el-table-column>
        </el-table>
        <el-card v-show="model.name!==undefined" class="box-card" shadow="never" body-style="font-size: 14px;font-family:'微软雅黑';width:350px">
          <div slot="header" class="clearfix">
            <span>{{model.name}}</span>
          </div>
          <p><b>模板目的：</b>{{model.aim}}</p>
          <p><b>模板总金额: </b>{{model.amount}}</p>
          <p><b>模板项目：</b></p>
          <p v-for="(drug,index) in model.druglist" :key="index"><b></b> {{drug.name}}</p>
        </el-card>
     </el-tab-pane>
    </el-tabs>
  </el-main>
  </transition>
  </el-container>
    <el-dialog title="处方详细" :visible.sync="dialogTableVisible" width="1500px" top="20px">
      <el-container>
      <el-aside width="30%" style="padding:0 0 0 0;margin:0 0 0 0">
        <div>
          <el-tag type="primary" style="width:100%">常用药品</el-tag>
          <el-table :data="freqlist" height="200px" @row-click="choosedrug" >
            <el-table-column label="药品名" prop="name">
            </el-table-column>
            <el-table-column label="价格(元)" prop="price" width="100px"></el-table-column>
          </el-table>
        </div>
          <el-tag type="primary" style="width:100%;height:30px">药品目录
          
          <el-button type="primary" size="mini"  style="width: 20px;;float:right"><svg-icon icon-class="search" style="margin-left:-6px"/></el-button>
          <el-input  size="mini" placeholder="药品名称" v-model="searchdrug" style="width:60%;float:right" @change="getdrugList"></el-input>
          </el-tag>
         
          <el-table :data="drugList" height="300px" @row-click="choosedrug">
            <el-table-column label="药品名" prop="name"></el-table-column>
            <el-table-column label="价格(元)" prop="price" width="100px"></el-table-column>
          </el-table>
          <pagination layout="prev, pager, next" auto-scroll="false" style="margin-top:0px" page-sizes="[]"  v-show="total>0" :total="total" :page.sync="page.pageNum" :limit.sync="page.pageSize" @pagination="getdrugList" />
        <div>
        </div>
      </el-aside>
      <el-main>
      
      <el-button type="primary" style="float:right" @click="createpre" v-if="!edit">增加处方</el-button>
      <el-button type="primary" style="float:right" @click="changepre" v-if="edit">修改处方</el-button>
      <el-form inline label-width="100px">
        <el-form-item label="处方名">
          <el-input v-model="oneprescription.name" placeholder="处方名"></el-input>
        </el-form-item>
        <el-form-item label="嘱托">
          <el-input v-model="oneprescription.medicalAdvice" placeholder="嘱托"></el-input>
        </el-form-item>
        <el-form-item label="治法">
          <el-input v-model="oneprescription.therapy" placeholder="治法"></el-input>
        </el-form-item>
        <el-form-item label="用法">
          <el-input v-model="oneprescription.usageMeans" placeholder="用法"></el-input>
        </el-form-item>
        <el-form-item label="付数">
          <el-input v-model="oneprescription.pairNum" placeholder="付数"></el-input>
        </el-form-item>
  
      </el-form>
      
      
      <el-tag type="primary">项目金额总计:</el-tag>
      <el-tag type="warning">{{oneprescription.amount}}元</el-tag>
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
import {getdrugList,selectById} from '@/api/drug'
import Pagination from '@/components/Pagination'
import {apply,listByReg,invalid} from '@/api/outpatient/cprescription'
import {deepClone} from '@/utils'
import {selectByType} from '@/api/outpatient/frequentuse'
import {getDrugPrescription,saveDrugPrescription} from '@/api/outpatient/save'
import {listModel} from '@/api/drugmodel'
const defaultpre={
  name:'',
  druglist:[],
  amount:0,
  status:-1,
}
export default {
   props:['patient'],
   components: {Pagination},
  name:'Prescription',

  data(){
    return{
      modelvisivle:false,
      model:{},
      models:[],
      freqlist:[],
      refs:[],
      prescriptionList:[],
      oneprescription:{
        name:'',
        druglist:[],
        amount:0,
        status:-1,
      },
      edit:false,
      test:'',
      num:0,
      dialogTableVisible:false,
      activeName:'first',
      isclose:true,
      record:{
        main:'test'
      },
      page:{
        pageNum:1,
        pageSize:10,
      },
      searchdrug:'',
      drugList:[],
      total:0,
      mainwidth:"65%",
      activeNames: ['1'],
      data2:[
        {
          date: '0001',
          name: '王小虎1',
          address: '38'
        },
        {
          date: '0002',
          name: '王小虎2',
          address: '39'
        }
      ]
    };
  },
  watch:{
    'patient' : function(newVal, oldVal){
      this.patient = newVal
      this.listByReg()
    },
  },
  created(){
    this.listModel()
  },
  methods:{
        addmodel(val){
      val.amount = Math.floor((val.amount+0.5)*100)/100
      val.status =-1
      this.prescriptionList.push(val)
    },
    selectmodel(val){
      this.model = deepClone(val)
      this.model.amount = Math.floor((this.model.amount+0.5)*100)/100
      this.modelvisivle = true
    },
    listModel(){
      let data = {}
      data.scope = 0
      data.ownId = this.$store.getters.id
      data.type = 2
      data.pageSize = 1000
      data.pageNum = 1
      data.isAdmin = 0
      listModel(data).then(res=>{
        this.models = res.data.list
        this.models.forEach(model=>{
          model.druglist = []
          model.amount = 0
          model.dmsMedicineModelItemList.forEach(item=>{
            let data = {}
            selectById(item.id).then(res=>{
              data = res.data
              data.days = item.days
              data.frequency = item.frequency
              data.medicalAdvice = item.medicalAdvice
              data.medicineUsage = item.medicineUsage
              data.usageMeans = item.usageMeans
              data.usageNum = item.usageNum
              data.usageNumUnit = item.usageNumUnit
              model.amount += (data.price*item.num)
              model.druglist.push(deepClone(data))
            })
          })
          model.amount = Math.floor((model.amount+0.5)*100)/100
        })
      })
    },
    saveDrugPrescription(){
      saveDrugPrescription(this.refs,this.patient.registrationId,5).then(res=>{
        this.$notify({
          title: '成功',
          message: '已暂存选中的草药处方',
          type: 'success',
          duration: 2000
        })
      })
    },
    addfreitem(val){
      this.selectCheck(val)
    },
    getfreqList(){
      let data = {}
      data.staffId = this.$store.getters.id
      data.selectType = 6
      selectByType(data).then(res=>{
        this.freqlist = res.data.drugList.filter(item=>{
          if(item.typeId === 103)
            return true
        })
      })
    },
    refresh(){
      this.$confirm('未开立的处方都将清除,确认刷新?', '刷新', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.listByReg()
        })
    },
    addfreitem(val){
      this.selectCheck(val)
    },
    getfreqList(){
      let data = {}
      data.staffId = this.$store.getters.id
      data.selectType = 6
      selectByType(data).then(res=>{
        this.freqlist = res.data.drugList.filter(item=>{
          if(item.typeId === 103)
            return true
        })
        
      })
    },
    deletepre(){
      let data = this.refs[0].name
      this.prescriptionList=this.prescriptionList.filter(item=>{
        if(item.name===data)
          return false
        return true
      })
    },
    invalid(){
      let data = this.refs[0]
      
      invalid(data.dmsHerbalItemRecordResultList[0].prescriptionId).then(res=>{
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.listByReg()
      })
    },
    async listByReg(){
      listByReg(this.patient.registrationId).then(res=>{
        this.prescriptionList=res.data
      })
    },
    handleSelectionChange(val){
      this.refs = val
    },
    async apply(){
      let data = this.refs[0]
      data.createStaffId = this.$store.getters.id
      data.registrationId = this.patient.registrationId
      data.dmsHerbalItemRecordList = data.druglist
      data.dmsHerbalItemRecordList.forEach(item=>{
        item.drugId = item.id
        item.currentNum = item.num
        item.totalNum = item.num
      })
      apply(data).then(res=>{
         this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.listByReg()
      })
    },
    createpre(){
      this.edit = false
      
      this.prescriptionList.push(this.oneprescription)
      this.dialogTableVisible = false
    },
    changepre(){
      this.dialogTableVisible =false
    },
    changenum(val){
      this.oneprescription.amount=0
      this.oneprescription.druglist.forEach(item=>{
        this.oneprescription.amount+=item.price*item.num
      })
      this.oneprescription.amount = Math.floor((this.oneprescription.amount+0.5)*100)/100
    },
    deldrug(row){
      this.oneprescription.druglist = this.oneprescription.druglist.filter(item=>{
        if(item.id===row.id)
          return false
        return true
      })
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
    async getdrugList() {
      let data = {}
      data.pageSize = this.page.pageSize
      data.pageNum = this.page.pageNum
      data.typeId = 103
      data.status = 1
      data.name = this.searchdrug
      const response = await getdrugList(data)
      this.drugList = response.data.list
      this.total = response.data.total
    },
    addpre(){
      this.getfreqList()
      this.oneprescription = deepClone(defaultpre)
      this.getdrugList()  
      this.dialogTableVisible = true
    },
    showDetail(row){
      this.edit = true
      this.getfreqList()
      this.getdrugList()
      this.oneprescription = row
      this.dialogTableVisible=true
    },
    controlfast(){
      this.isclose=!this.isclose
      if(this.mainwidth==="65%")
        this.mainwidth="80%"
      else
        this.mainwidth="65%"
    }
  }
}
</script>


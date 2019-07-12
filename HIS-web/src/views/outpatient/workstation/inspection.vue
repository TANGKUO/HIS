<template>
  <!-- 检查申请 -->
  <el-container>
  <el-aside :width="mainwidth" style="background:white;padding:0 10px 0 0">
    <aside style="margin:0 0 0 0">
      <el-button type="text" size="medium" @click="addcheck"><i class="el-icon-circle-plus-outline" />新增项目</el-button>
      <el-button type="text" size="medium" @click="delcheck"><i class="el-icon-remove-outline" />删除项目</el-button>
      <el-button type="text" size="medium" @click="apply"><i class="el-icon-circle-check" />开立项目</el-button>
      <el-button type="text" size="medium" @click="invalid"><i class="el-icon-circle-close" />作废项目</el-button>
      <el-button type="text" size="medium" @click="saveNonDrug"><i class="el-icon-upload2" />暂存</el-button>
      <el-button type="text" size="medium" @click="getNonDrug"><i class="el-icon-download" />取出暂存项</el-button>
      <el-button type="text" size="mini" @click="refresh"><i class="el-icon-refresh" />刷新</el-button>
      <el-button style="float:right" @click="controlfast"><i v-show="!isclose" class="el-icon-caret-right" /><i v-show="isclose" class="el-icon-caret-left" />  </el-button>
    </aside>
    <el-tag type="primary">项目金额总计:</el-tag>
    <el-tag type="warning">{{totalprice}} 元</el-tag>
    <el-table
    ref="multipleTable"
    :data="record"
    border
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      align="center"
      type="selection"
      width="55"
      @selection-change="handleSelectionChange">
    </el-table-column>
    <el-table-column
    align="center"
      label="项目编码"
      width="120">
      <template slot-scope="scope">{{ scope.row.code }}</template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="name"
      label="项目名称"
      width="200">
    </el-table-column>
    <el-table-column
    align="center"
      prop="deptName"
      label="执行科室"
      width="120">
    </el-table-column>
    <el-table-column
    align="center"
      prop="format"
      label="单位"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
    align="center"
      prop="price"
      label="单价"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
    align="center"
      label="状态"
      show-overflow-tooltip>
    <template slot-scope="scope">
      <el-tag type="warning" v-if="scope.row.status===-1">未开立</el-tag>
      <el-tag type="danger" v-if="scope.row.status===0">已作废</el-tag>
      <el-tag type="info" v-if="scope.row.status===1">未缴费</el-tag>
      <el-tag type="info" v-if="scope.row.status===2">未登记</el-tag> 
      <el-tag type="info" v-if="scope.row.status===3">已登记</el-tag>
      <el-tag type="success" v-if="scope.row.status===4">已执行</el-tag>  
      <el-tag type="danger" v-if="scope.row.status===5">已退费</el-tag>  
    </template>
    </el-table-column>
    <el-table-column
    align="center"
      label=""
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-button type="text" v-if="scope.row.status===-1" @click="demand(scope.row)">检查要求</el-button>
        <el-button type="text" v-if="scope.row.status===4" @click="showresult(scope.row)">查看结果</el-button>
      </template>
    </el-table-column>
  </el-table>
  
  
  </el-aside>
  <transition name="el-zoom-in-left">
  <el-main width="50%" v-show="isclose" style="border-style: dotted;border-width: 0px 0px 0px 1px;border-color:#C0C0C0;margin-top:-12px">
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="检查模板" name="first">
        
        <el-table highlight-current-row @row-dblclick="addModel" @row-click="selectModel" stripe :data="checkmodels" height="230">
          <el-table-column label="模板名">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="模板简介">
            <template slot-scope="scope">
              {{scope.row.aim}}
            </template>
          </el-table-column>
        </el-table>
        <el-card v-show="onemodel.name!==undefined" class="box-card" shadow="never" body-style="font-size: 14px;font-family:'微软雅黑';width:350px">
          <div slot="header" class="clearfix">
            <span>模板详情</span>
          </div>
          <p><b>模板名:</b> {{onemodel.name}}</p>
          <p><b>模板内容:</b></p>
          <p v-for="(nondrug,index) in onemodel.nondruglist" :key="index"><b></b> {{nondrug.name}}</p>
          <p><b>总金额：</b>{{onemodel.totalprice}} 元</p>
        </el-card>
     </el-tab-pane>
     <el-tab-pane label="常用检查项" name="second">
       <el-table :data="freqlist" highlight-current-row  @row-click="addfreitem">
         <el-table-column label="项目名" prop="name"></el-table-column>
         <el-table-column label="项目单价" prop="price"></el-table-column>
         <el-table-column label="编码" prop="code"></el-table-column>
       </el-table>
     </el-tab-pane>
    </el-tabs>
  </el-main>
  </transition>
  <el-dialog title="检查目录" :visible.sync="dialogTableVisible" top="50px">
    <div style="height:450px">
    <span>搜索检查</span>
    <el-input style="width:200px" v-model="search" placeholder="搜索检查"></el-input>
    <el-table height="400px" @row-click="selectCheck" highlight-current-row :data="checkList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase())||data.code.toLowerCase().includes(search.toLowerCase()))" style="margin-top:20px">
      <el-table-column property="name" label="项目名"></el-table-column>
      <el-table-column property="code" label="项目编码"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
    </el-table>
    </div>
  </el-dialog>
  <el-dialog title="填写检查要求" :visible.sync="demandVisible">
    <div style="height:260px">
      <el-form inline label-width="100px" >
        <el-form-item label="项目编码"><el-input disabled placeholder=""  v-model="check.code"></el-input></el-form-item>
        <el-form-item label="项目名称"><el-input disabled placeholder=""  v-model="check.name"></el-input></el-form-item>
        <el-form-item label="执行科室" ><el-input disabled placeholder="" v-model="check.deptName"></el-input></el-form-item>
        <el-form-item label="目的" ><el-input placeholder="" v-model="check.aim"></el-input></el-form-item>
        <el-form-item label="要求" ><el-input placeholder="" v-model="check.demand"></el-input></el-form-item>
        <el-form-item label="临床印象"><el-input placeholder=""  v-model="check.clinicalImpression"></el-input></el-form-item>
        <el-form-item label="临床诊断" ><el-input placeholder="" v-model="check.clinicalDiagnosis"></el-input></el-form-item>
        <el-form-item label="检查部位"><el-input placeholder=""  v-model="check.checkParts"></el-input></el-form-item>
      </el-form>
      <el-button type="danger" style="float:right" @click="demandVisible=false">取消</el-button>
      <el-button type="primary" style="float:right;margin-right:10px" @click="submitDemand">确认</el-button>
    </div>
  </el-dialog>
  <el-dialog title="检查结果" :visible.sync="resultvisible" top="10px"> 
    <div class="block" style="height:100%;width:100%">
      <span>检查结果：{{checkresult}}</span>
      <el-carousel trigger="click" height="500px" style="margin-top:30px">
        <el-carousel-item v-for="item in checkresultimg" :key="item">
           <img :src="item" style="height:100%">
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-dialog>
  </el-container>
</template>
<script>  
import {getNondrugList} from '@/api/non_drug'
import {apply,list,invalid} from '@/api/outpatient/nondrugapply'
import {getNondrugModelList} from '@/api/nondrugmodel'
import {deepClone} from '@/utils'
import {selectByType} from '@/api/outpatient/frequentuse'
import {saveNonDrug,getNonDrug} from '@/api/outpatient/save'
import { Promise, all } from 'q';
export default {
  props:['patient'],
  name:'Inspection',
  data(){
    return{
      resultvisible:false,
      checkresult:'',
      checkresultimg:[],
      freqlist:[],
      onemodel:{},
      totalprice:0.000,
      ref:[],
      checkmodels:[],
      check:{},
      demandVisible:false,
      dialogTableVisible:false,
      activeName:'first',
      isclose:true,
      checkList:[],
      mainwidth:"65%",
      activeNames: ['1'],
      total:0,
      search:'',
      listQuery: {
        code:null,
        name:null,
        format:null,
        price:null,
        expClassId: null,
        deptId: null,
        mnemonicCode:null,
        recordType: 1,
        createDate: null,
        status:1,
        pageSize:1000,
        pageNum:1
      },
      record:[]
    };
  },
   watch:{
    'patient' : function(newVal, oldVal){
      this.patient = newVal
      this.listRecord()
    },
  },
  created(){
    Promise.all([
      this.getNondrugList().then(()=>{
        this.getmodel()
      })
    ])
    this.getfreqList()

  },
  methods:{
    saveNonDrug(){
      let data = {}
      data.dmsNonDrugItemRecordParamList = this.ref
      data.registrationId = this.patient.registrationId
      data.type = 0
      saveNonDrug(data).then(res=>{
        this.$notify({
          title: '成功',
          message: '已暂存选中的检查项',
          type: 'success',
          duration: 2000
        })
      })
    },
    getNonDrug(){
      let data = {}
      data.registrationId = this.patient.registrationId
      data.type = 0
      getNonDrug(data).then(res=>{
        res.data.dmsNonDrugItemRecordParamList.forEach(item=>{
          this.selectCheckred(item)
          
        })
        this.$notify({
          title: '成功',
          message: '已取出暂存的检查项',
          type: 'success',
          duration: 2000
        })
      })
    },
    showresult(row){
      this.checkresult = row.checkResult
      row.resultImgUrlList.split(',').forEach(item=>{
        this.checkresultimg.push(item)
      })
      this.resultvisible = true
    },
    addfreitem(val){
      this.selectCheck(val)
    },
    getfreqList(){
      let data = {}
      data.staffId = this.$store.getters.id
      data.selectType = 1
      selectByType(data).then(res=>{
        this.freqlist = res.data.checkList
      })
    },
    addModel(val){
      this.$confirm('是否确定将 模板:'+val.name+' 中的内容导入该患者的检查中', '导入模板', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          val.nondruglist.forEach(item=>{
            item.status = -1
            let flag = 1
            this.record.forEach(com=>{
              if(com.id===item.id){
                flag = 0
              }
            })
            if(flag)
              this.record.push(item)
          })
        })
    },
    selectModel(val){
      this.onemodel = val
    },
    async getmodel(){
      let data = {}
      data.scope = 0
      data.ownId = this.$store.getters.id
      data.type = 0
      data.pageSize =10000
      data.pageNum = 1
      data.isAdmin = 0
      await getNondrugModelList(data).then(res=>{
        this.checkmodels = res.data.list
        this.checkmodels.forEach(onemodel=>{
          onemodel.nondruglist = []
          onemodel.totalprice =0.00
          this.checkList.filter(item=>{
            if(onemodel.nonDrugIdList.includes(item.id)){
              onemodel.nondruglist.push(item)
              onemodel.totalprice += item.price
            }
          })
        })
      })
    },
    refresh(){
      this.$confirm('未开立的项目都将清除,确认刷新?', '刷新', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.listRecord()
        })
    },
    invalid(){
      let data = ''
      this.ref.forEach(item=>{
        data +=(item.id+',')
      })
      data = data.substr(0,data.length-1)
      invalid(data).then(res=>{
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.refresh()
      })
      console.log(data)
    },
    async listRecord(){
      list(this.patient.registrationId,0).then(res=>{
        this.record = res.data
        console.log(this.record)
        this.record.forEach(item=>{
          this.checkList.filter(check=>{
            if(check.id===item.noDrugId){
              item.code = check.code
              item.name = check.name
              item.format = check.format
              item.price = check.price
            }
          })
          item.deptName = item.excuteDeptName
        })
      })
    },
    handleSelectionChange(val){
      this.ref = val
      this.totalprice = 0.00
      this.ref.forEach(item=>{
        this.totalprice+=item.price
      })
      this.totalprice = this.totalprice.toFixed(2)
    },
    apply(){
      let data = {}
      data.dmsNonDrugItemRecordParamList = this.ref
      data.createStaffId = this.$store.getters.id
      data.registrationId = this.patient.registrationId
      data.dmsNonDrugItemRecordParamList.forEach(item=>{
        item.amount = item.price
        item.excuteDeptId = item.deptId
        item.noDrugId = item.id
      })
      data.type = 0
      apply(data).then(res=>{
        this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
        this.listRecord()
      })
    },  
    submitDemand(){
      console.log(666)
      this.record.forEach(item=>{
        if(item.id===this.check.id){
          item.aim = this.check.aim
          item.demand = this.check.demand
          item.clinicalImpression = this.check.clinicalImpression
          item.clinicalDiagnosis = this.check.clinicalDiagnosis
          item.checkParts = this.check.checkParts
        }
      })
      this.demandVisible = false
    },
    demand(row){
      this.demandVisible = true
      this.check = deepClone(row)
    },
    async getNondrugList() {
      const response = await getNondrugList(this.listQuery)
      console.log(response)
      this.checkList = response.data.list
      this.total = response.data.total
    },
    selectCheckred(val){
      console.log(val)
      let flag = 1
      val.status = -1
      this.record.forEach(item=>{
        if(item.id===val.id){
          flag=0
        }
      })
      if(flag)
        this.record.push(val)
      this.dialogTableVisible = false
    },
    selectCheck(val){
      this.$confirm('是否添加 '+val.name+' 到该患者?', '添加检查', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'success'
        }).then(()=>{
          let flag = 1
          val.status = -1
          this.record.forEach(item=>{
            if(item.id===val.id){
              flag=0
            }
          })
          if(flag)
            this.record.push(val)
          else
            alert('已存在该检查项目！')
          this.dialogTableVisible = false
        })
    },
    addcheck(){
      this.dialogTableVisible = true
    },
    delcheck(){
      this.record = this.record.filter(item=>{
        if(item.status===-1)
          if(this.ref.includes(item))
            return false
        return true
      })
      
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


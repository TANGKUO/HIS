<template>
  <div>
  <!-- 病历首页 -->
  <el-container>
  <el-aside :width="mainwidth" style="background:white;">
    <el-tag style="margin-bottom:20px">病史内容:</el-tag>
    <el-button type="text" style="margin-left:30px" @click="saveCasePage"><i class="el-icon-upload2" />暂存</el-button>
    <el-button type="text" style="margin-left:30px" @click="getCasePage"><i class="el-icon-download" />取出暂存病历</el-button>
    <el-button style="float:right" @click="controlfast"><i v-show="!isclose" class="el-icon-caret-right" /><i v-show="isclose" class="el-icon-caret-left" />  快捷操作</el-button>
    <el-form :model="record" label-width="100px">
      <el-form-item label="主诉"><el-input v-model="priliminaryDise.chiefComplaint" type="textarea" :autosize="{ minRows: 2, maxRows: 3}" placeholder="主述" style="width:80%"></el-input></el-form-item>
      <el-form-item label="现病史"><el-input v-model="priliminaryDise.historyOfPresentIllness" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="现病史" style="width:80%" ></el-input></el-form-item>
      <el-form-item label="现病治疗情况"><el-input v-model="priliminaryDise.historyOfTreatment" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="现病治疗情况" style="width:80%"></el-input></el-form-item>
      <el-form-item label="既往史"><el-input v-model="priliminaryDise.pastHistory" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="既往史" style="width:80%"></el-input></el-form-item>
      <el-form-item label="过敏史"><el-input v-model="priliminaryDise.allergies" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="过敏史" style="width:80%"></el-input></el-form-item>
      <el-form-item label="体格检查"><el-input v-model="priliminaryDise.healthCheckup" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="体格检查" style="width:80%"></el-input></el-form-item>
      <el-form-item label="发病时间">
           <el-date-picker
            v-model="priliminaryDise.startDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
      </el-form-item>
    </el-form>
      <el-tag>评估诊断:</el-tag>
      <el-card style="width:85%">
        <el-button type="text" style="float:right" @click="addDis">添加诊断</el-button>
        <el-table :data="record">
          <el-table-column width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteDis(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="ICD编码" prop="icd"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="编码" prop="code" ></el-table-column>
          
        </el-table>
      </el-card>
      <div style="float:right;width:25%;margin-top:40px">
        <el-button type="primary" @click="submitPriliminaryDise">提交初诊</el-button>
      </div>
  </el-aside>
  <transition name="el-zoom-in-left">
  <el-main width="50%" v-show="isclose" style="border-style: dotted;border-width: 0px 0px 0px 1px;border-color:#C0C0C0;margin-top:-12px">
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="病历模板" name="first">
        <el-table stripe :data="models" height="230" @row-click="selectmodel" @row-dblclick="addmodel">
          <el-table-column label="病历名">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="主要诊断">
            <template slot-scope="scope">
              {{scope.row.dis}}
            </template>
          </el-table-column>
        </el-table>
        <el-card  v-if="model.name!==undefined" class="box-card" shadow="never" body-style="font-size: 14px;font-family:'微软雅黑';width:350px">
          <div slot="header" class="clearfix">
            <span>{{model.name}}</span>
          </div>
          <p><b>主述：</b>{{model.chiefComplaint}}</p>
            <p><b>现病史：</b>{{model.historyOfPresentIllness}}</p>
            <p><b>现病治疗情况: </b>{{model.historyOfTreatment}}</p>
            <p><b>既往史：</b>{{model.pastHistory}}</p>
            <p><b>过敏史：</b>{{model.allergies}}</p>
            <p><b>体格检查: </b>{{model.healthCheckup}}</p>
            <p><b>主要诊断: </b>{{model.dis}}</p>
        </el-card>
     </el-tab-pane>
      <el-tab-pane label="常用诊断" name="second">
        <el-table :data="medicineDiseIdList" @row-click="selectDis">
          <el-table-column label="ICD编码" prop="icd"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="历史病历" name="third">
        <el-table highlight-current-row height="230" :data="history" @row-click="selecthistory">
          <el-table-column label="主要诊断" prop="priliminaryDiseStrList">
          </el-table-column>
          <el-table-column label="就诊时间" prop="createTime">
          </el-table-column>
        </el-table>
        <el-card v-show="historyitem.priliminaryDiseStrList!==undefined" class="box-card" shadow="never" body-style="font-size: 14px;font-family:'微软雅黑';width:470px;height:500px">
          <div slot="header" class="clearfix">
              <span>病历详情</span>
          </div>
          <el-scrollbar style="height:100%">
            <div style="width:100%">
              <p><b>就诊时间: </b>{{historyitem.createTime}}</p>
              <p><b>主要诊断: </b>{{historyitem.priliminaryDiseStrList}}<p>
              <p><b>主述: </b>{{historyitem.chiefComplaint}}</p>
              <p><b>现病史: </b>{{historyitem.historyOfPresentIllness}}</p>
              <p><b>现病治疗情况: </b>{{historyitem.historyOfTreatment}}</p>
              <p><b>既往史: </b>{{historyitem.pastHistory}}</p>
              <p><b>过敏史: </b>{{historyitem.allergies}}</p>
              <p><b>体格检查: </b>{{historyitem.healthCheckup}}</p>
              <p><b>发病时间: </b>{{historyitem.startDate}}</p>
              <p><b>检查结果: </b>{{historyitem.checkResult}}</p>
              <p><b>检验结果: </b>{{historyitem.testResult}}</p>
              <p><b>成药处方: </b>{{historyitem.medicinePrescriptionStrList}}</p>
              <p><b>草药处方: </b>{{historyitem.herbalPrescriptionStrList}}</p>
              <p><b>检验项目: </b>{{historyitem.testStrList}}</p>
              <p><b>检查项目: </b>{{historyitem.checkStrList}}</p>
              <p><b>处置项目: </b>{{historyitem.dispositionStrList}}</p>
            </div>
          </el-scrollbar>
        </el-card>
      </el-tab-pane>
     </el-tabs>
  </el-main>
  </transition>
  </el-container>
  <el-dialog title="诊断目录" :visible.sync="dialogTableVisible" top="50px">
    <div style="height:520px">
    <span>搜索诊断</span>
    <el-input style="width:200px" placeholder="搜索诊断" v-model="disQuery.name" @change="getDis"></el-input>
    <el-table highlight-current-row @row-click="selectDis" :data="disList " style="margin-top:20px">
      <el-table-column property="icd" label="ICD编码" width="150"></el-table-column>
      <el-table-column property="name" label="名称" width="350"></el-table-column>
      <el-table-column property="code" label="编码" width="200"></el-table-column>
    </el-table>
    <pagination :auto-scroll="false" style="margin-top:0px" v-show="total>0" :total="total" page-sizes="[]" :page.sync="disQuery.pageNum" :limit.sync="disQuery.pageSize" @pagination="getDis" />
    </div>
  </el-dialog>
  </div>
</template>
<script>  
import {getDmsDislist,parseList} from '@/api/diagnosis'
import {submitPriliminaryDise,selectEndCaseHistoryByReg} from '@/api/outpatient/dmscase'
import {getAllStaffModel} from '@/api/outpatient/dmscasemodel'
import Pagination from '@/components/Pagination'
import {selectByType,addfre,delfre} from '@/api/outpatient/frequentuse'
import {parseTime,deepClone} from '@/utils'
import {saveCasePage,getCasePage} from '@/api/outpatient/save'
export default {
  props:['patient'],
  name:'Record',
  components: {Pagination},
  data(){
    return{
      history:[],
      historyitem:{},
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      dialogTableVisible:false,
      activeName:'first',
      isclose:false,
      record:[],
      medicineDiseIdList:[],//常用诊断
      priliminaryDise:{
        chiefComplaint:'',//主述
        historyOfPresentIllness:'',//现病史
        historyOfTreatment:'',//现治疗情况
        pastHistory:'',//既往史
        allergies:'',//过敏史
        healthCheckup:'',//体格检查
        registrationId:'',//
        priliminaryDiseStrList:'',
        priliminaryDiseIdList:'',
        startDate:'',
        name:'',
        gender:'',
        ageStr:''
      },
      mainwidth:"80%",
      activeNames: ['1'],
      data2:[
        {
          date: '0001',
          name: '王小虎1',
          address: '38岁'
        },
        {
          date: '0002',
          name: '王小虎2',
          address: '39岁'
        }
      ],
      total:0,
      disQuery: {
        catId: '',
        code: '',
        name: '',
        icd: '',
        status: '',
        pageSize: 8,
        pageNum: 1
      },
      models:[],
      model:{},
      disList:[]
    };
  },
  created(){
    this.getmedicineDiseIdList()
    this.getAllStaffModel()
  },
  watch:{
    'patient' : function(newVal, oldVal){
      this.patient = newVal
      this.selectEndCaseHistoryByReg()
      this.getCasePage()
    },
  },
  methods:{
    addmodel(val){
      this.$confirm('是否加载病历模板 '+val.name+' ?', '加载病历模板', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'success'
        }).then(()=>{
          this.priliminaryDise = deepClone(val)
          let diss = ''
          this.priliminaryDise.priliminaryDiseIdList.forEach(item=>{
            diss += (item+',')
          })
          diss = diss.substr(0,diss.length-1)
          parseList(diss).then(res=>{
            this.record = res.data
          })
        })
    },
    selectmodel(val){
      this.model = val
    },
    getAllStaffModel(){
      getAllStaffModel(this.$store.getters.id).then(res=>{
        this.models = res.data.staffList
        this.models.forEach(item=>{
          item.dis = ''
          item.priliminaryDiseStrList.forEach(dis=>{
            item.dis+=(dis+',')
          })
          item.dis = item.dis.substr(0,item.dis.length-1)
        })
      })
    },
    saveCasePage(){
      let data  =this.priliminaryDise
      data.registrationId = this.patient.registrationId
      saveCasePage(this.priliminaryDise).then(res=>{
        this.$notify({
          title: '成功',
          message: '已暂存病历首页',
          type: 'success',
          duration: 2000
        })
      })
    },
    getCasePage(){
      getCasePage(this.patient.registrationId).then(res=>{
        if(res.data!==null){
          this.priliminaryDise = res.data
          this.$notify({
            title: '成功',
            message: '已加载暂存病历首页',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    selecthistory(val){
      this.historyitem = val
    },
    selectEndCaseHistoryByReg(){
      selectEndCaseHistoryByReg(this.patient.registrationId).then(res=>{
        this.history = res.data.dmsCaseHistoryList
        this.history.forEach(item=>{
          item.createTime = parseTime(item.createTime)
          item.startDate = parseTime(item.startDate)
        })
      })
    },
    getmedicineDiseIdList(){
      selectByType({staffId:this.$store.getters.id,selectType:2}).then(res=>{
        this.medicineDiseIdList = res.data.medicineDiseList
      })
    },
    submitPriliminaryDise(){
      this.priliminaryDise.registrationId = this.patient.registrationId
      this.record.forEach(item=>{
        this.priliminaryDise.priliminaryDiseStrList+=(item.name+',')
        this.priliminaryDise.priliminaryDiseIdList+=(item.id+',')
      })
      this.priliminaryDise.priliminaryDiseStrList = this.priliminaryDise.priliminaryDiseStrList.substr(0, this.priliminaryDise.priliminaryDiseStrList.length - 1);
      this.priliminaryDise.priliminaryDiseIdList = this.priliminaryDise.priliminaryDiseIdList.substr(0, this.priliminaryDise.priliminaryDiseIdList.length - 1);
      this.priliminaryDise.name = this.patient.patientName
      this.priliminaryDise.gender = this.patient.patientGender
      this.priliminaryDise.startDate = parseTime(this.priliminaryDise.startDate).substr(0,10)
      this.priliminaryDise.ageStr = this.patient.patientAge
      submitPriliminaryDise(this.priliminaryDise).then(res=>{
          this.$notify({
            title: '成功',
            message: '成功提交初诊病历',
            type: 'success',
            duration: 2000
          })
          this.$emit('priliminary')
        })
    },
    deleteDis(row){
      this.record=this.record.filter(item=>{
        if(item.id===row.id)
          return false
        return true
      })
    },
    selectDis(val){
      this.$confirm('是否添加 '+val.name+' 到该患者?', '添加诊断', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'success'
        }).then(()=>{
          let flag = 1
          this.record.forEach(item=>{
            if(item.icd===val.icd){
              flag=0
            }
          })
          if(flag)
            this.record.push(val)
          else
            alert('已存在该诊断！')
          this.dialogTableVisible = false
        })
    },
    async getDis(){
      const res = await getDmsDislist(this.disQuery)
      this.disList = res.data.list
      this.total = res.data.total
    },
    loadpatient(){
    },
    addDis(){
      this.dialogTableVisible=true
      this.getDis()
    },
    controlfast(){
      this.isclose=!this.isclose
      if(this.mainwidth==="60%")
        this.mainwidth="80%"
      else
        this.mainwidth="60%"
    }
  }
}
</script>
<style>
  .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>

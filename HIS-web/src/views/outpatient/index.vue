<template>
  <!-- 门诊医生工作台 -->
  <div class="div1">
    <el-container>
    <!-- 左侧患者列表 -->
    <transition name="el-zoom-in-left">
    <el-aside width="350px" v-show="isaside" style="padding:0">
      <div>
      <el-card style="width:350px">
      <span style="font-family:'微软雅黑'">选择患者:</span>
      <el-input v-model="search" placeholder="患者名" style="width: 180px;" class="filter-item input1" />
      <el-button style="margin-left:10px" type="primary"  circle icon="el-icon-refresh" @click="getPatientList"></el-button>
      <el-tabs type="card" v-model="activeName" style="margin-top:15px">
      <el-tab-pane  label="本人" name="first">
      <el-tag style="width:100%">待诊患者</el-tag>
      <el-table @row-click="handleCurrentChange" highlight-current-row stripe :data="personalWaitList.filter(data => !search || data.patientName.toLowerCase().includes(search.toLowerCase())||data.patientMedicalRecordNo.toLowerCase().includes(search.toLowerCase()))" height="255">
        <el-table-column align="center" label="病历号" width="150px">
          <template slot-scope="scope">
            {{scope.row.patientMedicalRecordNo}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名字" width="90px">
          <template slot-scope="scope">
            {{scope.row.patientName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄" width="65px">
          <template slot-scope="scope">
            {{scope.row.patientAge}}
          </template>
        </el-table-column>
      </el-table>
      <el-tag type="success" style="width:100%">诊中患者</el-tag>
      <el-table @row-click="continuing" highlight-current-row stripe :data="personalDuringList.filter(data => !search || data.patientName.toLowerCase().includes(search.toLowerCase())||data.patientMedicalRecordNo.toLowerCase().includes(search.toLowerCase()))" height="255">
        <el-table-column align="center" label="病历号" width="150px">
          <template slot-scope="scope">
            {{scope.row.patientMedicalRecordNo}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名字" width="90px">
          <template slot-scope="scope">
            {{scope.row.patientName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄" width="65px">
          <template slot-scope="scope">
            {{scope.row.patientAge}}
          </template>
        </el-table-column>
      </el-table>
      <el-tag type="warning" style="width:100%">已诊患者</el-tag>
      <el-table stripe :data="personalEndList.filter(data => !search || data.patientName.toLowerCase().includes(search.toLowerCase())||data.patientMedicalRecordNo.toLowerCase().includes(search.toLowerCase()))" height="255">
        <el-table-column align="center" label="病历号" width="150px">
          <template slot-scope="scope">
            {{scope.row.patientMedicalRecordNo}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名字" width="90px">
          <template slot-scope="scope">
            {{scope.row.patientName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄" width="65px">
          <template slot-scope="scope">
            {{scope.row.patientAge}}
          </template>
        </el-table-column>
      </el-table>
      </el-tab-pane>
      <el-tab-pane label="科室" name="second">
        <el-tag style="width:100%">待诊患者</el-tag>
        <el-table v-loading="loaddepp" @row-click="bindPatient" highlight-current-row stripe :data="deptWaitList.filter(data => !search || data.patientName.toLowerCase().includes(search.toLowerCase())||data.patientMedicalRecordNo.toLowerCase().includes(search.toLowerCase()))" height="820">
          <el-table-column align="center" label="病历号" width="150px">
            <template slot-scope="scope">
              {{scope.row.patientMedicalRecordNo}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="名字" width="90px">
            <template slot-scope="scope">
              {{scope.row.patientName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="年龄" width="65px">
            <template slot-scope="scope">
              {{scope.row.patientAge}}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      </el-tabs>
      </el-card>
      </div>
    </el-aside>
    </transition>
    <!-- 医生工作台 -->
    <el-main>
      <div class='popContainer' v-if="mask"></div>
      <div style="border-style: dotted;border-width: 0px 0px 1px 0px;border-color:#C0C0C0;padding: 0 0 10px 0;margin-bottom:-10px">
        <el-button size="mini" circle type="primary" @click="showaside"><i v-show="isaside" class="el-icon-arrow-left" /><i v-show="!isaside" class="el-icon-arrow-right" /></el-button>
        <span style="margin-left:15px;font-size:14px;font-family: '微软雅黑';">当前病人：</span>
        <el-tag class="painfo" color="white" style="width:15%;font-size:15px">姓名: <span style="color:black;font-size: 14px;font-family:'微软雅黑';">{{patient.patientName}}</span></el-tag>
        <el-tag class="painfo" color="white" style="width:20%;font-size:15px">就诊号: <span style="color:black;font-size: 14px;font-family:'微软雅黑';">{{patient.patientMedicalRecordNo}}</span></el-tag>
        <el-tag class="painfo" color="white" style="width:10%;font-size:15px">性别: <span style="color:black;font-size: 14px;font-family:'微软雅黑';" v-if="patient.patientGender===1">女</span><span style="color:black" v-if="patient.patientGender===0">男</span></el-tag>
        <el-tag class="painfo" color="white" style="width:10%;font-size:15px">年龄: <span style="color:black;font-size: 14px;font-family:'微软雅黑';">{{patient.patientAge}}</span></el-tag>
        <el-button type="text" style="margin-left:30px" @click="endDiagnosis"><i class="el-icon-success" />诊毕</el-button>
      </div>
    <div style="margin-top=-30px">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick" style="margin-top:20px">
        <el-tab-pane label="病历首页" :disabled="!firstdisabled" name="first"><Record @priliminary="priliminary" ref="record" v-bind:patient="patient"></Record></el-tab-pane>
        <el-tab-pane label="检查申请" :disabled="firstdisabled" name="second"><Inspection ref="inspection" v-bind:patient="patient"></Inspection></el-tab-pane>
        <el-tab-pane label="检验申请" :disabled="firstdisabled" name="third"><Examine ref="examine" v-bind:patient="patient"></Examine></el-tab-pane>
        <el-tab-pane label="门诊确诊" :disabled="firstdisabled||!comfirmdisabled" name="fourth"><Comfirm @comfirmdms="comfirmdms" ref="comfirm" v-bind:patient="patient" ></Comfirm></el-tab-pane>
        <el-tab-pane label="成药处方" :disabled="firstdisabled||comfirmdisabled" name="fiveth"><Prescription ref="prescription" v-bind:patient="patient"></Prescription></el-tab-pane>
        <el-tab-pane label="草药处方" :disabled="firstdisabled||comfirmdisabled" name="eightth"><Cprescription ref="cprescription" v-bind:patient="patient"></Cprescription></el-tab-pane>
        <el-tab-pane label="处置申请" :disabled="firstdisabled||comfirmdisabled" name="sixth"><Handle ref="cprescription" v-bind:patient="patient"></Handle></el-tab-pane>
        <el-tab-pane label="患者账单" :disabled="firstdisabled" name="seventh"><Bill ref="bill" v-bind:patient="patient"></Bill></el-tab-pane>
      </el-tabs>
    </div>
    </el-main>
    </el-container>
  </div>
</template>

<script>
import Record from './workstation/record'
import Inspection from './workstation/inspection'
import Examine from './workstation/examine'
import Prescription from './workstation/prescription'
import Handle from './workstation/handle'
import Comfirm from './workstation/confirm'
import Cprescription from './workstation/Cprescription'
import Bill from './workstation/bill'
import {getPatientList,bindPatient,startDiagnosis} from '@/api/outpatient/patient'
import {endDiagnosis,getnonend} from '@/api/outpatient/dmscase'
import { deepClone } from '@/utils'
import { truncate } from 'fs';
  export default{
    components: {Record,Inspection,Examine,Prescription,Handle,Comfirm,Cprescription,Bill},
    data(){
      return{
        comfirmdisabled:true,
        firstdisabled:true,
        mask:true,
        loaddepp:true,
        patient:{},
        deptWaitList:[],
        personalDuringList:[],
        personalEndList:[],
        personalWaitList:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        mouldname:'',
        dialog1: false,
        dialog2: false,
        search:'',
        isaside: true,
        activeName: 'first',
        activeName2: 'first',
      };
    },
    created(){
      this.getPatientList()
    },
    methods: {
      comfirmdms(){
        getnonend(this.patient.registrationId).then(res=>{
          this.comfirmdisabled = true
          if(res.data.dmsCaseHistoryList.length!==0){
            this.activeName2 = 'second'
            if(res.data.dmsCaseHistoryList[0].status===2){
              this.comfirmdisabled = false
              this.activeName2 = 'fiveth'
            }
            this.firstdisabled = false
            
          }
          else{
            this.firstdisabled = true
            this.activeName2 = 'first'
          }
          this.patient = val
          this.$refs.record.controlfast()
        })
      },
      priliminary(){
        getnonend(this.patient.registrationId).then(res=>{
          this.comfirmdisabled = true
          if(res.data.dmsCaseHistoryList.length!==0){
            if(res.data.dmsCaseHistoryList[0].status===2){
              this.comfirmdisabled = false
              this.activeName2 = 'fiveth'
            }
            this.firstdisabled = false
            this.activeName2 = 'second'
          }
          else{
            this.firstdisabled = true
            this.activeName2 = 'first'
          }
          this.patient = val
          this.$refs.record.controlfast()
        })
      },
      endDiagnosis(){
        endDiagnosis(this.patient.registrationId).then(res=>{
          this.$notify({
            title: '成功',
            message: '已诊毕！',
            type: 'success',
            duration: 2000
          })
          this.showaside()
          this.getPatientList()
        })
      },
      continuing(val){
          this.$confirm('确认继续诊断患者 '+val.patientName+'?', '就诊', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'success'
          }).then(()=>{
            getnonend(val.registrationId).then(res=>{
              this.comfirmdisabled = true
              if(res.data.dmsCaseHistoryList.length!==0){
                this.activeName2 = 'second'
                if(res.data.dmsCaseHistoryList[0].status===2){
                  this.comfirmdisabled = false
                  this.activeName2 = 'fiveth'
                }
                this.firstdisabled = false
                
              }
              else{
                this.firstdisabled = true
                this.activeName2 = 'first'
              }
              this.patient = val
              this.showaside()
              this.$refs.record.controlfast()
            })
          })
        
      },
      bindPatient(val){
          this.$confirm('确认绑定患者 '+val.patientName+'?', '就诊', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'success'
        }).then(()=>{
          
          bindPatient(val.registrationId,this.$store.getters.id).then(res=>{
            this.getPatientList()
            this.$notify({
              title: '成功',
              message: '成功绑定该患者!',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      async handleCurrentChange(val){
        this.$confirm('确认开始诊断患者 '+val.patientName+'?', '就诊', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'success'
        }).then(()=>{
          startDiagnosis(val.registrationId).then(res=>{
             this.$notify({
              title: '成功',
              message: '开始诊断',
              type: 'success',
              duration: 2000
            })
            this.patient = val
            this.showaside()
            this.$refs.record.controlfast()
          })
          
        })
        
      },
      async getPatientList(){
        this.loaddepp = true
        await getPatientList(this.$store.getters.id).then(res=>{
          this.deptWaitList = res.data.deptWaitList
          this.personalDuringList = res.data.personalDuringList
          this.personalEndList = res.data.personalEndList
          this.personalWaitList = res.data.personalWaitList
          this.loaddepp = false
        }).catch(err=>{
          this.loaddepp = false
        })
      },
      showaside(){
        if(this.isaside===false){
          this.isaside=true;
          this.mask = true
        }
        else{
          this.isaside = false
          this.mask = false
        }
      },
      storeRecord(){
        this.dialog1=true;
      }
  }
}
</script>
<style>
  div.popContainer{
    position: absolute;
    top: 0;
    left: 350px;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0,0,0,0.3);
}

  .div1{
    font-family:  "微软雅黑";
  }
  .card1{
    font-size: 14px;
    font-family: "微软雅黑";
    line-height: 20px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .input1{
    width:200px;
  }
  .box-card {
    width: 480px;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #fff;
}
::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color:#F0F8FF
    }
</style>


  
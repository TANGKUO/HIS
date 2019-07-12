<template>
  <!-- 门诊挂号 -->
  <div>
    <aside>
      <span style="font-family:'微软雅黑';font-size:14px">门诊挂号</span>
      <el-input size="mini" v-show="isshow" v-model="dmsRegistrationParam.invoiceNo"  placeholder="发票号" style="width: 200px;margin-left:30px" class="filter-item" ></el-input>
    <el-button v-show="isshow" size="mini">更新发票号</el-button>
    <el-input size="mini" v-show="dialogFormVisible||refundVisible" v-model="invoiceNo"  placeholder="发票号" style="width: 200px;margin-left:30px" class="filter-item" ></el-input>
    <el-button v-show="dialogFormVisible" size="mini">更新发票号</el-button>
      <el-button style="float:right;margin-left:20px" type="text" size="medium" @click="reprint" ><i class="el-icon-circle-plus" />重打</el-button>
      <el-button style="float:right;margin-left:20px" type="text" size="medium" @click="selectPatientByIdNo"><i class="el-icon-upload" />读卡</el-button>
      <el-button style="float:right;margin-left:20px" type="text" size="medium" @click="guahao"><i class="el-icon-circle-plus" />挂号</el-button>
    </aside>
    <div>
      <transition name=".el-fade-in-linear">
      <el-form v-if="isshow" label-position="left" :model="dmsRegistrationParam" label-width="68px" :inline="true" class="demo-form-inline" style="padding:0 0 0 100px;border-style: solid;border-width: 0px 0px 1px 0px;border-color:#C0C0C0;">
        <el-form-item style="width:300px" label="身份证号">
          <el-input placeholder="身份证号" v-model="dmsRegistrationParam.identificationNo"></el-input>
        </el-form-item>
        <el-form-item style="width:300px" :inline="true" label="姓名">
          <el-input v-model="dmsRegistrationParam.name" placeholder="姓名" ></el-input>
        </el-form-item>
        <el-form-item style="width:300px" label="出生日期">
          <el-date-picker
          style="width:180px"
          @change="chooseRegister"
            v-model="dmsRegistrationParam.dateOfBirth"
            align="right"
            type="date"
            placeholder="选择日期">  
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width:300px" label="性别">
          <el-select placeholder="性别" v-model="dmsRegistrationParam.gender" style="width:100px">
            <el-option v-for="item in [{label:'男',value:0},{label:'女',value:1}]" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item style="width:300px" label="家庭住址">
          <el-input placeholder="家庭住址" v-model="dmsRegistrationParam.homeAddress"></el-input>
        </el-form-item>
        <el-form-item style="width:300px" label="联系方式">
          <el-input placeholder="联系方式" v-model="dmsRegistrationParam.phoneNo"></el-input>
        </el-form-item>
        <el-form-item style="width:300px" label="挂号科室">
          <el-select placeholder="挂号科室" filterable @change="chooseRegister" v-model="dmsRegistrationParam.deptId" style="width:180px">
            <el-option v-for="item in alldept" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item style="width:300px" label="挂号级别">
          <el-select placeholder="挂号级别" filterable  v-model="dmsRegistrationParam.RegisterRnak" @change="chooseRegister" style="width:180px">
            <el-option v-for="item in RegisterRank" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item style="width:300px" label="挂号日期">
          <el-date-picker
          style="width:180px"
          @change="chooseRegister"
            v-model="dmsRegistrationParam.attendanceDate"
            align="right"
            type="date"
            placeholder="选择日期">  
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width:300px" label="午别">
          <el-select placeholder="默认" :disabled="regdisabled" style="width:100px" @change="choosenoon" v-model="dmsRegistrationParam.noon">
            <el-option label="上午" value="0"></el-option>
            <el-option label="下午" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:300px" label="看诊医生">
          <el-select style="width:180px" placeholder="默认" v-model="dmsRegistrationParam.skdId" :disabled="regdisabled2">
            <el-option v-for="item in doctList" :key="item.skdId" :label="item.name" :value="item.skdId" />
          </el-select>
        </el-form-item>
        <el-form-item style="width:300px" label="应收金额">
          <el-input placeholder="应收金额" style="width:180px;color:black" disabled v-model="dmsRegistrationParam.amount"></el-input>
        </el-form-item>
        <el-form-item style="width:300px" label="支付方式">
          <el-select style="width:150px" v-model="dmsRegistrationParam.settlementCatId" placeholder="请选择支付方式">
            <el-option
              v-for="item in paytype"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:300px" label="病历本">
          <el-radio v-model="dmsRegistrationParam.needBook" @change="changeradio1" label="1">是</el-radio>
          <el-radio v-model="dmsRegistrationParam.needBook" @change="changeradio2" label="0">否</el-radio>
        </el-form-item>
        <el-form-item style="margin-left:940px">
          <el-button type="primary" @click="createRegistration">挂号&打印发票</el-button>
        </el-form-item>
        
      </el-form>

      </transition>
    </div>

    <div  v-if="!dialogFormVisible&&!isshow&&!refundVisible">
    <el-button style="margin-left:20px;font-family:'微软雅黑';font-size:14px;color:black" disabled>挂号信息列表</el-button>
    <el-input placeholder="病历号/姓名" v-model="queryRegister.medicalRecordNo" style="margin-left:20px;width:180px"></el-input>
    <el-button @click="listRegisteredPatient"><svg-icon icon-class="search" /></el-button>
    <el-button style="float:right;margin-right:30px" type="text" @click="refresh" size="medium"><i class="el-icon-refresh" />刷新</el-button>
    <el-table border :data="RegisterList.filter(data => !queryRegister.medicalRecordNo || data.patientName.toLowerCase().includes(queryRegister.medicalRecordNo.toLowerCase())||data.medicalRecordNo.toLowerCase().includes(queryRegister.medicalRecordNo.toLowerCase()))" highlight-current-row style="width: 100%;margin-top:20px" height="400">
      <el-table-column
      fixed="left"
      label="操作"
      width="160" align="center">
      <template slot-scope="scope">
        <el-button v-if="scope.row.registrationStatus=='1'" plain size="mini" @click="tuihao(scope.row)">退号</el-button>
        <el-button v-if="scope.row.registrationStatus=='1'" plain size="mini" @click="supprint(scope.row)">补打</el-button>
        <el-button v-if="scope.row.registrationStatus=='2'" plain size="mini" @click="handlepay(scope.row)">缴费</el-button>
        <el-button v-if="scope.row.registrationStatus=='2'" plain size="mini" @click="refundRegistrationCharge(scope.row)">退费</el-button>
        <el-button v-if="scope.row.registrationStatus=='0'" plain size="mini">退号</el-button>
        <el-button v-if="scope.row.registrationStatus=='4'" plain size="mini" disabled>无</el-button>
        <el-button v-if="scope.row.registrationStatus=='3'" plain size="mini" disabled>无</el-button>
      </template>
    </el-table-column>
      <el-table-column align="center" label="状态" width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.registrationStatus===1" type="primary">未看诊</el-tag>
          <el-tag v-if="scope.row.registrationStatus===4" type="danger">已退号</el-tag>
          <el-tag v-if="scope.row.registrationStatus===2" type="warning">待收费</el-tag>
          <el-tag v-if="scope.row.registrationStatus===3" type="success">诊毕</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="病历号" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.medicalRecordNo }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别" width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.patientGender===0">男</span>
          <span v-if="scope.row.patientGender===1">女</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="出生日期">
        <template slot-scope="scope">
          <span>{{ scope.row.patientDateOfBirth}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="看诊日期" >
        <template slot-scope="scope">
          <span>{{ scope.row.attendanceDate}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="看诊科目" >
        <template slot-scope="scope">
          <span>{{ scope.row.deptName}}</span>
        </template>
      </el-table-column>
  </el-table>
    </div>
  <div v-show="dialogFormVisible&&!refundVisible" style="text-align:center">
    <el-form :model="onepatient" label-width="80px"  label-position="left" :inline="true">
      <el-form-item label="病历号" prop="id" label-width="60px">
          <el-tag style="width:200px" type="info" size="large" placeholder="病历号">{{onepatient.medicalRecordNo}}</el-tag>
      </el-form-item>
      <el-form-item label="患者姓名" prop="name" label-width="70px">
          <el-tag style="width:140px" type="info" size="large" placeholder="病历号">{{onepatient.patientName}}</el-tag>
      </el-form-item>

      <el-form-item label="看诊日期" prop="birth" label-width="70px">
          <el-tag style="width:140px" type="info" size="large" placeholder="病历号">{{onepatient.attendanceDate}}</el-tag>
      </el-form-item>
    </el-form>
    <el-table stripe border :data="paylist" @selection-change="handlechange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="项目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总金额(元)"  width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.amount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="开立时间"  width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目类型"  width="200">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type===1">检查</el-tag>
          <el-tag v-if="scope.row.type===2">检验</el-tag>
          <el-tag v-if="scope.row.type===3">处置</el-tag>
          <el-tag v-if="scope.row.type===4">草药处方</el-tag>
          <el-tag v-if="scope.row.type===5">成药处方</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态"  width="200">
          <el-tag type="primary">未缴费</el-tag>
      </el-table-column>
    </el-table>
    <p></p>
    <span style="font-family:'微软雅黑'">应付: </span>
    <el-tag size="large" type="info">{{totalamount}}</el-tag>
    <el-select style="width:150px" v-model="settlementCatId" placeholder="请选择支付方式">
      <el-option
        v-for="item in paytype"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <p></p>
    <el-button type="primary" @click="charge">缴费</el-button>
    <el-button type="danger" @click="dialogFormVisible=false">取消</el-button>
  </div>
  <div v-show="refundVisible" style="text-align:center">
    <el-form :model="onepatient" label-width="80px"  label-position="left" :inline="true">
      <el-form-item label="病历号" prop="id" label-width="60px">
          <el-tag style="width:200px" type="info" size="large" placeholder="病历号">{{onepatient.medicalRecordNo}}</el-tag>
      </el-form-item>
      <el-form-item label="患者姓名" prop="name" label-width="70px">
          <el-tag style="width:140px" type="info" size="large" placeholder="病历号">{{onepatient.patientName}}</el-tag>
      </el-form-item>

      <el-form-item label="看诊日期" prop="birth" label-width="70px">
          <el-tag style="width:140px" type="info" size="large" placeholder="病历号">{{onepatient.attendanceDate}}</el-tag>
      </el-form-item>
    </el-form>
    <el-table stripe border :data="paylist" @selection-change="handlechange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="发票号" width="250px">
        <template slot-scope="scope">
          {{scope.row.invoiceIdfNo}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总金额(元)"  width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.amount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="开立时间"  width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目类型"  width="200">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type===1">检查</el-tag>
          <el-tag v-if="scope.row.type===2">检验</el-tag>
          <el-tag v-if="scope.row.type===3">处置</el-tag>
          <el-tag v-if="scope.row.type===4">草药处方</el-tag>
          <el-tag v-if="scope.row.type===5">成药处方</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态"  width="200">
          <el-tag type="success">可退费</el-tag>
      </el-table-column>
    </el-table>
    <p></p>
    <span style="font-family:'微软雅黑'">应退费: </span>
    <el-tag size="large" type="info">{{totalamount}}</el-tag>
    <el-button type="primary" @click="refundmoney">退费</el-button>
    <el-button type="danger" @click="refundVisible=false">取消</el-button>
  </div>
  <el-dialog title="退号" :visible.sync="refundregistVisible" width="400px">
    <el-form :model="refundregist">
      <el-form-item label="发票号" label-width="100px">
        <el-input v-model="invoiceNo" style="width:200px" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="冲红发票号" label-width="100px">
        <el-input v-model="redinvoiceNo" style="width:200px" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="float:right;margin-left:10px" type="danger" @click="refundregistVisible = false">取消</el-button>
        <el-button style="float:right" type="primary" @click="comfirmtuihao">退号</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog title="重打" :visible.sync="reprintregistVisible" width="400px">
    <el-form>
      <el-form-item label="新发票号" label-width="100px">
        <el-input v-model="re1" style="width:200px" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="原发票号" label-width="100px">
        <el-input v-model="re2" style="width:200px" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="float:right;margin-left:10px" type="danger" @click="reprintregistVisible = false">取消</el-button>
        <el-button style="float:right" type="primary" @click="reprint2">重打发票</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog title="补打" :visible.sync="suppregistVisible" width="400px">
    <el-form :model="refundregist">
      <el-form-item label="新发票号" label-width="100px">
        <el-input v-model="re2" style="width:200px" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="float:right;margin-left:10px" type="danger" @click="suppregistVisible = false">取消</el-button>
        <el-button style="float:right" type="primary" @click="supprint2">退号</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>

</template>
<style>
body .el-table th.gutter{
display: table-cell!important;
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

<script>
import {reprintInvoice,supplementPrintInvoice,listRegisteredPatient,createRegistration,listDocBySkd,refundRegistrationCharge,listChargeByRegistrationId,charge,refundCharge,listRefundByRegistrationId} from '@/api/regist'
import { getAllDep} from '@/api/department'
import {selectPatientByIdNo} from '@/api/outpatient/patient'
import {getAllReg} from '@/api/admin'
import {parseTime,formatTime,deepClone} from '@/utils'
import { format } from 'path';
const defaultpatient ={
  id:"",
  name:"",
  male:"",
  birth:"",
  card:"",
  fapiao:"",
  type:"",
  type2:"",
  data1:"",
  data2:"",
  isdone:"",
  isget:"",
  status:"",
  money:"",
  kemu:""
}
export default {
  data(){
    return{
      re1:'',
      re2:'',
      suppregistVisible:false,
      reprintregistVisible:false,
      isbin:0,
      redinvoiceNo:'',
      refundregistVisible:false,
      refundregist:{},
      refundVisible:false,
      settlementCatId:'',
      invoiceNo:'',
      refs:[],
      paymoney:0,
      totalamount:0,
      paylist:[],
      doctList:[],
      regdisabled:true,
      regdisabled2:true,
      alldept:[],
      dmsRegistrationParam:{
        attendanceDate:'',
        deptId:'',
        noon:'',
        amount:0.00,
        skdId:'',
        needBook:'',
        name:'',
        dateOfBirth:'',
        age:'',
        homeAddress:'',
        gender:'',
        phoneNo:'',
        identificationNo:''
      },
      RegisterList:[],
      RegisterRnak:[],
      itemtype:[
        '检查检验',
        '处方',
        '处置'
      ],
      payT:'',
      paytype:[
        {
          value:'1',
          label:'现金'
        },
        {
          value:'2',
          label:'银行卡'
        },
        {
          value:'3',
          label:'医保'
        },
        {
          value:'4',
          label:'信用卡'
        },
        {
          value:'5',
          label:'支付宝'
        },
        {
          value:'6',
          label:'微信'
        },
        {
          value:'7',
          label:'其他'
        }
      ],
      onepatient:Object.assign({},defaultpatient),
      radio:1,
      dialogFormVisible:false,
      isshow:false,
      list:[],
      refundRegisterId:'',
      queryRegister:{
        medicalRecordNo:null,
        queryDate:null,
        pageSize:1000,
        pageNum:1
      },
      total:0,
    };
  },
  created(){
    this.listRegisteredPatient()
    this.getAllDep()
    this.getAllReg()
  },
  methods: {
    supprint(val){
      this.suppregistVisible = true
      this.re1 = val.registrationId
      this.re2 = ''
    },
    supprint2(){
      let data = {}
      data.newInvoiceNo = this.re2
      data.registrationId = this.re1
      supplementPrintInvoice(data).then(res=>{
        this.$notify({
          title: '成功',
          message: '补打发票成功',
          type: 'success',
          duration: 2000
         })
      })
    },
    reprint2(){
      let data = {}
      data.newInvoiceNo = this.re2
      data.oldInvoiceNo = this.re1
      reprintInvoice(data).then(res=>{
        this.$notify({
          title: '成功',
          message: '重打发票成功',
          type: 'success',
          duration: 2000
         })
      })
    },
    reprint(){
      this.re1 = ''
      this.re2 = ''
      this.reprintregistVisible = true
    },
    changeradio1(){
      if(this.isbin===0){
        this.dmsRegistrationParam.amount+=1
        this.isbin =1
      }
    },
    changeradio2(){
      if(this.isbin===1){
        this.dmsRegistrationParam.amount-=1
        this.isbin = 0
      }
    },
    refresh(){
      this.listRegisteredPatient()
    },
    selectPatientByIdNo(){
      this.isshow = true
      this.$prompt('身份证号', '读卡(获取用户身份证号)', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          selectPatientByIdNo(value).then(res=>{
            this.dmsRegistrationParam.name = res.data.name
            this.dmsRegistrationParam.dateOfBirth = res.data.dateOfBirth
            this.dmsRegistrationParam.age = res.data.age
            this.dmsRegistrationParam.homeAddress = res.data.homeAddress
            this.dmsRegistrationParam.gender = res.data.gender
            this.dmsRegistrationParam.phoneNo = res.data.phoneNo  
            this.dmsRegistrationParam.identificationNo = value
            console.log(this.dmsRegistrationParam)
            this.$message({
              type: 'success',
              message: '成功读取患者: ' + this.dmsRegistrationParam.name
            });
          })
        })
    },
    comfirmtuihao(){
      let data = {}
      data.oldInvoiceNo = this.invoiceNo
      data.redInvoiceNo = this.redinvoiceNo
      data.registrationId = this.refundRegisterId
      data.operatorId = this.$store.getters.id
      refundRegistrationCharge(data).then(res=>{
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
         })
         this.refundregistVisible = false 
          this.listRegisteredPatient()
      })
    },
    tuihao(row){
      this.refundregistVisible = true
      this.refundRegisterId = row.registrationId
    },
    refundmoney(){
      if(this.invoiceNo===''||this.invoiceNo===undefined){
        this.$notify({
          title: '警告',
          message: '发票号不能为空！',
          type: 'warning',
          duration: 2000
        })
          return 
      }
      let flag = 1
      let inv = ''
      this.refs.forEach(item=>{
        item.settlementCatId = 1
        item.chargeItemId = item.id
        if(inv === '')
          item.invoiceNo = item.invoiceIdfNo
        else{
          if(item.invoiceIdfNo===inv){
            item.invoiceNo = item.invoiceIdfNo
          }
          else
            flag=0
        }
        if(flag===0){
          this.$notify({
            title: '警告',
            message: '不能同时退不同发票号的项目！',
            type: 'warning',
            duration: 2000
          })
          return 
        }
        item.newInvoiceNo = this.invoiceNo+1
        item.redInvoiceNo = this.invoiceNo
        item.operatorId = this.$store.getters.id
        item.refundAmount = item.amount
      })

      refundCharge(this.refs).then(res=>{
        this.$notify({
          title: '成功',
          message: '退费成功',
          type: 'success',
          duration: 2000
         })
         this.refundVisible = false
         this.listRegisteredPatient()
      })
      this.refundregistVisible = false
      this.listRegisteredPatient()
    },
    charge(){
      if(this.invoiceNo===''||this.invoiceNo===undefined||this.settlementCatId===''||this.settlementCatId===undefined)
      {
        this.$notify({
          title: '信息不完整',
          message: '请填写发票号或选择缴费类型！',
          type: 'danger',
          duration: 2000
         })
        return
      }
      let data = this.refs
      data.forEach(item=>{
        item.chargeItemId = item.id
        item.invoiceNo = this.invoiceNo
        item.opratorId = this.$store.getters.id
        item.settlementCatId = this.settlementCatId
      })
      charge(data).then(res=>{
        this.$notify({
          title: '成功',
          message: '缴费成功',
          type: 'success',
          duration: 2000
         })
        this.dialogFormVisible=false
        this.listRegisteredPatient()
      })
      
    },
    handlechange(val){
      this.refs = val
      this.totalamount = 0
      this.refs.forEach(item=>{
        this.totalamount += item.amount
      })
      this.totalamount = this.totalamount.toFixed(2)
    },
    refundRegistrationCharge(row){
      this.onepatient = deepClone(row)
      listRefundByRegistrationId(row.registrationId).then(res=>{
        this.paylist = res.data
        this.paylist.forEach(item=>{
          if(item.createTime!==null){
            item.createTime = parseTime(item.createTime)
          }
        })
        this.refundVisible = true
      })
    },
    createRegistration(){
      if(this.dmsRegistrationParam.invoiceNo === ''||this.dmsRegistrationParam.invoiceNo===undefined){
        this.$notify({
          title: '信息不完整',
          message: '请输入发票号！',
          type: 'warning',
          duration: 2000
         })
        return
      }
      if(this.dmsRegistrationParam.settlementCatId === ''||this.dmsRegistrationParam.settlementCatId===undefined){
        this.$notify({
          title: '信息不完整',
          message: '请选择支付方式！',
          type: 'warning',
          duration: 2000
         })
        return
      }
      this.dmsRegistrationParam.attendanceDate = parseTime(this.dmsRegistrationParam.attendanceDate).substr(0,10)
      this.dmsRegistrationParam.dateOfBirth = parseTime(this.dmsRegistrationParam.dateOfBirth).substr(0,10)
      this.dmsRegistrationParam.opratorId = this.$store.getters.id
      createRegistration(this.dmsRegistrationParam).then(res=>{
        this.$notify({
          title: '成功',
          message: '挂号成功',
          type: 'success',
          duration: 2000
         })
         this.isshow=false
         this.listRegisteredPatient()
         this.dmsRegistrationParam = {}
      })
    },
    choosenoon(val){
      if(val!=='')
        this.listDocBySkd()
    },
    listDocBySkd(){
      let data ={}
      data.date = parseTime(this.dmsRegistrationParam.attendanceDate).substr(0,10)
      data.deptId = this.dmsRegistrationParam.deptId
      data.noon = this.dmsRegistrationParam.noon
      data.registrationRankId = this.dmsRegistrationParam.RegisterRnak
      listDocBySkd(data).then(res=>{
        this.doctList = res.data
        this.regdisabled2=false
      })
    },
    chooseRegister(val){
      if(this.dmsRegistrationParam.RegisterRnak===1&&this.dmsRegistrationParam.attendanceDate!==''&&this.dmsRegistrationParam.deptId!==''){
        this.regdisabled = false
        this.regdisabled2 = false
      }
      else{
        this.regdisabled = true
        this.dmsRegistrationParam.noon = ""
        this.dmsRegistrationParam.skdId = ""
      }
      this.RegisterRank.forEach(item=>{
        if(item.id===this.dmsRegistrationParam.RegisterRnak){
          this.dmsRegistrationParam.amount=item.price
          if(this.dmsRegistrationParam.needBook)
            this.dmsRegistrationParam.amount+=1
        }
      })
    },
    getAllReg(){
      getAllReg().then(res=>{
        this.RegisterRank = res.data
      })
    },
    getAllDep(){
      getAllDep().then(res=>{
        this.alldept = res.data
      })
    },
    listRegisteredPatient(){
      listRegisteredPatient(this.queryRegister).then(res=>{
        this.RegisterList = res.data.list
        this.RegisterList.forEach(item=>{
          item.patientDateOfBirth = item.patientDateOfBirth.substr(0,10)
          item.attendanceDate = item.attendanceDate.substr(0,10)
        })
        console.log(this.RegisterList)
        this.total = res.data.total
      })
    },
    guahao(){
      this.isshow=!this.isshow;
    },
    handlepay(row){
      this.onepatient = deepClone(row)
      console.log(this.onepatient)
      listChargeByRegistrationId(row.registrationId).then(res=>{
        this.paylist = res.data
        this.paylist.forEach(item=>{
          if(item.createTime!==null){
            item.createTime = parseTime(item.createTime)
          }
        })
      })
      this.dialogFormVisible=true
    }
  },
}
</script>

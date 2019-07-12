<template>
  <div>
  <!-- 确诊 -->
  <el-container>
  <el-aside :width="mainwidth" style="background:white;">
    <el-tag style="margin-bottom:20px;margin-left:-20px" type="info">初诊内容:</el-tag>
    <el-button style="float:right" @click="controlfast"><i v-show="!isclose" class="el-icon-caret-right" /><i v-show="isclose" class="el-icon-caret-left" />  快捷操作</el-button>
    <el-form :model="prerecord" disabled style="color:black">
      <el-form-item label="主诉"><el-input readonly v-model="prerecord.chiefComplaint" type="textarea" :autosize="{ minRows: 2, maxRows: 3}" placeholder="主述" style="width:80%;float:right;"></el-input></el-form-item>
      <el-form-item label="现病史"><el-input readonly v-model="prerecord.historyOfPresentIllness" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="现病史"  style="width:80%;float:right;"></el-input></el-form-item>
      <el-form-item label="现病治疗情况"><el-input readonly v-model="prerecord.historyOfTreatment" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="现病治疗情况" style="width:80%;float:right"></el-input></el-form-item>
      <el-form-item label="既往史"><el-input readonly v-model="prerecord.pastHistory" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="既往史" style="width:80%;float:right"></el-input></el-form-item>
      <el-form-item label="过敏史"><el-input readonly v-model="prerecord.allergies" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="过敏史" style="width:80%;float:right"></el-input></el-form-item>
      <el-form-item label="体格检查"><el-input readonly v-model="prerecord.healthCheckup" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="体格检查" style="width:80%;float:right"></el-input></el-form-item>
    </el-form>
    <el-tag style="margin-bottom:20px;margin-left:-20px">检查检验结果:</el-tag>
    <el-form :model="record"> 
      <el-form-item label="检查结果"><el-input v-model="prerecord.checkResult" placeholder="检查结果" style="width:40%"></el-input></el-form-item>
      <el-form-item label="检验结果"><el-input v-model="prerecord.testResult" placeholder="检验结果" style="width:40%"></el-input></el-form-item>
    </el-form>
    <div style="margin-left:-20px;margin-bottom:30px">
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
    </div>
    <div>
      <el-button type="primary" style="float:right;margin-right:30px" @click="submitdefinite">提交</el-button>
    </div>
  </el-aside>
  <transition name="el-zoom-in-left">
  <el-main width="50%" v-show="isclose" style="border-style: dotted;border-width: 0px 0px 0px 1px;border-color:#C0C0C0;margin-top:-12px">
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="常用诊断" name="first">
        <el-table :data="medicineDiseIdList" @row-click="selectDis">
          <el-table-column label="ICD编码" prop="icd"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
        </el-table>
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
    <pagination style="margin-top:0px" v-show="total>0" :total="total" page-sizes="[]" :page.sync="disQuery.pageNum" :limit.sync="disQuery.pageSize" @pagination="getDis" />
    </div>
  </el-dialog>
  </div>
</template>
<script>  
import {getnonend,submitdefinite} from '@/api/outpatient/dmscase'
import {getDmsDislist,parseList} from '@/api/diagnosis'
import Pagination from '@/components/Pagination'
import {selectByType} from '@/api/outpatient/frequentuse'
import {parseTime} from '@/utils'
export default {
  props:['patient'],
  components: {Pagination},
  name:'Comfirm',
  data(){
    return{
      medicineDiseIdList:[],
      dialogTableVisible:false,
      total:0,
      record:[],
      disQuery: {
        catId: '',
        code: '',
        name: '',
        icd: '',
        status: '',
        pageSize: 8,
        pageNum: 1
      },
      disList:[],
      prerecord:{},
      activeName:'first',
      isclose:true,
      mainwidth:"60%",
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
      ]
    };
  },
  created(){
    this.getmedicineDiseIdList()
  },
  watch:{
    'patient' : function(newVal, oldVal){
      this.patient = newVal
      this.getnonend()
    },
  },
  methods:{
    getmedicineDiseIdList(){
      selectByType({staffId:this.$store.getters.id,selectType:2}).then(res=>{
        this.medicineDiseIdList = res.data.medicineDiseList
      })
    },
    submitdefinite(){
      this.prerecord.definiteDiseStrList = ''
      this.record.forEach(item=>{
        this.prerecord.definiteDiseStrList += (item.id+',')
      })
      this.prerecord.startDate = parseTime(this.prerecord.startDate).substr(0,10)
      this.prerecord.createTime = parseTime(this.prerecord.createTime).substr(0,10)
      this.prerecord.definiteDiseStrList = this.prerecord.definiteDiseStrList.substr(0, this.prerecord.definiteDiseStrList.length - 1);
      submitdefinite(this.prerecord).then(res=>{
          this.$notify({
          title: '成功',
          message: '已确诊!',
          type: 'success',
          duration: 2000
        })
        this.$emit('comfirmdms')
        
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
    addDis(){
      this.dialogTableVisible=true
      this.getDis()
    },
    async getDis(){
      const res = await getDmsDislist(this.disQuery)
      this.disList = res.data.list
      this.total = res.data.total
    },
    getnonend(){
      getnonend(this.patient.registrationId).then(res=>{
        this.prerecord = res.data.dmsCaseHistoryList[0]
        parseList(this.prerecord.priliminaryDiseIdList).then(res=>{
          this.record = res.data
        })
      })
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

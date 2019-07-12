<template>
  <!-- 草药药房工作台 -->
  <div class="div1">
    <el-container>
    <!-- 左侧患者列表 -->
    <transition name="el-zoom-in-left">

    <el-aside width="350px" v-show="isaside" style="padding:0 0 0 0">
      <div>
      <el-card style="width:350px">
      <span style="font-family:'微软雅黑';font-size:13px">查询患者名:</span>
      <el-input placeholder="患者名" style="width: 180px;" v-model="searchpatient" class="filter-item input1" />
      <el-button type="primary"  style="width: 20px;"><svg-icon icon-class="search" style="margin-left:-6px"/></el-button>
      <el-tabs type="card" v-model="activeName" style="margin-top:15px">
      <el-tab-pane  label="未发药" name="first">
      <el-tag style="width:100%">未发药</el-tag>
      <el-table stripe :data="undoPatientList.filter(data => !searchpatient || data.patientName.toLowerCase().includes(searchpatient.toLowerCase())||data.medicalRecordNo.toLowerCase().includes(searchpatient.toLowerCase()))" height="480" highlight-current-row @row-click="handleGive">
        <el-table-column align="center" label="病历号">
          <template slot-scope="scope">
            {{scope.row.medicalRecordNo}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名字">
          <template slot-scope="scope">
            {{scope.row.patientName}}
          </template>
        </el-table-column>
      </el-table>
      
      </el-tab-pane>
      <el-tab-pane   label="已发药" name="second">
      <el-tag type="warning" style="width:100%">已发药</el-tag>
      <el-table stripe :data="donePatientList.filter(data => !searchpatient || data.patientName.toLowerCase().includes(searchpatient.toLowerCase())||data.medicalRecordNo.toLowerCase().includes(searchpatient.toLowerCase()))" height="460" highlight-current-row @row-click="handleGiven">
        <el-table-column align="center" label="病历号">
          <template slot-scope="scope">
            {{scope.row.medicalRecordNo}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名字">
          <template slot-scope="scope">
            {{scope.row.patientName}}
          </template>
        </el-table-column>
      </el-table>
      </el-tab-pane>
      </el-tabs>
      </el-card>
      </div>
    </el-aside>
    </transition>
    <!-- 未发药 -->
    <el-main style="padding:0 0 0 0" v-show="!isGiven">
      <aside>
        <el-button size="mini" style="width:40px;padding-left:13px" type="primary" @click="showaside"><i v-show="isaside" class="el-icon-arrow-left" /><i v-show="!isaside" class="el-icon-arrow-right" /></el-button>
        <span style="margin-left:15px;font-size:14px;font-family: '微软雅黑';">当前患者：</span>
        <el-tag class="painfo" color="white" style="width:15%;font-family:'微软雅黑'">姓名: <span style="color:black;">{{patient.patientName}}</span></el-tag>
        <el-tag class="painfo" color="white" style="width:25%;font-family:'微软雅黑'">就诊号: <span style="color:black">{{patient.medicalRecordNo}}</span></el-tag>
        <el-button type="success" plain style="float:right;" @click="sendDrug"><svg-icon icon-class="skill" />发药</el-button>
      </aside>
      <el-table height="600px" border stripe highlight-current-row :data="druglist" style="margin-left:10px" :span-method="objectSpanMethod" @selection-change="changedep">
        <el-table-column type="selection" width="55" @selection-change="changedep"></el-table-column>
        <el-table-column align="center" label="处方号" width="100px">
          <template slot-scope="scope">
            {{scope.row.prescriptionId}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="处方名" width="100px">
          <template slot-scope="scope">
            {{scope.row.cname}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="药品名">
          <template slot-scope="scope">
            {{scope.row.drugName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="药品数量">
          <template slot-scope="scope">
            {{scope.row.sequence}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="单价">
          <template slot-scope="scope">
            {{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开立医生">
          <template slot-scope="scope">
            {{scope.row.doctorname}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用量">
          <template slot-scope="scope">
            {{scope.row.usageNum}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="单位">
          <template slot-scope="scope">
            {{scope.row.usageNumUnit}}
          </template>
        </el-table-column>
        <el-table-column align="center">
          <el-tag type="primary">未取药</el-tag>
        </el-table-column>
      </el-table>
      
    </el-main>
    <!-- 已发药 -->
    <el-main style="padding:0 0 0 0" v-show="isGiven">
      <aside>
        <el-button size="mini" style="width:40px;padding-left:13px" type="primary" @click="showaside"><i v-show="isaside" class="el-icon-arrow-left" /><i v-show="!isaside" class="el-icon-arrow-right" /></el-button>
        <span style="margin-left:15px;font-size:14px;font-family: '微软雅黑';">当前患者：</span>
        <el-tag class="painfo" color="white" style="width:15%;font-family:'微软雅黑'">姓名: <span style="color:black;">{{patient.patientName}}</span></el-tag>
        <el-tag class="painfo" color="white" style="width:25%;font-family:'微软雅黑'">就诊号: <span style="color:black">{{patient.medicalRecordNo}}</span></el-tag>
        <el-button type="danger" plain style="float:right;" disabled><svg-icon icon-class="skill" />退药</el-button>
      </aside>
      <el-table height="600px" border stripe highlight-current-row :data="druglistgiven" style="margin-left:10px" @selection-change="changedep">
        <el-table-column type="selection" width="55" @selection-change="changedep"></el-table-column>
        <el-table-column align="center"  label="处方id">
          <template slot-scope="scope">
            {{scope.row.prescriptionId}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="药品名">
          <template slot-scope="scope">
            {{scope.row.drugName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="单价">
          <template slot-scope="scope">
            {{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            {{scope.row.currentNum}}
          </template>
        </el-table-column>
        <el-table-column align="center">
          <el-tag type="warning">已取药</el-tag>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="refund(scope.row)">退药</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    </el-container>
    <el-dialog title="选择退药数量" :visible.sync="refundVisible" width="250px">
      <el-form>
        <el-form-item  label="退药数量">
          <el-input style="width:100px" v-model="refundamout" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" style="float:right" @click="refundDrug">退药</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>


</template>

<script>
import {listPatient,releaseDrug,refundDrug} from '@/api/drugstore'
import {parseTime,formatTime,deepClone} from '@/utils'
import {listByIds} from '@/api/outpatient/cprescription'
  export default{
    data(){
      return{
        selectid:'',
        refundVisible:false,
        refundamout:1,
        refundlimit:0,
        refundid:'',
        searchpatient:'',
        sendrefs:[],
        druglist:[],
        druglistgiven:[],
        patient:{},
        undoPatientList:[],
        donePatientList:[],
        visible:false,
        isGiven:false,
        spanArr:[],
        isaside: true,
        activeName: 'first',
        activeName2: 'first',
        position:0
      };
    },
    created(){
      this.listPatient()
    },
    methods: {
      refundDrug(){
        if(this.refundamout>this.refundlimit){
          this.$notify({
            title: '错误',
            message: '输入数量大于可退药数量！',
            type: 'warning',
            duration: 2000
          })
        }
        else if(this.refundamout<=0){
          this.$notify({
            title: '错误',
            message: '退药数量不能小于1！',
            type: 'warning',
            duration: 2000
          })
        }
        else{
          let data = {}
          data.excutorId = this.$store.getters.id
          data.refundItemList = []
          let temp = {}
          temp.refundNum = this.refundamout 
          temp.refundPrescriptionItemId = this.refundid
          temp.type = 4
          data.refundItemList.push(temp)
          refundDrug(data).then(res=>{
            this.$notify({
              title: '成功',
              message: '退药成功',
              type: 'success',
              duration: 2000
            })
            this.refundVisible = false
            this.listPatient()
            this.druglistgiven = []
          })
        }
      },
      refund(val){
        this.refundVisible = true
        this.refundlimit = val.currentNum
        this.refundid = val.drugid
      },
      sendDrug(){
        this.sendrefs.forEach(item=>{
          releaseDrug(item.prescriptionId,4).then(res=>{
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.listPatient()
            this.druglist = []
            this.druglistgiven = []
          })
        })
      },
      changedep(val){
        this.sendrefs = val
      },
      rowspan() {
      this.spanArr = [];//在data里面定义
      this.position = 0; //在data里面定义
      this.druglist.forEach((item,index) => {
        if( index === 0){
          this.spanArr.push(1);
          this.position = 0;
          item.sequence=index+1;//设置序号
        }else{
          if(this.druglist[index].id === this.druglist[index-1].id ){
            this.spanArr[this.position] += 1;//连续有几行项目名名称相同
            this.spanArr.push(0); // 名称相同后往数组里面加一项0
            //当项目名称相同时，设置当前序号和前一个相同
            this.druglist[index].sequence = this.druglist[index-1].sequence;
          }else{
            this.spanArr.push(1);
            this.position = index;
            //当项目名称不同时，将当前序号设置为前一个序号+1
            this.druglist[index].sequence = this.druglist[index-1].sequence+1;
          }
        }
      })
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
        if(columnIndex === 0){  //序号列也进行合并(第一列)
          //this.spanArr这个数组里面存的是table里面连续的有几条数据相同
          //例如:[1,1,2,0,2,0]
          //1  代表的没有连续的相同的
          //2  代表连续的两个相同
          //0  代表是和上一条内容相同
          const _row = this.spanArr[rowIndex];
          const _col = _row>0 ? 1 : 0;

          return {
            rowspan: _row, //行
            colspan: _col  //列
          }
        }
        if(columnIndex === 1){ //项目列也进行合并(第二列)
          const _row = this.spanArr[rowIndex];
          const _col = _row>0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      listPatient(){
        let data = {}
        data.queryDate = parseTime(new Date())
        data.queryDate = data.queryDate.substr(0,10)
        data.type = 4
        listPatient(data).then(res=>{
          this.undoPatientList = res.data.undoPatientList
          this.donePatientList = res.data.donePatientList
        })
      },
      handleGive2(){
        let data = {}
        data.queryDate = parseTime(new Date()).substr(0,10)
        data.type = 4
        listPatient(data).then(res=>{
          this.undoPatientList = res.data.undoPatientList
          this.donePatientList = res.data.donePatientList
          let flag = 0
          this.undoPatientList.forEach(item=>{
            if(item.patientId===this.patient.patientId){
              flag = 1
              this.patient = deepClone(item)
            }
          })
          this.druglist = []
          this.isGiven=false;
          let data = ''
          this.patient.prescriptionIdList.forEach(item=>{
            data += (item+',')
          })
          data = data.substr(0,data.length-1)
          listByIds(data).then(res=>{
            res.data.forEach(item=>{
              let temp = item.id
              item.dmsHerbalItemRecordResultList.forEach(drug=>{
                drug.drugid = drug.id
                drug.id = temp
                this.druglist.push(deepClone(drug))
              })
            })
            this.rowspan()
          })
        })
        
      },
      handleGive(val){
        this.druglist = []
        this.isGiven=false;
        this.patient = deepClone(val)
        let data = ''
        this.patient.prescriptionIdList.forEach(item=>{
          data += (item+',')
        })
        data = data.substr(0,data.length-1)
        listByIds(data).then(res=>{
          res.data.forEach(item=>{
            let temp = item.id
            let temp2 = item.name
            let temp3 = item.createStaffName
            item.dmsHerbalItemRecordResultList.forEach(drug=>{
              drug.drugid = drug.id
              drug.id = temp
              drug.doctorname = temp3
              drug.cname = temp2
              this.druglist.push(deepClone(drug))
            })
          })
          this.rowspan()
        })
        
      },
      handleGiven(val){
        this.isGiven=true;
        this.druglistgiven = []
        this.patient = deepClone(val)
        let data = ''
        this.patient.prescriptionIdList.forEach(item=>{
          data += (item+',')
        })
        data = data.substr(0,data.length-1)
        listByIds(data).then(res=>{
          res.data.forEach(item=>{
            let temp = item.id
            let temp2 = item.name
            let temp3 = item.createStaffName
            item.dmsHerbalItemRecordResultList.forEach(drug=>{
              drug.drugid = drug.id
              drug.id = temp
              drug.doctorname = temp3
              drug.cname = temp2
              this.druglistgiven.push(deepClone(drug))
            })
          })
        })
      },
      showaside(){
        this.isaside = !this.isaside
      },
      register(){
        this.$confirm('确定为 王小虎1 登记项目 验血 吗?', '项目登记', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      }
  }
}
</script>
<style>
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
    body .el-table th.gutter{
display: table-cell!important;
}
</style>


  
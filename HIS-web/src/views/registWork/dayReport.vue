<template>
  <div>
    <el-container>
      <el-header style="padding:0 0 0 0">
        <aside style="margin:0 0 0 0">
          <el-button disabled style="color:black">门诊日结</el-button>
        </aside>
        <div style="margin-left:30px;margin-top:15px">
          <el-form inline>
            <el-form-item label="起始日期">
               <el-date-picker
                disabled
                type="datetime"
                v-model="starttime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="截止日期">
               <el-date-picker
                v-model="endtime"
                type="datetime"
                @change="search"
                :picker-options="pickerOptions"
                placeholder="截止日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryInvoiceInfo">搜索</el-button>
              <el-button type="primary" @click="dailySettle">结算报账</el-button>
              <el-button type="primary" @click="print">打印</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main style="padding-top:0;margin-top:58px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="日结单" name="first" style="text-align:center">
            <div id="table" v-if="rijiedan" style="width:1200px;text-align:center;padding-left:200px">
              <span>东大云医院门诊收费日结单</span>
              <table cellpadding="5" border="1" style="border:#DEDEDE;padding:1px" cellspacing="0">
                <tr>
                  <td style="width:200px">日结时间范围</td>
                  <td colspan="8">{{reportdetail.startDatetime}}-{{reportdetail.endDatetime}}</td>
                </tr>
                <tr>
                  <td>报账人编号</td>
                  <td>{{reportdetail.cashierId}}</td>
                  <td>收款人编号</td>
                  <td>{{reportdetail.cashierId}}</td>
                  <td>制表时间</td>
                  <td colspan="4">{{reportdetail.createDatetime}}</td>
                </tr>
                <tr>
                  <td>常规发票号</td>
                  <td colspan="6">{{reportdetail.startEndInvoiceIdStr}}</td>
                  <td colspan="2">共计{{reportdetail.invoiceNum}}张</td>
                </tr>
                <tr>
                  <td>冲红发票号</td>
                  <td colspan="6">{{reportdetail.rushInvoiceIdListStr}}</td>
                  <td colspan="2">共计{{reportdetail.rushInvoiceNum}}张</td>
                </tr>
                <tr>
                  <td>重打发票号</td>
                  <td colspan="6">{{reportdetail.reprintInvoiceIdListStr}}</td>
                  <td colspan="2">共计{{reportdetail.reprintInvoiceNum}}张</td>
                </tr>
                <tr>
                  <td style="width:20%">金额统计</td>
                  <td style="width:10%">检查金额</td>
                  <td style="width:10%">{{reportdetail.checkAmount}}</td>
                  <td style="width:10%">检验金额</td>
                  <td style="width:10%">{{reportdetail.testAmount}}</td>
                  <td style="width:10%">挂号金额</td>
                  <td style="width:10%">{{reportdetail.registrationAmount}}</td>
                  <td style="width:10%"></td>
                  <td style="width:10%"></td>
                </tr>
                <tr>
                  <td></td>
                  <td>成药金额</td>
                  <td>{{reportdetail.medicineAmount}}</td>
                  <td>草药金额</td>
                  <td>{{reportdetail.herbalAmount}}</td>
                  <td>处置金额</td>
                  <td>{{reportdetail.dispositionAmount}}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>缴费方式</td>
                  <td>医保金额</td>
                  <td>{{reportdetail.insuranceAmount}}</td>
                  <td>银行卡金额</td>
                  <td>{{reportdetail.bankCardAmount}}</td>
                  <td>支付宝金额</td>
                  <td>{{reportdetail.alipayAmount}}</td>
                  <td>微信金额</td>
                  <td>{{reportdetail.wechatAmount}}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>信用卡金额</td> 
                  <td>{{reportdetail.creditCardAmount}}</td>
                  <td>其他金额</td> 
                  <td>{{reportdetail.otherAmount}}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>总金额</td>
                  <td>{{reportdetail.amount}}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发票信息" name="second">
            <el-table :data="InvoiceInfoList" stripe>
              <el-table-column label="发票号" prop="invoiceNo"></el-table-column>
              <el-table-column label="发票金额" prop="amount"></el-table-column>
              <el-table-column label="发票时间" prop="createTime"></el-table-column>
              <el-table-column label="账单号" prop="billId"></el-table-column>  
              <el-table-column label="支付类型" prop="settlementCatName"></el-table-column>
              <el-table-column label="收费员id" prop="operatorId"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import {parseTime,formatTime} from '@/utils'
import {queryRecentEndDatetime,queryInvoiceInfo,dailySettle,querySettleDetailById} from '@/api/dayreport'
import { parse } from 'path';
export default {
  data(){
    return{
      rijiedan:false,
      reportdetail:[],
      InvoiceInfoList:[],
      starttime:'2019-06-10 14:10:45',
      endtime:'',
      activeName:'first',
       pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
      },
      test:[
        {
          id:111,
          name:222,
        },
        {
          id:111,
          name:222,
        },
        {
          id:111,
          name:222,
        },
        {
          id:111,
          name:222,
        },
      ]
    };
  },
  created(){
    queryRecentEndDatetime(this.$store.getters.id).then(res=>{
      this.starttime = parseTime(res.data)
    })
  },
  methods:{
    print(e){
      const subOutputRankPrint = document.getElementById('table')
      const newContent = subOutputRankPrint.innerHTML
      const oldContent = document.body.innerHTML
      document.body.innerHTML = newContent
      window.print()
      window.location.reload()
      document.body.innerHTML = oldContent
      return false
    },
    querySettleDetailById(data){
      querySettleDetailById(data).then(res=>{
        this.reportdetail = res.data
        this.reportdetail.startDatetime = parseTime(this.reportdetail.startDatetime)
        this.reportdetail.endDatetime = parseTime(this.reportdetail.endDatetime)
        this.reportdetail.createDatetime = parseTime(this.reportdetail.createDatetime)
      })
    },
    queryInvoiceInfo(){
      let data = {}
      data.cashierId = this.$store.getters.id
      data.startDatetime = parseTime(this.starttime)
      data.endDatetime = parseTime(this.endtime)
      queryInvoiceInfo(data).then(res=>{
        this.InvoiceInfoList = res.data
        this.InvoiceInfoList.forEach(item=>{
          item.createTime = parseTime(item.createTime)
        })
      })
    },
    dailySettle(){
      let data = {}
      data.cashierId =this.$store.getters.id
      data.startDatetime = parseTime(this.starttime)
      data.endDatetime = parseTime(this.endtime)
      dailySettle(data).then(res=>{
        this.$notify({
          title: '成功',
          message: '已生成日结单',
          type: 'success',
          duration: 2000
        })
        this.rijiedan = true
        this.querySettleDetailById(res.data)
      })
      
    }
  }
}
</script>

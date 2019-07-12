<template>
  <div>
    <el-table :data="bill" height="530px">
      <el-table-column label="项目名" prop="itemName"></el-table-column>
      <el-table-column label="规格" prop="format"></el-table-column>
      <el-table-column label="数量" prop="currentNum"></el-table-column>
      <el-table-column label="单价" prop="price"></el-table-column>
      <el-table-column label="总金额" prop="totalprice"></el-table-column>
      <el-table-column label="类型" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type===0">检查</span>
          <span v-if="scope.row.type===1">检验</span>
          <span v-if="scope.row.type===2">处置</span>
          <span v-if="scope.row.type===4">草药处方</span>
          <span v-if="scope.row.type===5">成药处方</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.status===1">未缴费</el-tag>
          <el-tag type="danger" v-if="scope.row.status===0">作废</el-tag>
          <el-tag type="success" v-if="scope.row.status===2">已缴费</el-tag>
          <el-tag type="success" v-if="scope.row.status===3">已登记</el-tag>
          <el-tag type="success" v-if="scope.row.status===4">已执行</el-tag>
          <el-tag type="danger" v-if="scope.row.status===5">已退费</el-tag>
          <el-tag type="danger" v-if="scope.row.status===6">已过期</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {listByRegistration} from '@/api/outpatient/feequery'
export default {
  name: 'Bill',
  props:['patient'],
  watch:{
    'patient' : function(newVal, oldVal){
      this.patient = newVal
      this.queryBill()
    },
  },
  data(){
    return{
      bill:[]
    };
  },
  created(){
    
  },
  methods: {
    queryBill(){
      listByRegistration(this.patient.registrationId).then(res=>{
        this.bill = res.data
        this.bill.forEach(item=>{
          item.totalprice = item.price*item.currentNum
        })
      })
    }
  },
}
</script>

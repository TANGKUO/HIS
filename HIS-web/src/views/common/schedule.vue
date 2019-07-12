<template>
  <!-- 排班表 -->
  <div style="margin:10px 10px 10px 10px">
    <div style="padding: 5px 5px 5px 5px; margin-top:20px">
      <el-table :data="schedule" stripe border >
        <el-table-column label="日期" prop="date"></el-table-column>
        <el-table-column label="午别" prop="noon">
          <template slot-scope="scope">
            <span v-if="scope.row.noon===0">上午</span>
            <span v-if="scope.row.noon===1">下午</span>
          </template>
        </el-table-column>
        <el-table-column label="科室" prop="deptName"></el-table-column>  
        <el-table-column label="值班医生" prop="staffName"></el-table-column>
        <el-table-column label="挂号级别" prop="registrationRank"></el-table-column>
        
        <el-table-column label="排班限额" prop="skLimit"></el-table-column>
        <el-table-column label="剩余号数" prop="remain"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {querySkd} from '@/api/schedule'
import {parseTime} from '@/utils'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  data(){
    return{
      schedule:[],
      listQuery:{
        staffId:this.$store.getters.id,
        startDate:null,
        endDate:null,
        noon:null,
        deptId:null,
        registrationRankId:null,
        pageSize:10000
      }
    };
  },
  created(){
    this.querySkd()
  },
  methods:{
    checkPermission,
    querySkd(){
      if(checkPermission([1,7])){
        this.listQuery.staffId = null
        querySkd(this.listQuery).then(res=>{
        this.schedule = res.data.list
        this.schedule.forEach(item=>{
          item.date = parseTime(item.date).substr(0,10)
        })
      })
      }
      else{
        querySkd(this.listQuery).then(res=>{
        this.schedule = res.data
        this.schedule.forEach(item=>{
          item.date = parseTime(item.date).substr(0,10)
        })
      })
      }
      
    }
  }
  
}
</script>

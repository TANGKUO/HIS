<template>
  <!-- 主页 -->
  <div class="dashboard-editor-container">
    <!-- 3个统计模块+1个时间显示 -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" /> 

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <!-- 线图 -->
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import {staffPatients,deptPatients,totalPatients} from '@/api/charts'
const lineChartData = {
  newVisitis: {
    dateOfSevenDays: ["2019-06-20", "2019-06-21", "2019-06-22", "2019-06-23", "2019-06-24", "2019-06-25", "2019-06-26"],
    numOfPatients: [0, 0, 0, 0, 0, 0, 0]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  created(){
    staffPatients(this.$store.getters.id).then(res=>{
        this.lineChartData = res.data
        this.lineChartData.label = 2
      })
  },
  methods: {
    totalPatients(){
      totalPatients().then(res=>{
        this.lineChartData = res.data
        this.lineChartData.label = 1
      })
    },
    staffPatients(){
      staffPatients(this.$store.getters.id).then(res=>{
        this.lineChartData = res.data
        this.lineChartData.label = 2
      })
    },
    deptPatients(){
      deptPatients(this.$store.getters.deptId).then(res=>{
        this.lineChartData = res.data
        this.lineChartData.label = 3
      })
    },
    handleSetLineChartData(type) {
      if(type==='personpatient'){
        this.staffPatients()
      }
      else if(type==='deptpatient'){
        this.deptPatients()
      }
      else if(type==='allpatient'){
        this.totalPatients()
      }
      else{

      }
      //this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

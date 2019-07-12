<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {deptClassifyStatistics} from '@/api/charts'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      data:{},
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.deptClassifyStatistics()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    deptClassifyStatistics(){
      deptClassifyStatistics(this.$store.getters.deptId).then(res=>{
        this.data = res.data
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title:{
          left:'center',
          text:'科室分类费用统计',
          fontSize:1
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.data.dateOfSevenDays,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '处置费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: this.data.dispositionAmount,
          animationDuration
        }, {
          name: '检查费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: this.data.checkAmount,
          animationDuration
        }, {
          name: '检验费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: this.data.testAmount,
          animationDuration
        }, {
          name: '西药费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: this.data.medicineAmount,
          animationDuration
        }, {
          name: '中药费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: this.data.herbalAmount,
          animationDuration
        }]
      })
    }
  }
}
</script>

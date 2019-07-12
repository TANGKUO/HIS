<template>
  <!-- 常用项管理 -->
  <div>
    <div style="margin-left:40px;margin-top:40px">
      <el-form :model="frequent" inline>
        <el-form-item label="常用项类别">
          <el-select v-model="frequent.type" clearable style="width: 130px" class="filter-item" @change="selectByType">
              <el-option v-for="item in [{key:1,value:'检查'},{key:2,value:'诊断'},{key:3,value:'处置'},{key:4,value:'检验'},{key:6,value:'成药'},{key:7,value:'草药'}]" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showitemlist">增加常用项</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="loadItemList" :data="freqlist" style="margin-left:2%;width:95%">
      <el-table-column label="项目名" prop="name"></el-table-column>
      <el-table-column label="项目单价" prop="price" v-if="frequent.type!==2"></el-table-column>
      <el-table-column label="ICD编码" prop="icd" v-if="frequent.type===2"></el-table-column>
      <el-table-column label="项目编码" prop="code"></el-table-column>
      <el-table-column label="">
        <template slot-scope="scope">
          <el-button type="text" @click="delitem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="itemvisible" title="增加常用项" width="800px">
      <el-input style="width:40%" v-model="searchitem" placeholder="搜索项目名" @change="showitemlist"></el-input>
      <el-table :data="itemlist" highlight-current-row @row-click="selectItem">
        <el-table-column label="项目名" width="300px" prop="name"></el-table-column>
        <el-table-column label="项目单价" prop="price"></el-table-column>
        <el-table-column label="项目编码" prop="code"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page.pageNum" :limit.sync="page.pageSize" @pagination="showitemlist" />
    </el-dialog>
  </div>
</template>
<script>
import {selectByType,addfre,delfre} from '@/api/outpatient/frequentuse'
import {getdrugList} from '@/api/drug'
import {getNondrugList} from '@/api/non_drug'
import {getDmsDislist} from '@/api/diagnosis'
import Pagination from '@/components/Pagination'
export default {
  components: {Pagination},
  data(){
    return{
      searchitem:'',
      loadItemList:false,
      frequent:{
        type: 6
      },
      freqlist:[],
      itemlist:[],
      itemvisible:false,
      total:0,
      page:{
        pageSize:10,
        pageNum:1
      }
    }
  },
  created() {
    this.selectByType()
  },
  methods: {
    delitem(val){
      this.$confirm('确认将 '+val.name+' 从常用项删除?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.loadItemList = true
        let data  = {}
        data.deleteId = val.id
        if(this.frequent.type===7)
          data.deleteType = 6
        else
          data.deleteType = this.frequent.type
        data.staffId = this.$store.getters.id
        delfre(data).then(res=>{
          this.$notify({
            title: '成功',
            message: res.message,
            type: 'success',
            duration: 2000
          })
          this.selectByType()
        })
        this.loadItemList = false
        this.itemvisible = false
      })
    },
    selectItem(val){
      this.$confirm('确认将 '+val.name+' 加入常用项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.loadItemList = true
        let data  = {}
        data.addId = val.id
        if(this.frequent.type===7)
          data.addType = 6
        else
          data.addType = this.frequent.type
        data.staffId = this.$store.getters.id
        addfre(data).then(res=>{
          this.$notify({
            title: '成功',
            message: res.message,
            type: 'success',
            duration: 2000
          })
          this.selectByType()
        })
        this.loadItemList = false
        this.itemvisible = false
      })
    },
    showitemlist(){

      let data ={}
      data.name = this.searchitem
      this.itemvisible = true
      if(this.frequent.type===6){
        data.typeId = 101
        data.pageSize = this.page.pageSize
        data.pageNum = this.page.pageNum
        getdrugList(data).then(res=>{
          this.itemlist = res.data.list
          this.total = res.data.total
        })
      }
      else if(this.frequent.type===7){
        data.typeId = 103
        data.pageSize = this.page.pageSize
        data.pageNum = this.page.pageNum
        getdrugList(data).then(res=>{
          this.itemlist = res.data.list
          this.total = res.data.total
        })
      }
      else if(this.frequent.type===1){
        data.recordType = 1
        data.pageSize = this.page.pageSize
        data.pageNum = this.page.pageNum
        getNondrugList(data).then(res=>{
          this.itemlist = res.data.list
          this.total = res.data.total
        })
      }
      else if(this.frequent.type===4){
        data.recordType = 2
        data.pageSize = this.page.pageSize
        data.pageNum = this.page.pageNum
        getNondrugList(data).then(res=>{
          this.itemlist = res.data.list
          this.total = res.data.total
        })
      }
      else if(this.frequent.type===3){
        data.recordType = 3
        data.pageSize = this.page.pageSize
        data.pageNum = this.page.pageNum
        getNondrugList(data).then(res=>{
          this.itemlist = res.data.list
          this.total = res.data.total
        })
      }
      else if(this.frequent.type===2){
        data.recordType = 2
        data.pageSize = this.page.pageSize
        data.pageNum = this.page.pageNum
        getDmsDislist(data).then(res=>{
          this.itemlist = res.data.list
          this.total = res.data.total
        })
      }
    },
    selectByType(){
      let data ={}
      let flag = 1
      data.staffId = this.$store.getters.id
      data.selectType = this.frequent.type
      if(data.selectType===7){
        data.selectType = 6
        flag = 0
      }
      selectByType(data).then(res=>{
        if(this.frequent.type===6){
          this.freqlist = res.data.drugList.filter(item=>{
            if(item.typeId===101||item.typeId===102){
              return true
            }
            return false
          })
        }
        else if(flag===0){
          this.freqlist = res.data.drugList.filter(item=>{
            if(item.typeId===103){
              return true
            }
            return false
          })
        }
        else if(this.frequent.type===1){
          this.freqlist = res.data.checkList
        }
        else if(this.frequent.type===2){
          this.freqlist = res.data.medicineDiseList
        }
        else if(this.frequent.type===3){
          this.freqlist = res.data.dispositionList
        }
        else if(this.frequent.type===4){
          this.freqlist = res.data.testList
        }
      })
    }
  },
}
</script>
<style>

</style>

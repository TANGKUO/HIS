<template>
  <!-- 诊断目录管理 -->
  <div>
  <el-container style="padding: 0px;margin:0 0 0 0">
    <!-- 列表 -->
    <el-aside width="20%" style="padding:0 5px 0 0;background:white;border-style: dotted;border-width: 0px 1px 0px 0px;border-color:#C0C0C0;" >
      <el-input v-model="search" size="small" placeholder="请输入类别名" style="width: 160px;margin-top:20px;margin-left:10px" class="filter-item" />
      <el-button type="primary" size="small"  style="width: 20px;"><svg-icon icon-class="search" style="margin-left:-6px"/></el-button>
      <el-button type="danger" size="small"  style="width: 20px;" @click="iseditCat=!iseditCat"><i class="el-icon-edit" style="margin-left:-6px" /></el-button>
      <el-table v-loading="catload" stripe max-height="660" ref="singleTable" style="margin-left:5px;margin-top:0px" highlight-current-row :data="menus.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" @current-change="handleCurrentChange">
        <el-table-column property="name" label="诊断分类目录">
        </el-table-column> 
        <el-table-column align="right">
          <template slot="header">
            <el-button size="mini" type="text" @click="dialogVisible=true;catchange.name='';dialogType='add'"><i class="el-icon-circle-plus" />新增</el-button>
          </template>
          <template slot>
          <el-button type="text" size="mini" v-show="iseditCat" @click="dialogVisible=true;catchange.name=currentRow.name;dialogType='edit';handleCurrentChange(row)"><i class="el-icon-edit" /></el-button>
          <el-button type="text" size="mini" v-show="iseditCat" @click="delDmsDiscat"><i class="el-icon-delete" /></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-aside>
    <!-- 每一列的表格详情 -->
    <el-main style="margin-left:10px">
      <el-button disabled style="color:black">当前类别：{{currentRow.name}}</el-button>
      <el-button type="text" v-if="currentRow.name!=='请点击左侧选择诊断类别'" @click="dialogVisibleDis=true;dialogType='add';onedis.catId=currentRow.id;onedis={}"><i class="el-icon-circle-plus" />新增诊断</el-button>
      <el-table :data="dis" v-loading="disload" style="margin-top:30px">
        <el-table-column label="疾病编码" property="code"></el-table-column>
        <el-table-column label="疾病名称" property="name"></el-table-column>
        <el-table-column label="ICD编码" property="icd"></el-table-column>
        <el-table-column label="操作"><template slot-scope="scope">
          <el-button type="primary" size="small" @click="dialogVisibleDis=true;dialogType='edit';onedis=scope.row;onedis.catId=currentRow.id;">修改</el-button>
          <el-button type="danger" size="small" @click="delDmsDis(scope.row)">删除</el-button>
        </template></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getDis" />
    </el-main>
  </el-container>
  <el-dialog :visible.sync="dialogVisible" width="500px" :title="dialogType==='edit'?'修改诊断分类目录':'新增诊断分类目录'" @close="getDeplist">
      <el-form>
        <el-form-item label="诊断分类目录名称:">
          <el-input style="width:300px" v-model.lazy="catchange.name"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;margin-top:20px">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="changeDmsDiscat">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleDis" width="500px" :title="dialogType==='edit'?'修改疾病信息':'新增疾病信息'" @close="getDeplist">
      <el-form :model="onedis">
        <el-form-item label="疾病编码:">
          <el-input style="width:300px" v-model="onedis.code"></el-input>
        </el-form-item>
        <el-form-item label="疾病名称:">
          <el-input style="width:300px" v-model="onedis.name"></el-input>
        </el-form-item>
        <el-form-item label="ICD编码:">
          <el-input style="width:300px" v-model="onedis.icd"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;margin-top:20px">
        <el-button type="danger" @click="dialogVisibleDis=false">取消</el-button>
        <el-button type="primary" @click="changeDmsDis">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getDmscatlist,getDmsDislist,createDmsDiscat,delDmsDiscat,editDmsDiscat,createDmsDis,editDmsDis,delDmsDis} from '@/api/diagnosis'
import Pagination from '@/components/Pagination'
export default {
  components: {Pagination},
  data(){
    return{
      onedis:{
        status:1,
        catId:'',
        code:'',
        name:'',
        icd:''
      },
      disload:false,
      dialogVisibleDis:false,
      catload:true,
      catchange:{
        name:'',
        status:1
      },
      dialogType:'',
      dialogVisible:false,
      search:'',
      catedit:false,
      total:0,
      iseditCat:false,
      listQuery: {
        catId: '',
        code: '',
        name: '',
        icd: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      },
      dis:[],
      menus:[],
      currentRow:{
        id:'',
        name:"请点击左侧选择诊断类别",
        status:1
      }
    };
  },
  created() {
    this.getMenu()
  },
  methods:{
    async getDis(){
      const res = await getDmsDislist(this.listQuery)
      this.dis = res.data.list
      this.total = res.data.total
    },
    async getMenu(){
      this.catload=true
      const res=await getDmscatlist()
      this.menus = res.data
      this.catload=false
    },
    async handleCurrentChange(val) {
        this.listQuery.catId = val.id
        const res = await getDmsDislist(this.listQuery)
        this.dis = res.data.list
        this.total = res.data.total
        this.currentRow=val
    },
    async getDisList(){
      this.disload=true
      const res = await getDmsDislist(this.listQuery)
      this.dis = res.data.list
      this.total = res.data.total
      this.disload=false
    },
    delDmsDis(row){
      this.$confirm('确认删除当前疾病?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        delDmsDis(row.id).then(res=>{
          this.$notify({
            title: '已删除',
            message: res.message,
            type: 'success',
            duration: 2000
          })
          this.getDisList()
        })
      })
    },
    changeDmsDis(){
      if(this.dialogType==='edit'){
        editDmsDis(this.onedis).then(res=>{
          this.$notify({
            title: '成功',
            message: res.message,
            type: 'success',
            duration: 2000
          })
          this.getDisList()
        this.dialogVisibleDis=false
        })
        
      }
      else{
        createDmsDis(this.onedis).then(res=>{
          this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.getDisList()
        this.dialogVisibleDis=false
        })
      }
    },
    changeDmsDiscat(){
      if(this.dialogType==='edit'){
        this.catchange.id = this.currentRow.id
        this.currentRow.name = this.catchange.name
        editDmsDiscat(this.catchange).then(res=>{
          this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        })
        this.dialogVisible=false
      }
      else{
      createDmsDiscat(this.catchange).then(res=>{
          this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.getMenu()
      this.dialogVisible=false
      })
      }
    },
    delDmsDiscat(){
      this.$confirm('确认删除当前目录?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
          delDmsDiscat(this.currentRow.id).then(res=>{
          this.$notify({
            title: '已删除',
            message: res.message,
            type: 'success',
            duration: 2000
          })
          this.currentRow.name=''
          this.dis=[]
          this.getMenu()
        })
      })
     
    }
  }
}
</script>
<style>
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

<template>
  <div>
    <!-- 病历模板管理 -->
    <el-container>
      <el-aside width="25%"  style="background:white;padding:0 0 0 0">
        <div class="block" style="margin:10px 10px 10px 10px">
          <aside style="width:100%">
            <span>病历模板</span>
            <el-button style="float:right" type="text" @click="edit">编辑目录</el-button>
          </aside>
          <el-tree
            style="width:300px"
            :data="data"
            node-key="id"
            default-expand-all
            @node-click="handleNodeClick"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span>
                <el-button
                v-show="showCheck&&data.type===1"
                  type="text"
                  size="mini"
                  @click="() => appendnode(data)">
                  增加
                </el-button>
                <el-button
                  v-show="showCheck"
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-aside>
      <el-main v-if="modeldetail">
        <el-button type="primary" @click="changeModel">保存修改</el-button>
        <el-form :model="editmodel" style="width:900px;margin-top:30px" inline label-width="100px">
          <el-form-item  label="模板名">
            <el-input placeholder="模板名" v-model="editmodel.name" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="主述">
            <el-input placeholder="主述" v-model="editmodel.chiefComplaint" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="现病史">
            <el-input placeholder="现病史" v-model="editmodel.historyOfPresentIllness"  style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="现病治疗情况">
            <el-input placeholder="现病治疗情况" v-model="editmodel.historyOfTreatment" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="既往史">
            <el-input placeholder="既往史" v-model="editmodel.pastHistory" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="过敏史">
            <el-input placeholder="过敏史" v-model="editmodel.allergies" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="体格检查">
            <el-input placeholder="体格检查" v-model="editmodel.healthCheckup" style="width:300px"></el-input>
          </el-form-item>
      </el-form>
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
      </el-main>
    </el-container>
    <el-dialog title="新增模板/目录" :visible.sync="addnodevisible" width="300px">
      <el-form>
        <el-form-item label="类型">
          <el-select v-model="newmodel.type" placeholder="请选择">
            <el-option
              v-for="item in [{label:'目录',value:1},{label:'模板',value:2}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="newmodel.name" style="width:205px" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="addnodevisible = false" style="float:right;margin-left:10px">取消</el-button>
          <el-button type="primary" @click="append" style="float:right">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="诊断目录" :visible.sync="dialogTableVisible" top="50px">
      <div style="height:520px">
      <span>搜索诊断</span>
      <el-input style="width:200px" placeholder="搜索诊断" v-model="disQuery.name" @change="getDis"></el-input>
      <el-table highlight-current-row @row-click="selectDis" :data="disList " style="margin-top:20px">
        <el-table-column property="icd" label="ICD编码" width="150"></el-table-column>
        <el-table-column property="name" label="名称" width="350"></el-table-column>
        <el-table-column property="code" label="编码" width="200"></el-table-column>
      </el-table>
      <pagination :auto-scroll="false" style="margin-top:0px" v-show="total>0" :total="total" page-sizes="[]" :page.sync="disQuery.pageNum" :limit.sync="disQuery.pageSize" @pagination="getDis" />
      </div>
  </el-dialog>
  </div>
</template>
<script>
  let id = 1000;
import {getDmsDislist,parseList} from '@/api/diagnosis'
import {listModelCatTree,createModel,deleteModel,updateModel,getModelDetail} from '@/api/outpatient/dmscasemodel'
import {selectByType,addfre,delfre} from '@/api/outpatient/frequentuse'
import {deepClone} from '@/utils'
import Pagination from '@/components/Pagination'
  export default {
    components: {Pagination},
    data() {
      return {
        selectfre:false,
        dialogTableVisible:false,
        record:[],
        modeldetail:false,
        editmodel:{},
        parentval:{},
        newmodel:{},
        addnodevisible:false,
        showCheck:false,
        data: [],
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
        total:0
      }
    },
    created(){
      this.listModelCatTree(this.editmodel)
    },
    methods: {
      changeModel(){
        this.editmodel.priliminaryDiseIdList = ''
        this.editmodel.priliminaryDiseStrList = ''
        this.record.forEach(item=>{
          this.editmodel.priliminaryDiseIdList += (item.id+',')
          this.editmodel.priliminaryDiseStrList += (item.name+',')
        })
        this.editmodel.priliminaryDiseIdList = this.editmodel.priliminaryDiseIdList.substr(0,this.editmodel.priliminaryDiseIdList.length-1)
        this.editmodel.priliminaryDiseStrList = this.editmodel.priliminaryDiseStrList.substr(0,this.editmodel.priliminaryDiseStrList.length-1)
        updateModel(this.editmodel).then(res=>{
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      async getDis(){
        const res = await getDmsDislist(this.disQuery)
        this.disList = res.data.list
        this.total = res.data.total
      },
      addDis(){
        this.dialogTableVisible=true
        this.getDis()
      },
      deleteDis(row){
        this.record=this.record.filter(item=>{
          if(item.id===row.id)
            return false
          return true
        })
      },
      selectDis(val){
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
      },
      handleNodeClick(val){
        if(val.type===2){
          getModelDetail(val.modelId).then(res=>{
            this.editmodel = res.data
            this.editmodel.modelId = val.modelId
            this.record = []
            parseList(res.data.priliminaryDiseIdList).then(res2=>{
              this.record = res2.data
            })
            this.modeldetail = true
          })
        }
      },
      listModelCatTree(){
        this.data = []
        listModelCatTree(this.$store.getters.id,0).then(res=>{
          this.data = JSON.parse(JSON.stringify(res.data))
        })
      },
      edit(){
        this.showCheck=!this.showCheck
      },
      appendnode(val){
        this.addnodevisible = true
        this.parentval = val
      },
      append() {
        let data = {}
        data.name = JSON.parse(JSON.stringify(this.newmodel.name))
        data.type = JSON.parse(JSON.stringify(this.newmodel.type))
        
        data.parentId = this.parentval.id
        data.ownId = this.$store.getters.id
        data.scope = 0
        this.addnodevisible = false
        createModel(data).then(res=>{
          this.$notify({
            title: '成功',
            message: res.data,
            type: 'success',
            duration: 2000
          })
          this.listModelCatTree()
        })
        
      },

      remove(node, data) {
        this.$confirm('确认删除 '+ data.name+ ' ?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteModel(data.id).then(res=>{
          this.$notify({
            title: '成功',
            message: res.data,
            type: 'success',
            duration: 2000
          })
          this.listModelCatTree()
        })
      })
        console.log(data)

      },

    }
  };
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>


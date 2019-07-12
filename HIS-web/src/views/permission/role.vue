<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增用户</el-button>
    <el-select placeholder="科室选择" v-model="listQuery.deptId" clearable style="width: 130px" class="filter-item" filterable @change="select">
      <el-option v-for="item in alldepart" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-select v-model="listQuery.roleId" placeholder="用户角色" clearable style="width: 130px" class="filter-item" @change="select">
      <el-option v-for="item in [{key:1,label:'管理员'},{key:2,label:'门诊医生'},{key:3,label:'医技医生'},{key:4,label:'药房医生'},{key:5,label:'收费员'},{key:6,label:'对账员'},{key:7,label:'超级管理员'}]" :key="item.key" :label="item.label" :value="item.key" />
    </el-select>  
    <el-table :data="userlist" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="用户编号" width="120">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="180">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="真实姓名" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="150">
        <template slot-scope="scope">
          {{ scope.row.role.name }}
        </template>
      </el-table-column>
       <el-table-column align="center" label="科室" width="150">
        <template slot-scope="scope">
          {{ scope.row.dept.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="select" />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改用户信息':'新建用户'" width="500px">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="user.username" style="200px"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" v-if="dialogType==='add'">
          <el-input v-model="user.password" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="角色">
        <el-select v-model="user.role" placeholder="请选择用户角色" filterable  clearable style="width: 130px" class="filter-item">
          <el-option v-for="item in [{key:1,label:'管理员'},{key:2,label:'门诊医生'},{key:3,label:'医技医生'},{key:4,label:'药房医生'},{key:5,label:'收费员'},{key:6,label:'对账员'},{key:7,label:'超级管理员'}]" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>  
        </el-form-item>
        <el-form-item label="科室">
          <el-select placeholder="科室选择" v-model="user.dept" clearable style="width: 130px" class="filter-item" filterable @change="getRuleList">
            <el-option v-for="item in alldepart" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="user.title"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {create,select,update} from '@/api/user'
import {parseTime,deepClone} from '@/utils'
import {getAllDep} from '@/api/department'
import Pagination from '@/components/Pagination'
export default {
  components: {Pagination},
  data(){
    return{
      alldepart:[],
      user:{
        id:'',
        username:'',
        name:'',
        role:'',
        dept:'',
        deptname:''
      },
      total:0,
      userlist:[],
      listQuery:{
        deptId:'',
        gender:'',
        username:'',
        roleId:'',
        pageSize:10,
        pageNum:1
      },
      dialogType:'',
      dialogVisible:false
    }
  },
  created(){
    this.select()
    this.getAlldep()
  },
  methods:{
    async getAlldep(){
      const res = await getAllDep()
      this.alldepart=res.data
    },
    confirmUser(){
      if(this.dialogType === 'add'){
        this.user.deptId = this.user.dept
        this.user.roleId = this.user.role
        this.user.registrationRankId = 1
        this.user.gender = 0
        create(this.user).then(res=>{
          this.$notify({
            title: '成功',
            message: '成功新增用户',
            type: 'success',
            duration: 2000
          })
          this.select()
        })
        this.dialogVisible = false
      }
      else{
        this.user.deptId = this.user.dept
        this.user.roleId = this.user.role
        update(this.user).then(res=>{
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.select()
        })
        this.dialogVisible = false
      }
    },
    select(){
      select(this.listQuery).then(res=>{
        this.userlist = res.data.list
        this.total = res.data.total
        console.log(this.userlist)
        this.userlist.forEach(item=>{
          item.createTime = parseTime(item.createTime)
        })
      })
    },
    handleAddRole(){
      this.user.id = ''
      this.user.name = ''
      this.user.role = ''
      this.user.username = ''
      this.user.dept = ''
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    handleEdit(row){
      this.dialogType = 'edit'
      this.user.id = row.id
      this.user.username = JSON.parse(JSON.stringify(row.username))
      this.user.name =JSON.parse(JSON.stringify(row.name))
      this.user.role = row.role.id
      this.user.dept = row.dept.id
      this.user.deptname = row.dept.name
      this.dialogVisible = true
      console.log(this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>

<template>
  <div class="upload-container">
    <el-form>
      <el-form-item label="检查结果">
        <el-input style="width:60%" type="textarea" :autosize="{ minRows: 2, maxRows: 3}" v-model="checkResult" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="" align="center">
        <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}"
                  @click=" dialogVisible=true" type="primary">上传图片
        </el-button>
        <el-button type="primary" size="mini" @click="uploadResult">确 定</el-button>
      </el-form-item>
    </el-form>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload class="editor-slide-upload"
                 :action="dataObj.host"
                 :data="dataObj"
                 :multiple="true"
                 :file-list="fileList"
                 :show-file-list="true"
                 list-type="picture-card"
                 :on-remove="handleRemove"
                 :on-success="handleSuccess"
                 :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import {policy,uploadResult} from '@/api/upload'

  export default {
    props:['uploadpatient'],
    name: 'Upload',
    data() {
      return {
        checkResult:'',
        color: '#1890ff',
        dialogVisible: false,
        listObj: {},
        arr:[],
        fileList: [],
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: ''
        }
      }
    },
    watch:{
    'uploadpatient' : function(newVal, oldVal){
        this.uploadpatient = newVal
      },
    },
    created(){
      policy().then(res=>{
        this.dataObj = res.data
      })
    },
    methods: {
      uploadResult(){
        let data = {}
        data.id = this.uploadpatient
        data.executeStaffId = this.$store.getters.id
        data.checkResult = this.checkResult
        data.resultImgUrlList = ''
        this.arr.forEach(item=>{
          data.resultImgUrlList += (item.url+',')
        })
        data.resultImgUrlList = data.resultImgUrlList.substr(0,data.resultImgUrlList.length-1)
        uploadResult(data).then(res=>{
          this.$notify({
            title: '成功',
            message: res.message,
            type: 'success',
            duration: 2000
          })
          console.log(8921)
          this.$emit('reflect')
          console.log(666312)
        })
      },
      checkAllSuccess() {
        return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
      },
      handleSubmit() {
        const arr = Object.keys(this.listObj).map(v => this.listObj[v])
        if (!this.checkAllSuccess()) {
          this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
          return
        }
        this.arr = arr
        this.dialogVisible = false;
        this.reflect()
      },
      handleSuccess(response, file) {
        const uid = file.uid;
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
            this.listObj[objKeyArr[i]].hasSuccess = true;
            return
          }
        }
        this.$notify({
            title: '成功',
            message: '上传成功222',
            type: 'success',
            duration: 2000
          })
      },
      handleRemove(file) {
        const uid = file.uid;
        const objKeyArr = Object.keys(this.listObj);
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            delete this.listObj[objKeyArr[i]];
            return
          }
        }
      },
      beforeUpload(file) {
        const _self = this
        const fileName = file.uid;
        this.listObj[fileName] = {};
        return new Promise((resolve, reject) => {
          policy().then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + '/${filename}';
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            _self.listObj[fileName] = {hasSuccess: false, uid: file.uid, width: this.width, height: this.height};
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .upload-container .editor-slide-upload{
    margin-bottom: 20px;
  }
</style>

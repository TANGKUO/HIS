<template>
	<view class="container">
		<view class="input-view">
			<uni-icon type="search" size="22" color="#666666" />
			<input confirm-type="search" v-model="searchinput" class="input"  type="text" placeholder="搜索科室" @confirm="searchdept()" />
		</view>
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
				<view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''"
				    v-for="(item,index) in categoryList">
					{{item.NAME}}
				</view>
			</scroll-view>
			<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
				<view :id="index===0?'first':''" class="nav-right-item" v-for="(item,index) in subCategoryList" :key="index">
					<navigator :url="'doctordetail?name='+item.NAME+'&id='+item.ID">
					<image :src="item.LOGO"/>
					<view>{{item.NAME}}</view>
					</navigator>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon/uni-icon.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {	
		components: {
			uniIcon
		},
		computed: {
			...mapState(['url','hasLogin', 'name', 'patientId', 'idCard', 'homeAddress', 'phoneNo', 'gender', 'medicalRecordNo'])
		},
		data() {
			return {
				searchinput:'',
				deptList:[],
				staffList:[],
				categoryList: [],
				subCategoryList: [],
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
			}
		},
		methods: {
			async searchdept(){
				var data  = {}
				data.name = this.searchinput
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/dept/select?pageSize=1000&pageNum=1',
					data:data,
					method:'post'
				});
				if(error != null && error.errMsg=="request:fail"){
					uni.showToast({
						icon: 'none',
						title: '网络错误'
					});
					return;
				}
				this.deptList = res.data.data.list
				console.log("搜索结果条数:" + this.deptList.length)
				if(this.deptList.length===0){
					uni.showToast({
						title:'检索不到相关信息',
						duration:2000,
						icon:'none'
					})
				}
				else{
					this.subCategoryList = []
					this.categoryList = []
					for (var i = 0; i < this.deptList.length; i++) {
						this.categoryList.push({
							"NAME": this.deptList[i].name,
							"ID": this.deptList[i].id
						})
					}
					this.categoryClickMain(this.categoryList[0], 0);	//搜索科室时同时加载第一个科室所有员工信息
				}
			},
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			async categoryClickMain(categroy, index) {
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/appRegistration/listDeptDoctor?deptId=' + categroy.ID,
					method: 'POST',
				});
				console.log(res.data)
				this.staffList = res.data.data;
				var subTempList = [];
				for (var i = 0; i < this.staffList.length; i++) {
					subTempList.push({
						"NAME": this.staffList[i].name,
						"LOGO": this.staffList[i].url,
						"ID": this.staffList[i].id
					})
				}
				this.subCategoryList =subTempList;
				this.categoryActive = index;
				this.scrollTop = -this.scrollHeight * index;
			},
			async getCategory() {
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/appRegistration/listAllDept',
					method: 'GET'
				});
				if(error != null && error.errMsg=="request:fail"){
					uni.showToast({
						icon: 'none',
						title: '网络错误'
					});
					return;
				}
				console.log(res.data)
				this.deptList = res.data.data
				for (var i = 0; i < this.deptList.length; i++) {
					this.categoryList.push({
						"NAME": this.deptList[i].name,
						"ID": this.deptList[i].id
					})
				}
				this.categoryClickMain(this.categoryList[0], 0);	//加载科室时同时加载第一个科室所有员工信息
			}
		},
		onLoad: function () {
			this.getCategory();
			this.height = uni.getSystemInfoSync().windowHeight + 100;
		}
	}
</script>

<style>
	.page-body {
		display: flex;
	}

	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 30%;
	}
	
	.nav-left-item {
		height: 100upx;
		border-right: solid 1px #E0E0E0;
		border-bottom: solid 1px #E0E0E0;
		font-size: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-right {
		width: 70%;
	}

	.nav-right-item {
		width: 28%;
		height: 220upx;
		float: left;
		text-align: center;
		padding: 11upx;
		font-size: 28upx;
	}

	.nav-right-item image {
		width: 100upx;
		height: 100upx;
	}

	.active {
		color: #007AFF;
	}
	.input-view {
		width: 92%;
		display: flex;
		background-color: #e7e7e7;
		height: 30px;
		border-radius: 15px;
		padding: 0 4%;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: 30px;
	}
	
	.input-view .uni-icon {
		line-height: 30px !important;
	}
	
	.input-view .input {
		height: 30px;
		line-height: 30px;
		width: 94%;
		padding: 0 3%;
	}
</style>

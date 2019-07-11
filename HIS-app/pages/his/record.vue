<template>
	<view class="page">
		<view class="uni-list">
			<view v-if="!hasReg">暂无挂号信息</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in list" :key="key">
				<navigator :url="'detail?registrationId='+value.registrationId">
					<view class="uni-list-cell-navigate uni-navigate-right uni-media-list " style="width: 100%;">
						<view class="uni-media-list-body" >
							<view class="uni-media-list-text-top">挂号日期:{{value.createTime}}  看诊日期:{{value.attendanceDate}}</view>
							<view class="uni-media-list-text-bottom uni-ellipsis">
								号别:{{value.registrationName}}    科室:{{value.deptName}}    状态:{{value.status}}
							</view>
						</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		computed: {
			...mapState(['url','hasLogin', 'name', 'patientId', 'idCard', 'homeAddress', 'phoneNo', 'gender', 'medicalRecordNo'])
		},
		data() {
			return {
				recordList:[],
				list: [],
				hasReg:true,
			}
		},
		onLoad() {
			this.getRecord();
		},
		methods: {
			async getRecord() {
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/appRegHistory/listAllRegistration?identificationNo=' + this.idCard,
					method: 'POST'
				});
				if(error != null && error.errMsg=="request:fail"){
					uni.showToast({
						icon: 'none',
						title: '网络错误'
					});
					return;
				}
				console.log(res.data)
				if(res.data.data == null){
					this.hasReg = false;
					return;
				}
				this.recordList = res.data.data
				for (var i = 0; i < this.recordList.length; i++) {
					var Createtime = this.recordList[i].createTime+'';
					var Attendancetime = this.recordList[i].attendanceDate+'';
					var stateName;
					if(this.recordList[i].status == 1){
						stateName = "待诊"
					}else if(this.recordList[i].status == 2){
						stateName = "诊中"
					}else if(this.recordList[i].status == 3){
						stateName = "诊毕"
					}else if(this.recordList[i].status == 4){
						stateName = "已退号"
					}else if(this.recordList[i].status == 5){
						stateName = "已过期"
					}else{
						stateName = "已删除"
					}
					this.list.push({
						"attendanceDate": Attendancetime.split('T')[0],
						"bindStatus": this.recordList[i].bindStatus,
						"createTime": Createtime.split('T')[0],
						"deptName": this.recordList[i].deptName,
						"doctorName": this.recordList[i].doctorName,
						"patientAgeStr": this.recordList[i].patientAgeStr,
						"registrationId": this.recordList[i].registrationId,
						"registrationName": this.recordList[i].registrationName,
						"statusId": this.recordList[i].status,
						"status": stateName,
					})
				}
			}
		}
	}
</script>

<style>
	image,
	swiper,
	.img-view {
		width: 750upx;
		height: 500upx;
	}
	.page-section-title{
		margin-top: 50upx;
	}
	.title {
		padding: 20upx;
	}
</style>

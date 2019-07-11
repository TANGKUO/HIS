<template>
	<view>
		<view class="example-title">{{deptName}}</view>
		<view class="uni-list-cell" hover-class="uni-list-cell-hover">
			<view class="uni-list-cell-navigate">
				<view class="uni-media-list-logo" style="height: 180upx;width: 180upx;">
					<image :src="photoUrl"></image>
				</view>
				<view class="uni-media-list-body" style="height: 215upx;">
					<view class="uni-media-list-text-top" style="font-size: 150%;">{{staffName}}
					<uni-tag style="margin-left: 30upx;" :mark="true" text="专家" type="primary" size="small" />
					<uni-rate :value="5" :size="18" :disabled="true" @change="change"/></view>
					<view style="font-size: 110%;display: inline">主治:{{description}}</view>
				</view>
			</view>
		</view>
		<view class="uni-list" style="width: 100%;margin-top: 20upx;">
			<radio-group @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.id">
					<view>
						<radio :value="item.id" :disabled="item.remain===0"  :checked="index === current" />
					</view>
					<view v-if="item.remain===0" style="text-decoration: line-through">{{item.date}}{{item.noon}}</view>
					<view v-if="item.remain!==0">{{item.date}}{{item.noon}}</view>
					<view style="color: grey;">限额:{{item.limit}}</view>
					<view style="color: grey;">剩余:{{item.remain}}</view>
				</label>
			</radio-group>
		</view>
		<view v-if="!hasSkd">暂无可挂号信息</view>
		<button type="primary" @click="registration" v-if="hasSkd">挂号</button>
		<button type="primary" @click="ack" v-else>返回</button>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		components: {
			uniList,
			uniListItem,
			uniRate,
			uniTag
		},
		computed: {
			...mapState(['url','hasLogin', 'name', 'patientId', 'idCard', 'homeAddress', 'phoneNo', 'gender', 'medicalRecordNo'])
		},
		data() {
			return {
				current:0,
				skdList:[],
				items:[],
				staffId:'',
				staffName:'',
				currentSkd:0,
				photoUrl:'',
				description:'',
				star:'',
				deptId:'',
				deptName:'',
				hasSkd:true,
			}
		},
		methods: {
			ack() {
				uni.navigateBack();
			},
			change() {
				this.star = this.star
			},
			async searchSkd() {
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/appRegistration/listDoctorSkd?staffId=' + this.staffId,
					method: 'POST'
				});
				if(error != null && error.errMsg=="request:fail"){
					uni.showToast({
						icon: 'none',
						title: '网络错误'
					});
					return;
				}
				console.log(res.data);
				this.skdList = res.data.data.skdResultList;
				if(this.skdList.length <= 0){
					this.hasSkd = false;
				}
				this.skdList.reverse();
				for (var i = 0; i < this.skdList.length; i++) {
					var time = this.skdList[i].date + '';
					var noonStatus;
					if(this.skdList[i].noon == 0){
						noonStatus = "上午"
					}else{
						noonStatus = "下午"
					}
					this.items.push({
						"limit": this.skdList[i].skLimit,
						"remain": this.skdList[i].remain,
						"date": time.split('T')[0],
						"id": this.skdList[i].id + '',
						"noon": noonStatus
					})
				}
				this.description = res.data.data.description;
				this.photoUrl = res.data.data.url;
				this.star = res.data.data.star;
				this.deptId = res.data.data.deptId;
				this.deptName = res.data.data.deptName;
				console.log(this.star)
			},
			radioChange: function(evt) {
				console.log(evt.target)
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].id === evt.target.value) {
						this.currentSkd = i;
						break;
					}
				}
			},
			async registration() {
				if(!this.hasLogin){
					uni.showToast({
						icon: 'none',
						title: '请先登录'
					});
					return;
				}
				console.log(this.items[this.currentSkd].id)
				console.log(this.deptId)
				console.log(this.items[this.currentSkd].date)
				console.log(this.patientId)
				if(this.items[this.currentSkd].remain == 0){
					uni.showToast({
						icon: 'none',
						title: '挂号失败：剩余号数为0'
					});
					return;
				}
				console.log(this.patientId)
				var res = await uni.request({
					url: 'http://' + this.url + '/appRegistration/appReg',
					data:{
						skdId:this.items[this.currentSkd].id,
						deptId:this.deptId,
						attendanceDate:this.items[this.currentSkd].date,
						patientId:this.patientId
					},
					method:'post',
					success: (res) => {
						console.log(res.data);
						if(res.data.code != 200){
							uni.showToast({
								icon: 'none',
								title: '挂号失败,请重试',
							});
							return;
						}else{
							uni.navigateTo({	//挂号成功后跳转成功页面
								url: 'regSuccess?name='+this.staffName+'&id='+this.staffId
							});
						}
					},
					fail: (res) => {
						uni.showToast({
							icon: 'none',
							title: '网络错误',
						});
						return;
					},
				});
			}
		},
		onLoad(options) {
			this.staffName = options.name
			this.staffId = options.id
			this.searchSkd()
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}

	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position: relative
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 0 40upx
	}
</style>
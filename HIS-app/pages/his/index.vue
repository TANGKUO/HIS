<template>
	<view class="page">
		<swiper indicator-dots="true">
			<swiper-item v-for="(img,key) in imgUrls" :key="key">
				<image :src="img" />
			</swiper-item>
		</swiper>
		<view class="title">科室介绍</view>
		<view class="uni-list" style="margin-bottom: 100px;">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in deptList" :key="key">
				<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
					<!-- <view class="uni-media-list-logo">
						<image v-if="false" :src="value.img"></image>
					</view> -->
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{value.deptName}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{value.description}}</view>
					</view>
				</view>
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
				imgUrls: [],
				deptList: [],
			}
		},
		onLoad() {
			this.getDept();
		},
		methods: {
			async getDept() {
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/appRegHistory/getDeptDescription',
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
				this.deptList = res.data.data
				for (var i = 0; i < this.deptList.length; i++) {
					if(this.deptList[i].url != null){
						this.imgUrls.push(this.deptList[i].url)
					}
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

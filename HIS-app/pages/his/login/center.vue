<template>
	<view style="margin-bottom: 100px;">
		<view class="header">
			<view class="bg">
				<view class="box">
					<view class="box-hd" @click="goLogin" :hover-class="!hasLogin ? 'logo-hover' : ''">
						<view class="avator">
							<img class="logo-img" :src="hasLogin ? logUrl : logoutUrl">
						</view>
						<view class="phone-number">
							<text class="uer-name">{{hasLogin ? "Hi，"+name : '您尚未登录'}}</text>
						</view>
					</view>
					<view class="box-bd" v-if="hasLogin">
						<view class="item">
							<!-- <view class="icon"><img src="../../../static/user/message.png"></view> -->
							<view class="text">病历号:{{this.medicalRecordNo}}</view>
						</view>
						<view class="item">
							<!-- <view class="icon"><img src="../../../static/user/service.png"></view> -->
							<view class="text">身份证号{{this.idCard}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-content">
			<view class="list">
				<view class="li noborder" @click="history">
					<view class="icon"><image src="../../../static/user/card.png"></image></view>
					<view class="text">历史病历</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view>
			</view>
			<view class="list">
				<!-- <view class="li " @click="changeSkin">
					<view class="icon"><image src="../../../static/user/skin.png"></image></view>
					<view class="text">主题切换</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view> -->
				<view class="li " >
					<view class="icon"><image src="../../../static/user/help.png"></image></view>
					<view class="text">帮助中心</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
				<view class="li " >
					<view class="icon"><image src="../../../static/user/about.png"></image></view>
					<view class="text">关于我们</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view>
				<view class="li " >
					<view class="icon"><image src="../../../static/user/opinion.png"></image></view>
					<view class="text">意见反馈</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
			</view>
			<view class="list">
				<view class="li noborder" >
					<view class="icon"><image src="../../../static/user/set.png"></image></view>
					<view class="text">系统设置</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view>
			</view>
		</view>
		<view class="footer" v-if="hasLogin" style="margin-bottom: 100px;">
			<button class="logout" type="primary" @click="logout" style="margin-left: 3%;margin-right: 3%;">
				退出登录</button>
		</view>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		data() {
			return {
				logUrl: '../../../static/user/face.jpg',
				logoutUrl: '../../../static/user/logo.png'
			};
		},
		computed: {
			...mapState(['url','hasLogin', 'name', 'patientId', 'idCard', 'homeAddress', 'phoneNo', 'gender', 'medicalRecordNo'])
		},
		onLoad() {
		},
		methods: {
			history() {
				if (!this.hasLogin) {
					uni.showToast({
						icon: 'none',
						title: '请先登录'
					});
					return;
				};
				uni.navigateTo({
					url: '../record'
				});
			},
			changeSkin() {
				uni.navigateTo({
					url: 'skin-change'
				});
			},
			goLogin() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: 'login'
					});
				}
			},
			...mapMutations(['logout']),
		}
	}
</script>

<style lang="scss">
page{
	background-color:#f1f1f1;
	font-size: 30upx;
}
.header{
	background: skyblue;
	height: 290upx;
	padding-bottom: 110upx;
	.bg{
		width: 100%;
		height:200upx;
		padding-top:100upx;
		background-color:skyblue;
	}
}
.box{
	width: 650upx;
	height: 280upx;
	border-radius: 20upx;
	margin: 0 auto;
	background: #fff;
	box-shadow: 0 5upx 20upx 0upx rgba(0, 0, 150, .2); 
	.box-hd{
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		.avator{
			width: 160upx;
			height: 160upx;
			background: #fff;
			border: 5upx solid #fff;
			border-radius: 50%;
			margin-top: -80upx;
			overflow: hidden;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.phone-number{
			width: 100%;
			text-align: center;
		}
	}
	.box-bd{
		// display: flex;
		// flex-wrap: nowrap;
		// flex-direction: row;
		// justify-content: center;
		.item{
			// flex: 1 1 auto;
			// display: flex;
			// flex-wrap: wrap;
			// flex-direction: row;
			// justify-content: center;
			// border-right: 1px solid #f1f1f1;
			// margin: 15upx 0;
			// &:last-child{
			// 	border: none;
			// }
			// .icon{
			// 	width: 60upx;
			// 	height: 60upx;
			// 	img{
			// 		width: 100%;
			// 		height: 100%;
			// 	}
			// }
			.text{
				width: 100%;
				text-align: left;
				margin-left: 10%;
			}
		}
	}
}
.list-content{
	background: #fff;
}
.list{
	width:100%;
	border-bottom:15upx solid  #f1f1f1;
	background: #fff;
	&:last-child{
		border: none;
	}
	.li{
		width:92%;
		height:100upx;
		padding:0 4%;
		border-bottom:1px solid rgb(243,243,243);
		display:flex;
		align-items:center;
	&.noborder{
		border-bottom:0
		}
		.icon{
			flex-shrink:0;
			width:50upx;
			height:50upx;
			image{
				width:50upx;
				height:50upx;
			}
		}
		.text{
			padding-left:20upx;
			width:100%;
			color:#666;
		}
		.to{
			flex-shrink:0;
			width:40upx;
			height:40upx;
		}
	}
}
	.footer {
		margin-top: 50upx;
	}
</style>
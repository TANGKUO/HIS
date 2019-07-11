<template>
	<view class="content">
		<view class="login-bg">
			<view class="login-card">
				<view class="login-head">请输入你的账户</view>
				<view class="login-input login-margin-b">
					<input name="idCard" type="text" placeholder="身份证号" @input="getId"/>
				</view>
				<view class="login-input">
					<input name="regId" type="number" placeholder="病历号" @input="getReg"/>
				</view>
<!-- 				<view class="login-function">
					<view class="login-forget" @click="go_forget">忘记密码</view>
					<view class="login-register" @click="go_register">快速注册></view>
				</view> -->
				<view class="login-btn">
					<button class="landing" @click="appLogin" type="primary">登陆</button>
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
		data() {
			return {
				id:'',
				reg:'',
				webUrl:'',
				code:'',
			}
		},
		computed: {
			...mapState(['url','hasLogin', 'name', 'patientId', 'idCard', 'homeAddress', 'phoneNo', 'gender', 'medicalRecordNo'])
		},
		onLoad() {
			this.webUrl = this.$store.state.url;
			console.log(this.webUrl)
		},
		methods: {
			...mapMutations(['login']),
			getId: function(event) {  
				this.id = event.target.value
				console.log(this.id)
			},
			getReg: function(event) {  
				this.reg = event.target.value
				console.log(this.reg)
			},
			async appLogin() {
				if(this.id.length <= 0){
					uni.showToast({
						icon: 'none',
						title: '请输入身份证号'
					});
					return;
				}else if(this.reg.length <= 0){
					uni.showToast({
						icon: 'none',
						title: '请输入病历号'
					});
					return;
				}
				var res = await uni.request({
					url: 'http://' + this.webUrl + '/appRegistration/login?identificationNo=' + this.id + '&medicalRecordNo=' + this.reg,
					method:'post',
					success: (res) => {
						console.log(res.data);
						this.code = res.data.code;
						uni.showToast({
							icon: 'none',
							title: res.data.message,
						});
						if(this.code != 200){
							return;
						}
						console.log(res.data.data);
						this.login(res.data.data);	//登录成功保存基本信息
						uni.navigateBack({			//登录后返回上一级页面
							delta: 1
						});
					},
					fail: (res) => {
						uni.showToast({
							icon: 'none',
							title: '网络错误',
						});
						return;
					},
				});
				// this.regDate = res.data;
				// console.log(res)
				// console.log(res)
			},
			// go_forget(){
			// 	uni.navigateTo({
			// 	    url: '../../pages/forget/forget'
			// 	})
			// },
			// go_register(){
			// 	uni.navigateTo({
			// 		url: '../../pages/register/register'
			// 	})
			// }
		}
	}
</script>

<style>
	.landing{
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		background: skyblue;
	}
	.login-btn{
		padding: 10upx 20upx;
		margin-top: 10px;
	}
	.login-function{
		overflow: auto;
		padding: 20upx 20upx 30upx 20upx;
	}
	.login-forget{
		float: left;
		font-size: 26upx;
		color: #999;
	}
	.login-register{
		color: #666;
		float: right;
		font-size: 26upx;

	}
	.login-input input{
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
	}
	.login-margin-b{
		margin-bottom: 25upx;
	}
	.login-input{
		padding: 10upx 20upx;
		margin-left: 5px;
		margin-right: 5px;
	}
	.login-head{
		font-size: 34upx;
		text-align: center;
		padding: 25upx 10upx 55upx 10upx;
	}
	.login-card{
		background: #fff;
		border-radius: 12upx;
		padding: 10upx 25upx;
		box-shadow: 0 6upx 18upx rgba(0,0,0,0.12);
		position: relative;
		margin-top: 120upx;
	}
	.login-bg {
		height: 260upx;
		padding: 25upx;
		background: skyblue;
	}
</style>


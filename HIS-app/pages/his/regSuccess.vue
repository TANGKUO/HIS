<template>
	<view>
		<view class="example-title">挂号成功</view>
		<view class="login-btn">
			<button class="landing" @click="ack" type="primary">确认</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				staffId:'',
				staffName:'',
			}
		},
		onLoad(options) {
			this.staffName = options.name
			this.staffId = options.id
		},
		methods: {
			ack() {
				uni.switchTab({
					url: 'reserve'
				});
			}
		}
	}
</script>

<style>
	.landing{
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		margin-top: 20px;
		margin-left: 30px;
		margin-right: 30px;
	}
	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position:relative;
	}
</style>

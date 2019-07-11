<template>
	<view>
		<view class="list-content">
			<radio-group @change="radioChange">
				<label class="list" v-for="(item, index) in items" :key="item.value">
					<view class="text">{{item.name}}</view>
					<view>
						<radio :value="item.value" :checked="index === current" />
					</view>
				</label>
			</radio-group>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'radio',
				items: [{
						value: 'USA',
						name: '经典蓝',
						checked: 'true'
					},
					{
						value: 'CHN',
						name: '魅力红'
					},
					{
						value: 'BRA',
						name: '活力蓝'
					},
					{
						value: 'JPN',
						name: '孔雀绿'
					}
				],
				current: 0
			}
		},
		methods: {
			radioChange(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			}
		}
	}
</script>

<style>
	.list-content{
		padding: 20upx;
		font-size: 30upx;
	}
	.list{
		display:flex;
		height: 100upx;
		line-height: 100upx;
		width: 100%;
		border-bottom:1px solid rgb(243,243,243);
	}
	.text{
		flex:1 1 auto;
	}
	
</style>
<template>
	<view>
		<view class="example-title">缴费记录
			<view style="float: right;font-size: 15px;margin-right: 20px;">
				共计: {{sumAmount}} 元
			</view>
		</view>
		<uni-list v-for="(value,key) in detailList" :key="key">
			<uni-list-item :show-arrow="value.hasArrow" :title="value.itemName" :type="value.type"
				:note="'数量:'+value.currentNum+'  单价:'+value.price+'  状态:'+value.status" @click="showActions(value)"/>
			</uni-list-item>
		</uni-list>
		<view v-if="hasFee" style="margin-left: 20px;">
			暂无
		</view>
		<view class="test">
			<popup-layer ref="popupRef" :direction="'top'">
				<view v-if="notCheckOrTest">
					<uni-list v-for="(value,key) in itemList" :key="key">
						<uni-list-item :show-arrow="false" :title="value.drugName" 
							:note="'当前数量:'+value.currentNum+'  规格:'+value.format+'  单价:'+value.price+'  状态:'+value.status" />
						</uni-list-item>
					</uni-list>
				</view>
				<view v-else>
					<view class="container">
						<view class="parts">
							{{currentText}}部位:{{result.checkParts}}
						</view>
					</view>
					<view class="container">
						<view class="result" v-if="hasResult">
							{{currentText}}结果:{{result.checkResult}}
						</view>
						<view class="result" v-else>
							还未{{currentText}}
						</view>
					</view>
					<view class="img-view">
						<swiper indicator-dots="true" style="height: 500upx;" v-if="hasPhoto">
							<swiper-item v-for="(img,key) in pictureUrlList" :key="key">
								<image :src="img" style="display: block;margin: auto;"/>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="bottom-btn" @click="close">确定</view>
			</popup-layer>
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import popupLayer from '../../components/popup-layer/popup-layer.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		computed: {
			...mapState(['url','hasLogin', 'name', 'patientId', 'idCard', 'homeAddress', 'phoneNo', 'gender', 'medicalRecordNo'])
		},
		components: {
			uniList,
			uniListItem,
			popupLayer,
		},
		data() {
			return {
				registrationId:'',
				detailArray: [],
				detailList: [],
				sumAmount:0,
				hasFee:true,
				boolShow:false,
				itemArray: [],
				itemList: [],
				notCheckOrTest:true,
				result:{},
				pictureUrlList: [],
				hasResult:true,
				currentText:'',
				hasPhoto: true,
			}
		},
		onLoad(options) {
			this.registrationId = options.registrationId;
			this.getDetail()
			this.sumAmount = Math.floor(this.sumAmount * 100) / 100
		},
		methods: {
			showActions: function(value) {
				if(value.typeNum == 0 || value.typeNum == 1){
					this.notCheckOrTest = false;
					this.currentText = value.type;
					this.getResult(value);
					if(value.statusNum == 4){		//4已执行
						this.hasResult = true;
					}else{
						this.hasResult = false;
					}
				}else if(value.typeNum == 2){		//2处置
					return;
				}else{
					this.notCheckOrTest = true;
					this.getItme(value);
				}
				this.show();
			},
			show(){
				this.$refs.popupRef.show(); // 或者 boolShow = rue
			},
			close(){
				this.$refs.popupRef.close();// 或者 boolShow = false
			},
			async getResult(value) {
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/appRegHistory/getResult?id=' + value.id,
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
				this.result = res.data.data
				this.pictureUrlList = []
				var urlTemp = this.result.resultImgUrlList + ''
				var urlList = urlTemp.split(",")
				for(let i = 0 ; i < urlList.length ; i++){
					this.pictureUrlList.push(urlList[i])
				}
				if(this.result.resultImgUrlList == null){
					this.hasPhoto = false
				}else{
					this.hasPhoto = true
				}
			},
			async getItme(value) {
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/appRegHistory/listDetail?prescriptionId=' + value.id + '&type=' + value.typeNum,
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
				this.itemList = []
				this.itemArray = res.data.data
				for (var i = 0; i < this.itemArray.length; i++){
					var statusName;
					if(this.itemArray[i].status == 0){
						statusName = '删除';
					}else if(this.itemArray[i].status == 1){
						statusName = '未发药';
					}else if(this.itemArray[i].status == 2){
						statusName = '已发药';
					}else{
						statusName = '退药';
					}
					this.itemList.push({
						"drugName":this.itemArray[i].drugName,
						"format":this.itemArray[i].format,
						"currentNum":this.itemArray[i].currentNum,
						"price":this.itemArray[i].price,
						"status":statusName,
					})
				}
			},
			async getDetail() {
				var [error, res] = await uni.request({
					url: 'http://' + this.url + '/appRegHistory/listFee?registrationId=' + this.registrationId,
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
				this.detailArray = res.data.data
				if(this.detailArray.length > 0){
					this.hasFee = false;
				}
				for (var i = 0; i < this.detailArray.length; i++){
					var statusName;
					var typeName;
					var hasArrow;
					if(this.detailArray[i].type == 0){
						typeName = '检查';
						hasArrow = false;
						if(this.detailArray[i].status == 0){
							statusName = '作废';
						}else if(this.detailArray[i].status == 1){
							statusName = '未缴费';
						}else if(this.detailArray[i].status == 2){
							statusName = '未登记';
						}else if(this.detailArray[i].status == 3){
							statusName = '已登记';
						}else if(this.detailArray[i].status == 4){
							statusName = '已执行';
						}else if(this.detailArray[i].status == 5){
							statusName = '已退费';
						}else{
							statusName = '已过期';
						}
					}else if(this.detailArray[i].type == 1){
						typeName = '检验';
						hasArrow = false;
						if(this.detailArray[i].status == 0){
							statusName = '作废';
						}else if(this.detailArray[i].status == 1){
							statusName = '未缴费';
						}else if(this.detailArray[i].status == 2){
							statusName = '未登记';
						}else if(this.detailArray[i].status == 3){
							statusName = '已登记';
						}else if(this.detailArray[i].status == 4){
							statusName = '已执行';
						}else if(this.detailArray[i].status == 5){
							statusName = '已退费';
						}else{
							statusName = '已过期';
						}
					}else if(this.detailArray[i].type == 2){
						typeName = '处置';
						hasArrow = false;
						if(this.detailArray[i].status == 0){
							statusName = '作废';
						}else if(this.detailArray[i].status == 1){
							statusName = '未缴费';
						}else if(this.detailArray[i].status == 2){
							statusName = '未登记';
						}else if(this.detailArray[i].status == 3){
							statusName = '已登记';
						}else if(this.detailArray[i].status == 4){
							statusName = '已执行';
						}else if(this.detailArray[i].status == 5){
							statusName = '已退费';
						}else{
							statusName = '已过期';
						}
					}else if(this.detailArray[i].type == 4){
						typeName = '草药';
						hasArrow = true;
						if(this.detailArray[i].status == 0){
							statusName = '作废';
						}else if(this.detailArray[i].status == 1){
							statusName = '未发药';
						}else if(this.detailArray[i].status == 2){
							statusName = '已发药';
						}else{
							statusName = '退药';
						}
					}else{
						typeName = '成药';
						hasArrow = true;
						if(this.detailArray[i].status == 0){
							statusName = '作废';
						}else if(this.detailArray[i].status == 1){
							statusName = '未发药';
						}else if(this.detailArray[i].status == 2){
							statusName = '已发药';
						}else{
							statusName = '退药';
						}
					}
					this.detailList.push({
						"itemName":this.detailArray[i].itemName,
						"currentNum":this.detailArray[i].currentNum,
						"price":this.detailArray[i].price,
						"status":statusName,
						"type":typeName,
						"id":this.detailArray[i].id,
						"hasArrow":hasArrow,
						"typeNum":this.detailArray[i].type,
						"statusNum":this.detailArray[i].status,
					})
					this.sumAmount = this.sumAmount + this.detailArray[i].price
				}
			}
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

	.bottom-btn{
		text-align: center;
		margin-top: 5px;
		margin-bottom: 5px;
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
	
	.container {
		padding: 24upx 30upx;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}
	
	.parts {
		font-size: 32upx;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: inherit;
		line-height: 1.5;
		overflow: hidden
	}
	
	.result {
		color: #999;
		font-size: 15px;
		white-space: normal;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.img-view {
		height: 400px;
	}
</style>
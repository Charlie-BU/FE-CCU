<template>
	<view class="cu-bar tabbar bg-white foot">
		<view class="action" :class="currentPage == 0 ? 'text-blue  ' : 'text-gray'" data-cur="home" @click="NavChange('/pages/index/index')">
			<div>
				<image class="tabbImg" v-show="currentPage == 0" src="@/static/images/atom-filled.png"></image>
				<image class="tabbImg" v-show="currentPage != 0" src="@/static/images/atom.png"></image>
			</div>
			<div class="text">首页</div>
		</view>
		<view class="action" :class="currentPage == 1 ? 'text-blue' : 'text-gray'" data-cur="cart" @click="NavChange('/pages/equipment/index')">
			<div>
				<image class="tabbImg" v-show="currentPage == 1" src="@/static/images/equipment-filled.png"></image>
				<image class="tabbImg" v-show="currentPage != 1" src="@/static/images/equipment.png"></image>
			</div>
			<div class="text">设备</div>
		</view>
		<view class="action add-action" :class="currentPage == 2 ? 'text-blue' : 'text-gray'" data-cur="sub" @click="NavChange('/pages/user-list/index')">
			<button class="cu-btn Zhong shadow tabbImgA" style="background-color: transparent">
				<image class="tabbImg tabbImgA" v-show="currentPage == 2" src="@/static/images/biochemist-filled.png"></image>
				<image class="tabbImg tabbImgA" v-show="currentPage != 2" src="@/static/images/biochemist.png"></image>
			</button>
		</view>
		<view class="action" :class="currentPage == 3 ? 'text-blue' : 'text-gray'" data-cur="similar" @click="NavChange('/pages/chemicals/index')">
			<div style="position: relative">
				<view v-if="flagShow" class="hbTag cu-tag badge">{{ shopNum }}</view>
				<image class="tabbImg" v-show="currentPage == 3" src="@/static/images/flask-filled.png"></image>
				<image class="tabbImg" v-show="currentPage != 3" src="@/static/images/flask.png"></image>
			</div>
			<div class="text">药品</div>
		</view>
		<view class="action" :class="currentPage == 4 ? 'text-blue' : 'text-gray'" data-cur="mine" @click="NavChange('/pages/my/index')">
			<div>
				<image class="tabbImg" v-show="currentPage == 4" src="@/static/images/user-filled.png"></image>
				<image class="tabbImg" v-show="currentPage != 4" src="@/static/images/user.png"></image>
			</div>
			<div class="text">我的</div>
		</view>
	</view>
</template>
<script>
export default {
	props: {
		currentPage: {
			type: Number,
			default: 0,
			show: false
		}
	},
	data() {
		return {
			currentItem: 0,
		};
	},
	mounted() {
		this.currentItem = this.currentPage;
		// uni.hideTabBar()
	},
	computed: {
		shopNum() {},
		flagShow() {
			return false;
		}
	},
	methods: {
		NavChange(e) {
			let _this = this;
			uni.switchTab({
				url: e
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.text-blue {
	color: #f25c07 !important;
}
.tabbImgA {
	width: 60rpx !important;
	height: 60rpx !important;
	position: relative;
	bottom: 5rpx;
}
.hbTag {
	position: absolute;
	width: 36rpx;
	top: 0rpx;
	right: 10rpx !important;
}
.Zhong {
	position: absolute;
	width: 70rpx;
	z-index: 2;
	height: 70rpx;
	border-radius: 50%;
	line-height: 70rpx;
	font-size: 50rpx;
	top: -35rpx;
	left: 0;
	right: 0;
	margin: auto;
	padding: 0;
}
.text {
	margin-top: 10rpx;
}
.tabbImg {
	width: 40rpx;
	height: 40rpx;
}
.TsImage {
	width: 50% !important;
	height: 50% !important;
	position: relative;
}

view {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

.tabbar-container {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 110rpx;
	box-shadow: 0 0 5px #999;
	display: flex;
	align-items: center;
	padding: 5rpx 0;
	color: #999999;
}

.tabbar-container .tabbar-item {
	width: 20%;
	height: 100rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
}

.tabbar-container .item-active {
	color: #f25c07;
}

.tabbar-container .center-item {
	display: block;
	position: relative;
}

.tabbar-container .tabbar-item .item-top {
	width: 70rpx;
	height: 70rpx;
	padding: 10rpx;
}

.tabbar-container .center-item .item-top {
	flex-shrink: 0;
	width: 100rpx;
	height: 100rpx;
	position: absolute;
	top: -50rpx;
	left: calc(50% - 50rpx);
	border-radius: 50%;
	box-shadow: 0 0 5px #999;
	background-color: #f25c07;
}

.tabbar-container .tabbar-item .item-top image {
	width: 80%;
	height: 80%;
}

.tabbar-container .tabbar-item .item-bottom {
	font-size: 28rpx;
	width: 100%;
}

.tabbar-container .center-item .item-bottom {
	position: absolute;
	bottom: 5rpx;
}

.item-bottom {
	font-size: 22rpx !important;
	position: relative;
	bottom: 8rpx;
}

.TsText {
	position: relative;
	bottom: 58rpx;
	color: white !important;
}
</style>

<template>
	<div class="app">
		<div class="bc flex">
			<div class="left">
				<img class="bcImg" src="https://tjtt-assets.oss-cn-shanghai.aliyuncs.com/pictures/decorations/secret.jpg" alt="" />
			</div>
			<div class="right">
				<div class="text1">注意：用户操作日志受严格隐私协议保护，任何人不得泄露；违者工作室将依法追究责任</div>
			</div>
		</div>
		<div v-if="user.id == 1" class="codeA code" style="margin-top: 20rpx">
			<div class="textDiv">
				<uni-table stripe emptyText="无数据">
					<uni-tr>
						<uni-th width="20rpx"><view class="table_content">日志</view></uni-th>
						<uni-th width="1000rpx"><view class="table_content">操作</view></uni-th>
						<uni-th width="20rpx"><view class="table_content">操作者</view></uni-th>
						<uni-th width="20rpx"><view class="table_content">操作时间</view></uni-th>
					</uni-tr>
					<uni-tr v-for="(action_log, index) in action_logs" :key="index">
						<uni-td><view class="table_content" style="font-weight: normal;">{{index+1}}</view></uni-td>
						<uni-td><view class="table_content" style="color: black; white-space: normal;">{{action_log.action}}</view></uni-td>
						<uni-td><view class="table_content" style="color: black;" @click="user_detail_page(action_log.operator_name)">{{action_log.operator_name}}</view></uni-td>
						<uni-td><view class="table_content" style="color: black;">{{utils.format_time(action_log.time)}}</view></uni-td>
					</uni-tr>
				</uni-table>
			</div>
		</div>
	</div>
</template>

<script>
	import { uniRequest } from '@/utils/js/api.js'
	import { loginCheck } from '@/utils/js/loginCheck.js'
	import { magic } from '@/utils/js/magic.js'
	export default {
		data() {
			return {
				message: "",
				user: "",
				action_logs: [],
				hide_this: magic(),
			}
		},
		onLoad() {
			loginCheck(user => {
				this.user = user;
			});
			if (!this.user || (this.user.usertype != "K9" && this.user.usertype != "K10" && this.user.usertype != "K11")) {
				wx.showToast({
					title: "权限不足",
					icon: "none",
					duration: 1500,
				});
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index/index',
					})
				}, 1000);
			};
			// 获取用户操作日志
			wx.showToast({
				title: '加载中',
				icon: 'loading',
				duration: 100000,
			});
			uniRequest("POST", "get_action_logs", null, "application", res => {
				this.action_logs = res.data.action_logs;
				wx.hideToast();
			});
		},
		methods: {
			user_detail_page(username) {
				if (!username) {
					return;
				};
				uniRequest("POST", "get_user_id_by_username", {"username": username}, "user", res => {
					let user_id = res.data.user_id;
					uni.setStorageSync("user_id", user_id);
					uni.navigateTo({
						url: '/page_subjec/user/user-detail',
					})
				});
			},
		}
	}
</script>

// 直接挂载到template中使用
<script setup>
	import * as utils from '@/utils/js/utils.js'
</script>

<style lang="scss" scoped>
	.foot {

		.left {
			text-align: center;
			background-color: #ffffff;
			box-sizing: box-sizing;
			padding: 20rpx;
			padding-top: 36rpx;
			width: 47%;
			height: 208rpx;

			border-radius: 20rpx 20rpx 20rpx 20rpx;
		}

		.lIcons {
			width: 104rpx;
			height: 104rpx;
			border-radius: 50%;
		}

		.pt {
			font-weight: 500;
			font-size: 28rpx;
			color: #212121;
			margin-top: 14rpx;
			line-height: 28rpx;
		}

		.r {
			background-color: #f9d67a !important;
		}
	}

	.app {
		min-height: 100vh;
		background: linear-gradient(135deg, #1ABFC0, #FFD5A4);
		box-sizing: border-box;
		padding: 20rpx;
	}

	.textT {
		font-weight: 600;
		font-size: 32rpx;
		box-sizing: border-box;
		padding-top: 22rpx;
	}

	.codeA {
		text-align: left !important;
		padding: 30rpx !important;

		.divider {
			background-color: #f2f2f2;
			margin: 28rpx 0rpx;
			height: 1rpx;
		}

		.tipTit {
			font-weight: 600;
			font-size: 32rpx;
			color: #333333;
			line-height: 32rpx;
		}

		.textDiv {
			margin-top: 20rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #333333;
			line-height: 44rpx;
		}
	}

	.code {
		box-sizing: border-box;
		padding: 50rpx;
		background-color: white;
		position: relative;
		top: -70rpx;
		border-radius: 28rpx;
		text-align: center;

		.codeImg {
			width: 320rpx;
			height: 320rpx;
		}

		.tis {
			margin: 36rpx 0rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
			line-height: 24rpx;
		}

		.title {
			margin-top: 22rpx;
			font-weight: 600;
			font-size: 40rpx;
			color: #000000;
			line-height: 40rpx;
		}
	}

	.bc {
		margin-top: 30rpx;
		background-color: #eed4bd;
		box-sizing: box-sizing;
		padding: 18rpx 20rpx;
		border-radius: 20rpx;
		padding-bottom: 90rpx;

		.text1 {
			margin-top: 14rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: bold;
			font-size: 28rpx;
			color: red;
			line-height: 40rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}

		.text2 {
			// margin-top: 70rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			font-size: 26rpx;
			color: #f25c07;
			line-height: 60rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}

		.right {
			width: 62%;
		}

		.left {
			width: 34%;

			.bcImg {
				border-radius: 12rpx;
				width: 100%;
				height: 144rpx;
			}
		}
	}

	.userList {
		position: relative;
		box-sizing: box-sizing;
		margin-top: 40rpx;
		background: #ffffff;
		border-radius: 20rpx 20rpx 20rpx 20rpx;

		.p {
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			font-size: 36rpx;
			color: #282456;
			line-height: 40rpx;
			text-align: center;
			font-style: normal;
			text-transform: none;
		}

		.span {
			margin-top: 24rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
			line-height: 24rpx;
			text-align: center;
			font-style: normal;
			text-transform: none;
		}
	}

	.itemList {
		text-align: center;
		width: 24%;
	}
	
	.table_head {
		text-align: center;
		font-weight: normal;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.table_content {
		text-align: center;
		font-weight: bold;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
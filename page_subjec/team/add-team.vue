<template>
	<view class="main">
		<view class="main">
			<view class="pagenation">
				<view class="pagenation_back" @tap="backref()">
					<image class="back_arrow" src="..\..\static\tabbar\back.png" mode="aspectFill" />
				</view>
			</view>
			<view class="login">
				<view class="kuang shadow">
					<view class="hint">添加代表队</view>
					<view class="form-group">
						<image class="images"
							src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg"
							mode="aspectFill" />
						<view class="input_section">
							<view class="title ipt">* 代表队名：</view>
							<input placeholder="请输入代表队名" maxlength="100" class="ipt tpyA"
								v-model="teamname" placeholder-class="phc ipt" />
						</view>
						<view class="input_section">
							<view class="title ipt">简介：</view>
							<input placeholder="请输入代表队简介" maxlength="100" class="ipt tpyA" v-model="description"
								placeholder-class="phc ipt" />
						</view>
						<view class="input_section">
							<view class="title ipt">* 队员人数上限：</view>
							<input placeholder="请输入代表队队员人数上限" maxlength="100" class="ipt tpyA" v-model="member_max"
								placeholder-class="phc ipt" />
						</view>
						<view class="input_section">
							<view class="title ipt">绑定（团体）赛事：</view>
							<input placeholder="请输入准确团体赛事名称" maxlength="100" class="ipt tpyA" v-model="match_title"
								placeholder-class="phc ipt" />
						</view>
					</view>
					<button class="btn round" style="background-color: #f05b05;" @click="add_team">确认添加</button>
				</view>
			</view>
			<view class="bottom">
			</view>
		</view>
	</view>
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
				teamname: "",
				description: "",
				member_max: "",
				match_title: "",
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
		},
		methods: {
			onInput(e) {
				this.teamname = e.target.value
				this.description = e.target.value
				this.member_max = e.target.value
				this.match_title = e.target.value
			},
			
			backref() {
				uni.navigateBack({
					delta: 1
				});
			},

			add_team() {
				let data = {
					"my_id": this.user.id,
					"teamname": this.teamname,
					"description": this.description,
					"member_max": this.member_max,
					"match_title": this.match_title,
				}
				uniRequest("POST", "add_team", data, "competition", res => {
					wx.showToast({
						title: res.data.message,
						icon: "none",
						duration: 700,
					});
					if (res.data.status == 200) {
						setTimeout(() => {
							uni.reLaunch({
								url: '/page_subjec/team/team-list',
							})
						}, 700);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.pagenation {
		.pagenation_back {
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 76rpx;
			height: 76rpx;
			border-radius: 50%;
			border: 1rpx solid #bcbcbc;
			margin: 75rpx 40rpx;

			.back_arrow {
				width: 50rpx;
				height: 50rpx;
			}
		}
	}
</style>

<style>
	/* packageA/supplierLogin/index.wxss */

	.main {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #1ABFC0, #FFD5A4);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.main .login {
		margin-top: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		flex: 1;
	}

	.main .login .kuang {
		width: 650rpx;
		background-color: #fff;
		height: 100%;
		margin-top: 85rpx;
		border-radius: 20rpx;
		/* display: flex; */
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 50rpx 20rpx;
	}

	.main .login .kuang .btn {
		width: 85%;
		color: #fff;
		font-size: 32rpx;
		margin: 40rpx;
	}

	.main .login .kuang .hint {
		width: 100%;
		color: black;
		font-size: 50rpx;
		font-weight: bold;
		text-align: center;
	}

	.main .login .kuang .return {
		width: 100%;
		color: #1ABFC0;
		font-size: 30rpx;
		text-align: center;
		font-size: 26rpx;
	}

	.main .avatar-open {
		width: 180rpx;
		height: 180rpx;
		clip-path: circle(90rpx at center);
	}

	.main .bottom {
		width: 100%;
		align-self: flex-end;
		font-size: 26rpx;
		height: 120rpx;
		text-align: center;
		color: #fff;
		display: flex;
		flex-direction: column;
	}

	.form-group {
		margin: 40rpx;
		text-align: center;
	}

	.form-group .title {
		white-space: nowrap;
		font-weight: normal;
	}

	.form-group .input_section {
		margin: 40rpx;
		display: flex;
		flex-direction: row;
		text-align: justify;
	}

	.title {
		line-height: 42rpx !important;
	}

	.images {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
	}

	.tpyA {
		padding: 0px 20rpx;
	}

	.ipt {
		font-size: 26rpx;
	}
</style>
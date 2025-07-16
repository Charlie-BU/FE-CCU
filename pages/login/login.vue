<template>
	<view class="app">
		<view class="pagenation">
			<view class="pagenation_back" @click="gotoHomepage">
				<image class="back_arrow" src="..\..\static\tabbar\back.png" mode="aspectFill" />
			</view>
		</view>
		<view class="login">
			<view class="kuang shadow">
				<view class="hint">用户登录</view>
				<image class="images" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg" mode="aspectFill" />
				<view class="form-group flex">
					<view class="title ipt" style="margin-left: 50rpx">姓名 / 手机号：</view>
					<input placeholder="请输入姓名或手机号" maxlength="100" class="ipt tpyA" v-model="nameOrPhone" placeholder-class="phc ipt" />
				</view>
				<view class="form-group flex">
					<view class="title ipt" style="margin-left: -55rpx">密码：</view>
					<input placeholder="请输入密码" maxlength="100" v-model="password" class="ipt tpyA" type="password" placeholder-class="phc ipt" />
				</view>
				<checkbox-group @change="whetherBindWxLogin">
					<label class="radio" style="white-space: nowrap; display: flex">
						<checkbox checked="true" value="agreed" color="#FFCC33" style="transform: scale(0.7)" />
						绑定微信一键登录
					</label>
				</checkbox-group>
				<radio-group @change="whetherAgree">
					<label class="radio" style="white-space: nowrap; display: flex">
						<radio value="agreed" color="#FFCC33" style="transform: scale(0.7)" />
						同意小程序的
						<view @click="policy" style="color: blue">协议与隐私政策</view>
					</label>
				</radio-group>
				<button class="btn btn1 round" @click="login">登录</button>
				<button class="btn btn2 round" style="background-color: #0bd618" @click="wxLogin">微信一键登录</button>
				<button v-if="show" class="btn btn2 round" @click="gotoRegister">注册</button>
				<button v-if="show" class="btn btn2 round" @click="gotoForgetPwd">忘记密码</button>
			</view>
		</view>
		<view class="bottom"></view>
	</view>
</template>

<script setup>
import { ref } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { getOpenidAndSessionKey } from "@/utils/js/wxLogin.js";
import { loginCheck } from "@/utils/js/loginCheck.js";
import * as utils from "@/utils/js/utils.js";
import { magic } from "@/utils/js/magic";
const show = magic();

const gotoHomepage = () => {
	uni.reLaunch({
		url: "/pages/index/index"
	});
};

const gotoRegister = () => {
	uni.navigateTo({
		url: "/pages/login/register"
	});
};

const gotoForgetPwd = () => {
	uni.navigateTo({
		url: "/pages/login/forgetPwd"
	});
};

const policy = () => {
	wx.showModal({
		title: "用户服务协议与隐私政策",
		content:
			"1.在您注册、登录本平台之前，请仔细阅读以下用户服务协议。注册/登录本平台，即表示您同意遵守以下协议;2.我们将严格保护用户的个人隐私信息，不会将用户的个人信息透露给任何第三方。但在法律规定的情况下，我们可能会根据相关法律法规要求向有关部门提供用户的个人信息;3. 本平台不对用户因使用本平台服务而产生的任何直接或间接损失承担责任。用户在使用本平台服务时，需自行承担风险，并且同意在任何情况下不追究本平台的责任;4.本平台有权根据需要对用户服务协议进行修改，修改后的协议将在平台上公布。用户继续使用本平台服务即视为同意修改后的协议。",
		showCancel: false,
		confirmText: "同意"
	});
};

// 表单数据绑定
const nameOrPhone = ref("");
const password = ref("");

const bindWxLogin = ref(true);
const whetherBindWxLogin = (e) => {
	bindWxLogin.value = e.detail.value.includes("agreed");
	console.log(bindWxLogin.value);
};

const agree = ref(false);
const whetherAgree = (e) => {
	agree.value = e.detail.value === "agreed" ? true : false;
};

// TODO：防抖
const login = async () => {
	uni.showToast({
		title: "登录中",
		icon: "loading",
		duration: 100000
	});
	const loginData = {
		nameOrPhone: nameOrPhone.value,
		password: password.value,
		agree: agree.value
	};
	if (!loginData.nameOrPhone || !loginData.password) {
		uni.showToast({
			title: "请填写完整",
			icon: "none",
			duration: 700
		});
		return;
	}
	if (!loginData.agree) {
		uni.showToast({
			title: "请同意小程序的协议与隐私政策",
			icon: "none",
			duration: 700
		});
		return;
	}
	try {
		// 标准写法，之后将不再使用try-catch风格
		const res = await uniRequest("POST", "user", "/login", loginData);
		if (res.status !== 200) {
			uni.showToast({
				title: res.message,
				icon: "none",
				duration: 700
			});
			return;
		}
		uni.setStorageSync("sessionid", res.sessionid);
		if (bindWxLogin.value) {
			// 登录时在服务器储存openid
			const openidAndSessionKey = await getOpenidAndSessionKey();
			if (openidAndSessionKey) {
				const res2 = await uniRequest("POST", "user", "/storeOpenid", { sessionid: res.sessionid, openid: openidAndSessionKey[0] });
				if (res2.status === 200) {
					uni.showToast({
						title: res.message + "，之后可进行微信一键登录",
						icon: "none",
						duration: 800
					});
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/index/index"
						});
					}, 800);
					return;
				}
			}
		}
		uni.showToast({
			title: res.message,
			icon: "none",
			duration: 800
		});
		setTimeout(() => {
			uni.reLaunch({
				url: "/pages/index/index"
			});
		}, 800);
	} catch (e) {
		console.log("Login fail: ", e);
	}
};

// TODO：防抖
const wxLogin = async () => {
	if (!agree.value) {
		uni.showToast({
			title: "请同意小程序的协议与隐私政策",
			icon: "none",
			duration: 700
		});
		return;
	}
	uni.showToast({
		title: "登录中",
		icon: "loading",
		duration: 100000
	});
	const openidAndSessionKey = await getOpenidAndSessionKey();
	if (!openidAndSessionKey) {
		uni.showToast({
			title: "登录失败，请换其他方式登录",
			icon: "none",
			duration: 700
		});
		return;
	}
	const res = await uniRequest("POST", "user", "/wxLogin", { openid: openidAndSessionKey[0], session_key: openidAndSessionKey[1] });
	if (res.status < -3) {
		uni.showToast({
			title: res.message,
			icon: "none",
			duration: 1000
		});
		return;
	}
	if (res.status !== 200) {
		console.log(res.message);
		uni.showToast({
			title: "登录失败，请换其他方式登录",
			icon: "none",
			duration: 700
		});
		return;
	}
	uni.setStorageSync("sessionid", res.sessionid);
	uni.showToast({
		title: res.message,
		icon: "none",
		duration: 700
	});
	setTimeout(() => {
		uni.reLaunch({
			url: "/pages/index/index"
		});
	}, 700);
};
</script>

<style lang="scss">
@import "@/utils/scss/common-styles.scss";

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

.login {
	margin-top: 150rpx;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	flex: 1;
}

.login .kuang {
	width: 650rpx;
	background-color: #fff;
	height: 1100rpx;
	margin-top: 100rpx;
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 50rpx 20rpx;
}

.login .kuang button {
	width: 85%;
	color: #fff;
	font-size: 32rpx;
}

.btn1 {
	background-color: #f05b05;
}

.btn2 {
	background-color: #5853bf;
}

.login .kuang .hint {
	width: 100%;
	color: black;
	font-size: 50rpx;
	font-weight: bold;
	text-align: center;
}

.login .kuang .return {
	width: 100%;
	color: #1abfc0;
	font-size: 30rpx;
	text-align: center;
	font-size: 26rpx;
}

.avatar-open {
	width: 180rpx;
	height: 180rpx;
	clip-path: circle(90rpx at center);
}

.bottom {
	width: 100%;
	align-self: flex-end;
	font-size: 26rpx;
	height: 70rpx;
	text-align: center;
	color: #fff;
	display: flex;
	flex-direction: column;
}

.form-group .title {
	font-weight: normal;
}

.flex {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}

.title {
	line-height: 42rpx !important;
}

.images {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
}

.tpyA {
	padding: 0px 20rpx;
}

.ipt {
	font-size: 26rpx;
}
</style>

<template>
	<view class="main">
		<view class="pagenation">
			<view class="pagenation_back" @click="goBack">
				<image class="back_arrow" src="..\..\static\tabbar\back.png" mode="aspectFill" />
			</view>
		</view>
		<view class="login">
			<view class="kuang shadow">
				<view class="hint">修改密码</view>
				<image class="images" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg" mode="aspectFill" />
				<view class="form-group">
					<view class="input_section">
						<view class="title ipt">姓名：</view>
						<input maxlength="100" class="ipt tpyA" :value="briefUserInfo?.username" disabled />
					</view>
					<view class="input_section">
						<view class="title ipt">原密码：</view>
						<input placeholder="请输入原密码" maxlength="100" v-model="form.oldPassword" class="ipt tpyA" type="password" />
					</view>
					<view class="input_section">
						<view class="title ipt">新密码：</view>
						<input placeholder="请输入新密码" maxlength="100" v-model="form.newPassword" class="ipt tpyA" type="password" />
					</view>
					<view class="input_section">
						<view class="title ipt">确认新密码：</view>
						<input placeholder="请再次输入新密码" maxlength="100" v-model="form.confirmNewPassword" class="ipt tpyA" type="password" />
					</view>
				</view>
				<button class="btn round" style="background-color: #f05b05" @click="modifySubmit">确认</button>
			</view>
		</view>
		<view class="bottom"></view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uniRequest } from "@/utils/js/api";
import { onlyLoginedAccess, loginCheck } from "@/utils/js/loginCheck";

const briefUserInfo = ref(null);
onMounted(async () => {
	await onlyLoginedAccess();
	briefUserInfo.value = await loginCheck();
});

const goBack = () => {
	uni.navigateBack();
};

const form = ref({
	oldPassword: null,
	newPassword: null,
	confirmNewPassword: null
});

const modifySubmit = async () => {
	if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmNewPassword) {
		uni.showToast({
			title: "请输入完整",
			icon: "none",
			duration: 1000
		});
		return;
	}
	if (form.value.newPassword !== form.value.confirmNewPassword) {
		uni.showToast({
			title: "两次密码输入不一致",
			icon: "none",
			duration: 1000
		});
		return;
	}
	if (form.value.oldPassword === form.value.newPassword) {
		uni.showToast({
			title: "原密码与新密码相同",
			icon: "none",
			duration: 1000
		});
		return;
	}
	uni.showToast({
		title: "修改中",
		icon: "loading",
		duration: 100000
	});
	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		oldPassword: form.value.oldPassword,
		newPassword: form.value.newPassword
	};
	const res = await uniRequest("POST", "user", "/modifyPassword", data);
	uni.showToast({
		title: res.message,
		icon: "none",
		duration: 1000
	});
	if (res.status === 200) {
		setTimeout(() => {
			uni.reLaunch({
				url: `/pages/my/index`
			});
		}, 1000);
	}
};
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
.main {
	height: auto;
	min-height: 100vh;
	background: linear-gradient(0deg, #efefef 0%, #f6f6f6 25%, #1abfc0 100%);
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
	width: 620rpx;
	background-color: #fff;
	height: 65%;
	margin-top: 100rpx;
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 50rpx 20rpx;
}

.main .login .kuang button {
	width: 85%;
	color: #fff;
	font-size: 32rpx;
}

.btn1 {
	background-color: #f05b05;
}

.btn2 {
	background-color: #272555;
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
	color: #1abfc0;
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
	height: 70rpx;
	text-align: center;
	color: #fff;
	display: flex;
	flex-direction: column;
}

.form-group {
	margin: 20rpx;
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
    margin-top: 20rpx;
}

.tpyA {
	padding: 0px 20rpx;
}

.ipt {
	font-size: 26rpx;
}
</style>

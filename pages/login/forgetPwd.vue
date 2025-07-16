<template>
    <view class="main">
        <view class="pagenation">
            <view class="pagenation_back" @click="goBack">
                <image class="back_arrow" src="..\..\static\tabbar\back.png" mode="aspectFill" />
            </view>
        </view>
        <view v-if="show" class="login">
            <view class="kuang shadow">
                <view class="hint">忘记密码</view>
                <image class="images" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg" mode="aspectFill" />
                <view class="form-group">
                    <view class="input_section">
                        <view class="title ipt">姓名：</view>
                        <input placeholder="请输入真实姓名" maxlength="100" class="ipt tpyA" v-model="username" placeholder-class="phc ipt" />
                    </view>
                    <view class="input_section">
                        <view class="title ipt">学号 / 工号：</view>
                        <input placeholder="请输入学号 / 工号" maxlength="100" v-model="workNum" class="ipt tpyA" type="text" placeholder-class="phc ipt" />
                    </view>
                    <view class="input_section">
                        <view class="title ipt">邮箱验证码：</view>
                        <input maxlength="100" v-model="captcha" class="ipt tpyA" type="password" placeholder-class="phc ipt" />
                        <view style="white-space: nowrap" @click="sendEmailCaptcha">{{ captchaText }}</view>
                    </view>
                </view>
                <button class="btn btn1 round" @click="confirm">确定</button>
            </view>
        </view>
        <view class="bottom"></view>
    </view>
</template>

<script setup>
import { ref } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { magic } from "@/utils/js/magic";
const show = magic();

const goBack = () => {
    uni.navigateBack();
};

const username = ref("");
const workNum = ref("");
const captcha = ref("");

let captchaText = ref("获取验证码");
let isWaiting = false;

const sendEmailCaptcha = async () => {
    if (isWaiting) return;
    uni.showToast({
        title: "发送中",
        icon: "loading",
        duration: 10000
    });
    const data = {
        username: username.value,
        workNum: workNum.value
    };
    const res = await uniRequest("POST", "user", "/sendEmailCaptcha", data);
    if (res.status !== 200) {
        uni.showToast({
            title: res.message,
            icon: "none",
            duration: 700
        });
        return;
    }
    captchaText.value = "发送中";
    isWaiting = true;
    uni.hideToast();
    setTimer();
};

let timer = null;

const setTimer = () => {
    let holdTime = 60;
    captchaText.value = "60秒";
    timer = setInterval(() => {
        if (holdTime <= 0) {
            isWaiting = false;
            captchaText.value = "获取验证码";
            clearInterval(timer);
            return;
        }
        captchaText.value = holdTime + "秒";
        holdTime--;
    }, 1000);
};

const confirm = async () => {
    if (!username.value || !workNum.value || !captcha.value) {
        uni.showToast({
            title: "请输入完整",
            icon: "none",
            duration: 800
        });
        return;
    }
    uni.showToast({
        title: "请稍后",
        icon: "loading",
        duration: 10000
    });
    const data = {
        username: username.value,
        workNum: workNum.value,
        captcha: captcha.value
    };
    const res = await uniRequest("POST", "user", "/resetPassword", data);
    if (res.status !== 200) {
        uni.showToast({
            title: res.message,
            icon: "none",
            duration: 700
        });
        return;
    }
    uni.showToast({
        title: res.message,
        icon: "none",
        duration: 2000
    });
    setTimeout(() => {
        uni.navigateTo({
            url: "/pages/login/login"
        });
    }, 2000);
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

.main {
    width: 100%;
    height: 100vh;
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
    width: 600rpx;
    background-color: #fff;
    height: 65%;
    margin-top: 200rpx;
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
    margin-bottom: 20rpx;
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
    text-align: left;
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

<template>
    <view class="main">
        <view class="pagenation">
            <view class="pagenation_back" @click="goBack">
                <image class="back_arrow" src="..\..\static\tabbar\back.png" mode="aspectFill" />
            </view>
        </view>
        <view v-if="show" class="login">
            <view class="kuang shadow">
                <view class="hint">发布通知公告</view>
                <view class="form-group">
                    <image class="images" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg" mode="aspectFill" />
                    <view class="input_section">
                        <view class="title ipt">发布者：</view>
                        <input maxlength="100" class="ipt tpyA" :value="briefUserInfo?.username" disabled="true" />
                    </view>
                    <view class="input_section">
                        <view class="title ipt">标题：</view>
                        <input maxlength="100" class="ipt tpyA" v-model="title" placeholder="请输入通知/公告标题" />
                    </view>
                    <view class="input_section">
                        <view class="title ipt">内容：</view>
                        <textarea maxlength="-1" class="ipt tpyA" auto-height="true" v-model="content" placeholder="请输入通知/公告内容" />
                    </view>
                </view>
                <button class="btn round" style="background-color: #f05b05" @click="releaseNotice">确认发布</button>
            </view>
        </view>
        <view class="bottom"></view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { onlyLoginedAccess, loginCheck } from "@/utils/js/loginCheck.js";
import { magic } from "@/utils/js/magic";
const show = magic();

const briefUserInfo = ref(null);
onMounted(async () => {
    briefUserInfo.value = await loginCheck();
    await onlyLoginedAccess();
});

const title = ref("");
const content = ref("");

const releaseNotice = async () => {
    uni.showToast({
        title: "发布中",
        icon: "loading",
        duration: 100000
    });
    const data = {
        sessionid: uni.getStorageSync("sessionid"),
        title: title.value,
        content: content.value
    };
    const res = await uniRequest("POST", "extras", "/releaseNotice", data);
    uni.showToast({
        title: res.message,
        icon: "none",
        duration: 800
    });
    if (res.status < 0) return;
    setTimeout(() => {
        uni.reLaunch({
            url: "/pages/index/index"
        });
    }, 800);
};

const goBack = () => {
    uni.navigateBack();
};
</script>

<style lang="scss" scoped>
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
    height: 100%;
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
    width: 660rpx;
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
    height: 600rpx;
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

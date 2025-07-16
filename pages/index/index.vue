<template>
    <div class="app">
        <div class="head">
            <div class="headTitle">功能分子材料研究组管理平台</div>
            <span v-if="briefUserInfo" class="welcome">你好，{{ briefUserInfo.username }}</span>
            <span v-else class="welcome">你好，请登录</span>
        </div>
        <section class="section">
            <div class="div" @click="">
                <img
                    class="bgImg"
                    src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/group.jpg"
                    mode="aspectFill"
                    alt=""
                    @click="utils.previewImage('https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/group.jpg')"
                />
            </div>
            <div class="flex cate">
                <div @click="" class="left">
                    <image style="height: 340rpx" class="imgIcon" src="@/static/images/accomplishment-icon.png" mode="aspectFill" alt="" @click="" />
                </div>
                <div @click="" class="right">
                    <image style="height: 340rpx" class="imgIcon" src="@/static/images/conference-icon.png" mode="aspectFill" alt="" />
                </div>
            </div>
            <swiper v-if="swiperItems.length !== 0" autoplay circular interval="2000" duration="500" style="overflow: hidden; width: 376px; height: 145px">
                <swiper-item v-for="(item, index) in swiperItems" :key="index">
                    <img class="imgIcon" :src="item" mode="aspectFill" style="width: 376px; height: 145px" />
                </swiper-item>
            </swiper>
        </section>
        <div v-if="briefUserInfo && show" class="boxTwo">
            <div class="selectList">
                <div class="tab" style="display: flex">
                    通知公告
                    <button class="cu-btn btn round line-blue" style="margin: 10rpx 20rpx" @click="gotoReleaseNotice">发布通知公告</button>
                </div>
                <p v-if="notices.length === 0" style="text-align: center; margin-top: 25rpx">暂无通知公告</p>
                <section class="shopList flex">
                    <div v-for="(notice, index) in notices" :key="index" class="box">
                        <div class="boxImg">
                            <div class="text" style="font-weight: bold">{{ notice.title }}</div>
                            <div class="divider"></div>
                            <div class="text" style="font-weight: normal">{{ notice.content }}</div>
                            <div class="text_time" style="font-weight: normal">{{ utils.format_time(notice.time) }}</div>
                            <div class="divider"></div>
                            <div style="display: flex">
                                <button class="btn round line-red" style="background-color: #fef2da" @click="deleteNotice(notice.id)">删</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <div style="height: 60rpx"></div>
    </div>
    <tabbar :current-page="0" />
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { loginCheck } from "@/utils/js/loginCheck.js";
import * as utils from "@/utils/js/utils.js";
import { onPullDownRefresh } from "@dcloudio/uni-app";
import { magic } from "@/utils/js/magic";
const show = magic();

const briefUserInfo = ref(null);
const swiperItems = ref([]);
for (let i = 1; i < 29; i++) {
    swiperItems.value.push(`https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/figures/${i}.png`);
}
onMounted(async () => {
    // 检查用户是否登录
    briefUserInfo.value = await loginCheck();
    await getAllNotices();
});

onPullDownRefresh(async () => {
    try {
        uni.reLaunch({
            url: "/pages/index/index"
        });
        uni.stopPullDownRefresh();
    } catch (error) {
        console.error(error);
    }
});

const notices = ref([]);

const getAllNotices = async () => {
    const data = {
        sessionid: uni.getStorageSync("sessionid")
    };
    const res = await uniRequest("POST", "extras", "/getAllNotice", data);
    if (res.status < 0) return;
    notices.value = res.notices;
};

const gotoReleaseNotice = () => {
    uni.navigateTo({
        url: "/pages/index/release-notice"
    });
};

const deleteNotice = async (noticeId) => {
    uni.showModal({
        title: "删除通知公告",
        content: "通知公告删除后不可恢复，您确认删除该通知公告？",
        success: async (r) => {
            if (r.confirm) {
                uni.showToast({
                    title: "删除中",
                    icon: "loading",
                    duration: 100000
                });
                const data = {
                    sessionid: uni.getStorageSync("sessionid"),
                    noticeId: noticeId
                };
                const res = await uniRequest("POST", "extras", "/deleteNotice", data);
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
            }
        }
    });
};
</script>

<style lang="scss" scoped>
@import "@/utils/scss/common-styles.scss";

.head {
    position: relative;
    background: linear-gradient(180deg, #f9d5a5, #1abfc0);

    .headTitle {
        font-weight: 600;
        font-size: 35rpx;
        color: #212121;
        line-height: 36rpx;
        position: absolute;
        text-align: center;
        width: 100%;
        top: 100rpx;
        z-index: 999;
    }

    .welcome {
        font-weight: 600;
        font-size: 30rpx;
        color: #212121;
        line-height: 50rpx;
        position: absolute;
        text-align: start;
        width: 100%;
        left: 40rpx;
        top: 160rpx;
        z-index: 999;
    }
}

.section {
    box-sizing: border-box;
    padding: 0rpx 20rpx;
    margin-top: 220rpx;
}

.imgIcon {
    width: 100%;
    border-radius: 20rpx;
}

.cate {
    box-sizing: border-box;
    padding: 15rpx 10rpx;
    text-align: center;

    .left {
        width: 48%;
    }

    .right {
        width: 48%;
        text-align: left;
    }
}

.div {
    position: relative;
    box-sizing: border-box;
    padding: 10rpx;
    height: 320rpx;

    .bgImg {
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
    }
}

.boxTwo {
    position: relative;
    bottom: 100rpx;
    margin-top: 140rpx;
}

.selectList {
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    background-color: white;
    box-sizing: border-box;
    padding: 20rpx 30rpx;
    background: repeating-linear-gradient(45deg, #f8f8f8, #f8f8f8 10rpx, #e0e0e0 10rpx, #e0e0e0 20rpx); // 白灰色细腻斜向条纹
}

.tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    border-radius: 16rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
    background: linear-gradient(135deg, #f6e6a1, #f5b8d1);
}

.shopList {
    display: flex;
}

.box {
    width: 48%;
    background: linear-gradient(135deg, #fef2da, #ffd5a4);
    border-radius: 12rpx;
    margin-top: 24rpx;
    overflow: hidden;

    .boxImg {
        width: 100%;
        height: 300rpx;
        overflow: auto;
    }

    .text {
        font-family: PingFang SC, PingFang SC;
        font-size: 28rpx;
        color: #282456;
        line-height: 44rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin: 20rpx 20rpx;
    }

    .text_time {
        font-family: PingFang SC, PingFang SC;
        font-size: 19rpx;
        color: #282456;
        line-height: 10rpx;
        text-align: end;
        font-style: normal;
        text-transform: none;
        margin: 20rpx 20rpx;
    }
}

.divider {
    background-color: #f2f2f2;
    margin: 15rpx 15rpx;
    height: 3rpx;
}
</style>

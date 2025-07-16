<template>
    <div class="app">
        <div class="phb flex">
            <div>
                <div>
                    <span class="num">{{ users.length }}</span>
                    <span class="jf" style="margin-left: 20rpx">人</span>
                </div>
                <div style="color: #666666; margin-top: 20rpx" class="jf">成员总数</div>
            </div>
            <div>
                <div>
                    <span class="num">{{ stuLength }}</span>
                    <span class="jf" style="margin-left: 20rpx">人</span>
                </div>
                <div style="color: #666666; margin-top: 20rpx" class="jf">学生人数</div>
            </div>
            <div>
                <div>
                    <span class="num">{{ teacherLength }}</span>
                    <span class="jf" style="margin-left: 20rpx">人</span>
                </div>
                <div style="color: #666666; margin-top: 20rpx" class="jf">教师人数</div>
            </div>
            <div v-if="briefUserInfo?.usertype > 1" :style="uncheckedUsersAmount > 0 ? 'color: #f25c07' : ''" @click="gotoUncheckedUsers">
                <div>
                    <span class="num">{{ uncheckedUsersAmount }}</span>
                    <span class="jf" style="margin-left: 20rpx">人</span>
                </div>
                <div style="margin-top: 20rpx" class="jf">待审核成员</div>
            </div>
        </div>

        <section class="section">
            <div style="display: flex">
                <u-search v-model="searchContent" :show-action="false" placeholder="输入成员姓名" style="margin-top: 10rpx; width: 550rpx"></u-search>
                <button class="cu-btn btn round bg-cyan" style="margin: 10rpx 20rpx" @click="searchUser">查找</button>
            </div>
            <div v-for="(user, index) in users" :key="index" class="boxList flex">
                <div class="left">
                    <img v-if="user.avatarUrl" class="lIcon" :src="user.avatarUrl" alt="" />
                    <img v-else-if="user.gender === 1" class="lIcon" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/male.png" alt="" />
                    <img v-else-if="user.gender === 2" class="lIcon" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/female.png" alt="" />
                </div>
                <div class="right">
                    <div class="text1" style="display: flex">
                        <p style="color: #d9d9d9">{{ index + 1 }}&nbsp;&nbsp;</p>
                        {{ user.username }}&nbsp;&nbsp;
                        <p style="color: #999999">{{ user.workNum }}</p>
                    </div>
                    <div class="text2">{{ conventions.getUserRole(user.role) }} | {{ conventions.getUserDegree(user.degree) }}</div>
                    <div class="text3 flex">
                        <div v-if="user.role === 1" class="l" style="font-size: 28rpx; color: #f25c07">导师：{{ user.supervisorName }}</div>
                        <div v-else-if="user.role === 2" class="l" style="font-size: 28rpx; color: #f25c07">学生数：{{ user.stuAmount }}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <div style="height: 100rpx"></div>
    <tabbar :current-page="2" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { loginCheck, onlyLoginedAccess } from "@/utils/js/loginCheck.js";
import { onPullDownRefresh } from "@dcloudio/uni-app";
import * as conventions from "@/utils/js/conventions.js";

const briefUserInfo = ref(null);
const users = ref([]);
onMounted(async () => {
    await onlyLoginedAccess();
    // 检查用户是否登录
    briefUserInfo.value = await loginCheck();
    await Promise.all([getAllUsers(), getUncheckedUsersAmount()]);
});

onPullDownRefresh(async () => {
    try {
        uni.reLaunch({
            url: "/pages/user-list/index"
        });
        uni.stopPullDownRefresh();
    } catch (error) {
        console.error(error);
    }
});

const stuLength = computed(() => users.value.filter((user) => user.role === 1).length);
const teacherLength = computed(() => users.value.filter((user) => user.role === 2).length);

const getAllUsers = async () => {
    const res = await uniRequest("POST", "user", "/getAllUsers", { sessionid: uni.getStorageSync("sessionid") });
    if (res.status < 0) return;
    users.value = res.users;
    for (const user of users.value) {
        const data = {
            sessionid: uni.getStorageSync("sessionid"),
            stuId: user.id
        };
        const r = await uniRequest("POST", "user", "/getSupervisorInfo", data);
        user.supervisorName = r.supervisorName || "未知";
    }
};

const uncheckedUsersAmount = ref(0);
const getUncheckedUsersAmount = async () => {
    const res = await uniRequest("POST", "user", "/getUncheckedUsersAmount", { sessionid: uni.getStorageSync("sessionid") });
    if (res.status < 0) return;
    uncheckedUsersAmount.value = res.uncheckedUsersAmount;
};

const searchContent = ref("");
const searchUser = async () => {
    const data = {
        sessionid: uni.getStorageSync("sessionid"),
        searchContent: searchContent.value
    };
    const res = await uniRequest("POST", "user", "/searchUser", data);
    users.value = res.users;

    for (const user of users.value) {
        const data = {
            sessionid: uni.getStorageSync("sessionid"),
            stuId: user.id
        };
        const r = await uniRequest("POST", "user", "/getSupervisorInfo", data);
        user.supervisorName = r.supervisorName || "未知";
    }
};

const gotoUncheckedUsers = () => {
    if (uncheckedUsersAmount.value === 0) return;
    uni.navigateTo({
        url: "/pages/user-list/unchecked-users"
    });
};
</script>

<style lang="scss" scoped>
@import "@/utils/scss/common-styles.scss";

.foot {
    .left {
        text-align: center;
        background-color: #ffffff;
        box-sizing: box-sizing;
        padding: 20rpx;
        padding-top: 36rpx;
        margin-top: 25rpx;
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
        line-height: 30rpx;
    }

    .r {
        background-color: #f9d67a !important;
    }
}

.section {
    background: #ffffff;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    box-sizing: border-box;
    padding: 20rpx;
    margin-top: 20rpx;

    .cu-btn {
        margin-right: 20rpx;
        white-space: nowrap;
    }

    .boxList {
        margin-top: 6rpx;
        box-sizing: border-box;
        padding: 30rpx 20rpx;
        padding-top: 40rpx;
        border-bottom: 1px solid #f2f2f2;

        .left {
            width: 15%;
        }

        .right {
            .quan {
                margin-right: 4rpx;
                border-radius: 50%;
                background: #d9d9d9;
                width: 28rpx;
                height: 28rpx;
                display: inline-block;
                position: relative;
                top: 4rpx;
            }

            .text1 {
                font-weight: 500;
                font-size: 32rpx;
                color: #333333;
                line-height: 32rpx;
            }

            .text2 {
                margin-top: 28rpx;
                font-weight: 500;
                font-size: 28rpx;
                color: #999999;
                line-height: 40rpx;
            }

            .text3 {
                margin-top: 28rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #999999;
                line-height: 24rpx;
            }

            width: 83%;
        }

        .lIcon {
            width: 80rpx;
            height: 80rpx;

            border-radius: 12rpx 12rpx 12rpx 12rpx;
        }
    }
}

.text {
    font-weight: 600;
    font-size: 32rpx;
    box-sizing: border-box;
    padding-top: 22rpx;
}

.divider {
    background-color: #f2f2f2;
    margin: 28rpx 0rpx;
    height: 1rpx;
}

.codeA {
    text-align: left !important;
    padding: 30rpx !important;

    .xian {
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
        color: #333333;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .text2 {
        margin-top: 70rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 28rpx;
        color: #f25c07;
        line-height: 40rpx;
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

.phb {
    .yjfk {
        font-size: 28rpx;
        color: #333333;
        line-height: 28rpx;
    }

    box-sizing: border-box;
    padding: 30rpx;
    background-color: white;
    margin-top: 20rpx;
    background: linear-gradient(135deg, #bef0e5, #f2a6c1);
    border-radius: 14rpx;

    .jf {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        line-height: 36rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .num {
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        font-size: 48rpx;
        line-height: 48rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }
}
</style>

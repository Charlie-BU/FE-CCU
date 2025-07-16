<template>
    <div class="app">
        <p v-if="uncheckedUsers.length === 0" style="text-align: center; margin-top: 20rpx">暂无待审核用户</p>
        <section v-else class="section">
            <div v-for="(user, index) in uncheckedUsers" :key="index" class="boxList flex">
                <div class="left">
                    <img v-if="user.gender === 1" class="lIcon" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/male.png" alt="" />
                    <img v-else-if="user.gender === 2" class="lIcon" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/female.png" alt="" />
                </div>
                <div class="right">
                    <div class="text1" style="display: flex; margin-bottom: 20rpx">
                        <p style="color: #d9d9d9">{{ index + 1 }}&nbsp;&nbsp;</p>
                        {{ user.username }}&nbsp;&nbsp;
                        <p style="color: #999999">{{ user.workNum }}</p>
                    </div>
                    <div class="text2">
                        手机号：
                        <p style="color: #f25c07">{{ user.phone }}</p>
                    </div>
                    <div class="text2">
                        邮箱：
                        <p style="color: #f25c07">{{ user.email }}</p>
                    </div>
                    <div class="text2">
                        身份：
                        <p style="color: #f25c07">{{ conventions.getUserRole(user.role) }}</p>
                    </div>
                    <div class="text2">
                        {{ user.role === 1 ? "学号" : "工号" }}：
                        <p style="color: #f25c07">{{ user.workNum }}</p>
                    </div>
                    <div class="text2">
                        学历：
                        <p style="color: #f25c07">{{ conventions.getUserDegree(user.degree) }}</p>
                    </div>
                    <div v-if="user.role === 1" class="text2">
                        毕业时间：
                        <p style="color: #f25c07">{{ user.graduateTime || "未填写" }}</p>
                    </div>
                    <div class="text2">
                        注册时间：
                        <p style="color: #f25c07">{{ utils.format_time(user.joinTime) }}</p>
                    </div>
                </div>
                <div style="margin-top: 15rpx; margin-left: 380rpx; white-space: nowrap">
                    <button class="cu-btn btn round bg-green" @click="checkUser(user.id, 1)">通过</button>
                    <button class="cu-btn btn round bg-red" @click="checkUser(user.id, 2)">驳回</button>
                </div>
            </div>
        </section>
    </div>
    <div style="height: 100rpx"></div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { loginCheck, onlyLoginedAccess } from "@/utils/js/loginCheck.js";
import * as conventions from "@/utils/js/conventions.js";
import * as utils from "@/utils/js/utils.js";

const briefUserInfo = ref(null);
onMounted(async () => {
    await onlyLoginedAccess();
    // 检查用户是否登录
    briefUserInfo.value = await loginCheck();
    if (briefUserInfo.value.usertype === 1) {
        uni.showToast({
            title: "权限不足",
            icon: "none",
            duration: 1000
        });
        setTimeout(() => {
            uni.reLaunch({
                url: "/pages/index/index"
            });
        }, 1000);
    }
    await getUncheckedUsersInfo();
});

const uncheckedUsers = ref([]);
const getUncheckedUsersInfo = async () => {
    const res = await uniRequest("POST", "user", "/getUncheckedUsersInfo", { sessionid: uni.getStorageSync("sessionid") });
    if (res.status < 0) return;
    uncheckedUsers.value = res.uncheckedUsers;
};

const checkUser = async (userId, opinion) => {
    if (opinion === 1) {
        uni.showModal({
            title: "新成员审核",
            content: "确定通过该成员的注册？",
            success: async (r) => {
                if (r.confirm) {
                    uni.showToast({
                        title: "请稍后",
                        icon: "loading",
                        duration: 100000
                    });
                    const data = {
                        sessionid: uni.getStorageSync("sessionid"),
                        userId: userId,
                        opinion: opinion,
                        massage: ""
                    };
                    const res = await uniRequest("POST", "user", "/checkNewUser", data);
                    uni.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 1000
                    });
                    if (res.status < 0) return;
                    setTimeout(() => {
                        uni.reLaunch({
                            url: "/pages/user-list/unchecked-users"
                        });
                    }, 1000);
                }
            }
        });
    } else if (opinion === 2) {
        uni.showModal({
            title: "审核驳回",
            editable: true,
            placeholderText: "请输入驳回理由",
            success: async (r) => {
                if (!r.content) {
                    uni.showToast({
                        title: "请输入驳回理由",
                        icon: "none",
                        duration: 800
                    });
                    return;
                }
                if (r.confirm) {
                    uni.showToast({
                        title: "请稍后",
                        icon: "loading",
                        duration: 100000
                    });
                    const data = {
                        sessionid: uni.getStorageSync("sessionid"),
                        userId: userId,
                        opinion: opinion,
                        massage: r.content
                    };
                    const res = await uniRequest("POST", "user", "/checkNewUser", data);
                    uni.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 1500
                    });
                    if (res.status < 0) return;
                    setTimeout(() => {
                        uni.reLaunch({
                            url: "/pages/user-list/unchecked-users"
                        });
                    }, 1500);
                }
            }
        });
    }
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
                font-weight: 500;
                font-size: 28rpx;
                line-height: 45rpx;
                display: flex;
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

<template>
    <div class="app">
        <div class="head">
            <div class="headTitle">功能分子材料研究组管理平台</div>
        </div>
        <div v-if="user">
            <div class="header">
                <div class="topIcon">
                    <img class="icon" src="" alt="" />
                    <img class="icon" src="" alt="" />
                </div>
                <div class="userDate flex">
                    <button class="btn-outline-sm" @click="logout">退出登录</button>
                    <div class="left">
                        <img v-if="user.avatarUrl" class="user" style="border-radius: 50%" :src="user.avatarUrl" alt="" />
                        <img v-else-if="user.gender == 1" class="user" style="border-radius: 50%" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/male.png" alt="" />
                        <img v-else-if="user.gender == 2" class="user" style="border-radius: 50%" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/female.png" alt="" />
                    </div>
                    <div class="right">
                        <div class="nike">{{ user.username }} - {{ user.directionName }}</div>
                        <div class="model">{{ user.workNum }}</div>
                    </div>
                </div>
                <div class="userList flex">
                    <div class="itemList">
                        <p v-if="user.role === 1" class="p">学生</p>
                        <p v-else-if="user.role === 2" class="p">教师</p>
                        <div class="span">身份</div>
                    </div>
                    <div class="itemList">
                        <p class="p">{{ conventions.getUserDegree(user.degree) }}</p>
                        <div class="span">学历</div>
                    </div>
                    <div v-if="user.role === 1" class="itemList">
                        <p v-if="supervisor" class="p">{{ supervisor.name }}</p>
                        <div class="span">导师</div>
                    </div>
                    <div v-else-if="user.role === 2" class="itemList">
                        <p class="p">{{ user.stuAmount }}</p>
                        <div class="span">学生数</div>
                    </div>
                </div>
            </div>
            <section style="margin-top: 20rpx" class="section">
                <div class="box2 flex">
                    <div class="boxT" @click="gotoEquipment">
                        <div class="top">
                            <div class="tip"></div>
                            <div class="myPm">负责设备</div>
                            <u-icon class="fr" style="position: relative; top: 5rpx" name="arrow-right" color="#212121" size="28" />
                            <div class="tp flex">
                                <div class="LEFT">
                                    <img class="LEFTiCON round" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/equipment.jpg" alt="" mode="aspectFill" />
                                </div>
                                <div v-if="takingEquipmentInfo[0] === 0" class="righttP" style="font-weight: 600; margin-top: 20rpx; color: red">暂无负责设备</div>
                                <div v-else class="righttP" style="font-weight: 600">
                                    {{ takingEquipmentInfo[1] }} 等
                                    <div style="color: red">{{ takingEquipmentInfo[0] }} 件</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="boxT" @click="gotoChemical">
                        <div class="top">
                            <div class="tip"></div>
                            <div class="myPm">领用药品</div>
                            <u-icon class="fr" style="position: relative; top: 5rpx" name="arrow-right" color="#212121" size="28" />
                            <div class="tp flex">
                                <div class="LEFT">
                                    <img class="LEFTiCON round" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/chemical.jpg" alt="" mode="aspectFill" />
                                </div>
                                <div v-if="takingChemicalInfo[0] === 0" class="righttP" style="font-weight: 600; margin-top: 20rpx; color: red">暂无领用药品</div>
                                <div v-else class="righttP" style="font-weight: 600">
                                    {{ takingChemicalInfo[1] }} 等
                                    <div style="color: red">{{ takingChemicalInfo[0] }} 件</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="userList flex">
                    <div class="itemList" style="width: 25%; white-space: nowrap" @click="gotoModifyInfo">
                        <view>
                            <p class="p">
                                <u-icon name="setting-fill" size="40" />
                            </p>
                            <div class="span">修改个人信息</div>
                        </view>
                    </div>
                    <div class="itemList" style="width: 25%; white-space: nowrap" @click="gotoModifyPwd">
                        <view>
                            <p class="p">
                                <u-icon name="lock-fill" size="40" />
                            </p>
                            <div class="span">修改密码</div>
                        </view>
                    </div>
                    <div class="itemList" style="width: 25%; white-space: nowrap" @click="setPrivacy">
                        <view>
                            <view v-if="user.isPrivate">
                                <p class="p">
                                    <u-icon name="account" size="40" />
                                </p>
                                <div class="span">设为公开用户</div>
                            </view>
                            <view v-else>
                                <p class="p">
                                    <u-icon name="account-fill" size="40" />
                                </p>
                                <div class="span">设为私密用户</div>
                            </view>
                        </view>
                    </div>
                    <!-- <div v-if="user.usertype === 2 || user.usertype === 6" class="itemList" style="width: 25%; white-space: nowrap">
                        <view @click="gotoManagement">
                            <p class="p">
                                <u-icon name="integral-fill" size="40" />
                            </p>
                            <div class="span">平台管理</div>
                        </view>
                    </div> -->
                </div>

                <div class="tipTitle">个人信息</div>
                <div style="margin: 30rpx">
                    <uni-table stripe emptyText="无数据" style="z-index: -1">
                        <uni-tr>
                            <uni-td>
                                <view class="table_head">姓名</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ user.username }}</view>
                            </uni-td>
                        </uni-tr>
                        <uni-tr>
                            <uni-td>
                                <view class="table_head">性别</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ conventions.getUserGender(user.gender) }}</view>
                            </uni-td>
                        </uni-tr>
                        <uni-tr>
                            <uni-td>
                                <view class="table_head">手机号</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ user.phone }}</view>
                            </uni-td>
                        </uni-tr>
                        <uni-tr>
                            <uni-td>
                                <view class="table_head">邮箱</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ user.email }}</view>
                            </uni-td>
                        </uni-tr>
                        <uni-tr>
                            <uni-td>
                                <view class="table_head">身份</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ conventions.getUserRole(user.role) }}</view>
                            </uni-td>
                        </uni-tr>
                        <uni-tr>
                            <uni-td>
                                <view class="table_head">{{ user.role === 1 ? "学号" : "工号" }}</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ user.workNum }}</view>
                            </uni-td>
                        </uni-tr>
                        <uni-tr>
                            <uni-td>
                                <view class="table_head">学历</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ conventions.getUserDegree(user.degree) }}</view>
                            </uni-td>
                        </uni-tr>
                        <uni-tr>
                            <uni-td>
                                <view class="table_head">研究方向</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ user.directionName }}</view>
                            </uni-td>
                        </uni-tr>
                        <uni-tr v-if="user.role === 1">
                            <uni-td>
                                <view class="table_head">毕业时间</view>
                            </uni-td>
                            <uni-td>
                                <view class="table_content">{{ user.graduateTime }}</view>
                            </uni-td>
                        </uni-tr>
                    </uni-table>
                </div>
            </section>
            <div style="height: 150rpx"></div>
        </div>

        <div v-else>
            <div class="header">
                <div class="topIcon">
                    <img class="icon" src="" alt="" />
                    <img class="icon" src="" alt="" />
                </div>
                <div class="userDate flex">
                    <button class="btn-outline-sm" style="left: 395rpx" @click="gotoLogin">登录</button>
                    <button v-if="show" class="btn-outline-sm" style="left: 570rpx" @click="gotoRegister">注册</button>
                    <div class="left">
                        <img class="user" style="border-radius: 50%" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/unlogined.png" alt="" />
                    </div>
                    <div class="right">
                        <div class="nike">请登录</div>
                    </div>
                </div>
            </div>
            <div style="height: 1000rpx"></div>
        </div>
    </div>
    <tabbar :current-page="4"></tabbar>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";

import { onPullDownRefresh } from "@dcloudio/uni-app";
import { uniRequest } from "@/utils/js/api.js";
import { loginCheck, getUserInfo } from "@/utils/js/loginCheck.js";
import * as utils from "@/utils/js/utils.js";
import * as conventions from "@/utils/js/conventions.js";
import { magic } from "@/utils/js/magic";
const show = magic();

const user = ref(null);
const supervisor = ref(null);
const takingEquipmentInfo = ref([]);
const takingChemicalInfo = ref([]);

onMounted(async () => {
    // 检查用户是否登录
    const briefUserInfo = await loginCheck();
    // 获取详细用户数据
    if (briefUserInfo) {
        user.value = await getUserInfo();
        // 获取导师信息
        if (user.value.role === 1) {
            supervisor.value = await getSupervisorInfo();
        }
        // 获取设备及药品信息
        [takingEquipmentInfo.value, takingChemicalInfo.value] = await getEquipmentAndChemicalInfo();
    }
});

onPullDownRefresh(async () => {
    try {
        uni.reLaunch({
            url: "/pages/my/index"
        });
        uni.stopPullDownRefresh();
    } catch (error) {
        console.error(error);
    }
});

const getSupervisorInfo = async () => {
    const data = {
        sessionid: uni.getStorageSync("sessionid"),
        stuId: user.value.id
    };
    const res = await uniRequest("POST", "user", "/getSupervisorInfo", data);
    if (res.status === 200) {
        return { name: res.supervisorName || "未知" };
    }
    return { name: "未知" };
};

const getEquipmentAndChemicalInfo = async () => {
    const res = await uniRequest("POST", "user", "/getEquipmentAndChemicalInfo", { sessionid: uni.getStorageSync("sessionid") });
    if (res.status === 200) {
        return [res.data.equipmentInfo, res.data.chemicalInfo];
    }
    return null;
};

const logout = () => {
    uni.clearStorageSync();
    uni.reLaunch({
        url: "/pages/my/index"
    });
};

const gotoLogin = () => {
    uni.navigateTo({
        url: "/pages/login/login"
    });
};

const gotoRegister = () => {
    uni.navigateTo({
        url: "/pages/login/register"
    });
};

const gotoEquipment = () => {
    uni.switchTab({
        url: "/pages/equipment/index"
    });
};

const gotoChemical = () => {
    uni.switchTab({
        url: "/pages/chemicals/index"
    });
};

const gotoModifyInfo = () => {
    uni.navigateTo({
        url: "/pages/login/register"
    });
};
const gotoModifyPwd = () => {
    uni.navigateTo({
        url: "/pages/my/modifyPwd"
    });
};
const setPrivacy = () => {};
const gotoManagement = () => {};
</script>

<style lang="scss" scoped>
@import "@/utils/scss/common-styles.scss";

.head {
    position: relative;

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
}

.header {
    width: 100%;
    height: 400rpx;
    box-sizing: border-box;
    padding: 30rpx;
    padding-top: 60rpx;

    .icon {
        margin-right: 20rpx;
        width: 37rpx;
        height: 37rpx;
    }

    .userDate {
        margin-top: 50rpx;
    }

    .nike {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 36rpx;
        color: #282456;
        line-height: 36rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .left {
        width: 20%;
    }

    .right {
        width: 80%;
        box-sizing: border-box;
        padding-top: 20rpx;
    }

    .model {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 24rpx;
        margin-top: 20rpx;
        margin-left: 8rpx;
        font-style: normal;
        text-transform: none;
    }
}

.btn-outline-sm {
    position: absolute;
    display: inline-block;
    padding: 1rem 1.5rem 1rem 1.5rem;
    border: 1px solid #f25c05;
    border-radius: 30px;
    background-color: transparent;
    color: #f25c05;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 0;
    text-decoration: none;
    transition: all 0.2s;
    top: 210rpx;
    left: 520rpx;
}

.btn-modify {
    position: relative;
    display: inline-block;
    padding: 1rem 1.5rem 1rem 1.5rem;
    border: 1px solid #00ffff;
    border-radius: 30px;
    background-color: transparent;
    color: #00ffff;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 0;
    text-decoration: none;
    transition: all 0.2s;
    top: 18rpx;
    left: 15rpx;
}

.topIcon {
    margin-top: 30rpx;
}

.wrapper {
    margin-top: 7rpx;
    height: 55rpx;
}

.tipTitle {
    position: relative;
    margin-top: 55rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 32rpx;
    color: #212121;
    line-height: 36rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.phBox {
    background: linear-gradient(320deg, #f7eddd 0%, #edd3bc 100%);
    border-radius: 0rpx 0rpx 20rpx 20rpx;
    box-sizing: border-box;
    padding: 26rpx 16rpx;
    padding-top: 40rpx;

    .bc {
        border-radius: 12rpx 12rpx 12rpx 12rpx;

        .text1 {
            margin-top: 4rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: bold;
            font-size: 28rpx;
            color: #282456;
            line-height: 30rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }

        .text2 {
            margin-top: 19rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 24rpx;
            color: #f25c07;
            line-height: 10rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }

        .text3 {
            margin-top: 27rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #666666;
            line-height: 0rpx;
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
                border-radius: 10%;
                width: 100%;
                height: 130rpx;
            }
        }

        margin-top: 30rpx;
        background-color: white;
        box-sizing: box-sizing;
        padding: 18rpx 14rpx;
    }

    .title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 28rpx;
        color: #212121;
        line-height: 24rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-top: 20rpx;
    }
}

.piCon {
    width: 44rpx;
    height: 44rpx;
}

.table_head {
    width: 150rpx;
    text-align: center;
    font-weight: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.table_content {
    width: 450rpx;
    text-align: center;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.section {
    box-sizing: border-box;
    padding: 20rpx 32rpx;
    box-sizing: border-box;
    padding-top: 90rpx;
}

.box2 {
    .tp {
        box-sizing: box-sizing;
        padding: 0rpx 18rpx;
        margin-top: 40rpx;
    }

    .boxT {
        box-sizing: box-sizing;
        padding: 20rpx;
        background-color: #ffffff;
        width: 48%;

        border-radius: 20rpx 20rpx 20rpx 20rpx;

        .LEFTiCON {
            width: 85rpx;
            height: 85rpx;
        }

        .myPm {
            margin-left: 14rpx;
            display: inline-block;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 32rpx;
            color: #212121;
            line-height: 40rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }

        .righttP {
            width: 60%;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 28rpx;
            color: #212121;
            line-height: 28rpx;
            text-align: center;
            line-height: 40rpx;
            font-style: normal;
            text-transform: none;
            white-space: nowrap;
        }

        .tipText {
            font-size: 28rpx;
            color: #666666;
            margin-top: 12rpx;
            margin-left: 20rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10rpx;
        }

        .spanTip {
            color: #f25c07;
            font-weight: bold;
            margin-right: 20rpx;
            text-align: right;
        }

        .tip {
            display: inline-block;
            width: 6rpx;
            height: 20rpx;
            background: #f25c07;
            border-radius: 12rpx 12rpx 12rpx 12r;
        }
    }
}

.userList {
    position: relative;
    top: 30rpx;
    box-sizing: box-sizing;
    padding: 28rpx 20rpx;
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
}

.itemList {
    text-align: center;
    width: 24%;
}

.user {
    width: 120rpx;
    height: 120rpx;
    border-radius: 0rpx 0rpx 0rpx 0rpx;
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

:deep(.uni-table) {
    background: transparent;
}
</style>

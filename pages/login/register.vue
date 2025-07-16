<template>
    <view class="main">
        <view class="pagenation">
            <view class="pagenation_back" @click="goBack">
                <image class="back_arrow" src="..\..\static\tabbar\back.png" mode="aspectFill" />
            </view>
        </view>
        <view v-if="show" class="login">
            <view class="kuang shadow">
                <view class="hint">{{ user ? "修改个人信息" : "用户注册" }}</view>
                <view class="form-group">
                    <image class="images" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg" mode="aspectFill" />
                    <view class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            姓名：
                        </view>
                        <input :placeholder="user ? user.username : '请输入真实姓名'" maxlength="100" class="ipt tpyA" v-model="form.username" placeholder-class="phc ipt" />
                    </view>
                    <view class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            性别：
                        </view>
                        <radio-group @change="handleGenderChange">
                            <label class="radio" style="margin-left: 15rpx; margin-right: 20rpx">
                                <radio value="1" color="#FFCC33" style="transform: scale(0.7)" :checked="user?.gender === 1" />
                                男
                            </label>
                            <label class="radio">
                                <radio value="2" color="#FFCC33" style="transform: scale(0.7)" :checked="user?.gender === 2" />
                                女
                            </label>
                        </radio-group>
                    </view>
                    <view class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            手机号：
                        </view>
                        <input :placeholder="user ? user.phone : '请输入手机号'" maxlength="100" class="ipt tpyA" v-model="form.phone" placeholder-class="phc ipt" />
                    </view>
                    <view class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            电子邮箱：
                        </view>
                        <input :placeholder="user ? user.email : '请输入电子邮箱'" maxlength="100" class="ipt tpyA" v-model="form.email" placeholder-class="phc ipt" />
                    </view>
                    <view class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            身份：
                        </view>
                        <radio-group @change="handleRoleChange">
                            <label class="radio" style="margin-left: 15rpx; margin-right: 20rpx">
                                <radio value="1" color="#FFCC33" style="transform: scale(0.7)" :checked="user?.role === 1" :disabled="user" />
                                学生
                            </label>
                            <label class="radio">
                                <radio value="2" color="#FFCC33" style="transform: scale(0.7)" :checked="user?.role === 2" :disabled="user" />
                                教师
                            </label>
                        </radio-group>
                    </view>
                    <view class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            学位：
                        </view>
                        <radio-group @change="handleDegreeChange">
                            <label class="radio" style="margin-left: 15rpx; margin-right: 20rpx">
                                <radio value="1" color="#FFCC33" style="transform: scale(0.7)" :checked="user?.degree === 1" />
                                学士
                            </label>
                            <label class="radio">
                                <radio value="2" color="#FFCC33" style="transform: scale(0.7)" :checked="user?.degree === 2" />
                                硕士
                            </label>
                            <br />
                            <label class="radio" style="margin-left: 16rpx">
                                <radio value="3" color="#FFCC33" style="transform: scale(0.7)" :checked="user?.degree === 3" />
                                博士
                            </label>
                            <label class="radio" style="margin-left: 21rpx">
                                <radio value="4" color="#FFCC33" style="transform: scale(0.7)" :checked="user?.degree === 4" />
                                其他
                            </label>
                        </radio-group>
                    </view>
                    <view class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            学号 / 工号：
                        </view>
                        <input :placeholder="user ? user.workNum : '请输入学号 / 工号'" maxlength="100" class="ipt tpyA" v-model="form.workNum" placeholder-class="phc ipt" />
                    </view>
                    <view v-if="form.role == 1 || user?.role === 1" class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            毕业时间（预计）：
                        </view>
                        <picker mode="date" fields="month" :value="form.graduateTime" @change="handleGraduateTimeChange" class="ipt">
                            <view style="color: #6d6d6d">{{ form.graduateTime || user?.graduateTime || "请选择毕业时间" }}</view>
                        </picker>
                    </view>
                    <view v-if="!user" class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            密码：
                        </view>
                        <input placeholder="请输入密码" maxlength="100" v-model="form.password" class="ipt tpyA" type="password" placeholder-class="phc ipt" />
                    </view>
                    <view v-if="!user" class="inputSection">
                        <view class="title ipt">
                            <span style="color: red">*</span>
                            确认密码：
                        </view>
                        <input placeholder="请再次输入密码" maxlength="100" v-model="form.confirmPassword" class="ipt tpyA" type="password" placeholder-class="phc ipt" />
                    </view>
                </view>
                <button v-if="!user" class="btn round" style="background-color: #f05b05" @click="register">注册</button>
                <button v-else class="btn round" style="background-color: #f05b05" @click="modifySubmit">确定</button>
                <button v-if="!user" class="btn round" style="background-color: #5853bf" @click="gotoLogin">登录</button>
            </view>
        </view>
        <view class="bottom"></view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uniRequest } from "@/utils/js/api";
import { loginCheck, getUserInfo } from "@/utils/js/loginCheck";
import { magic } from "@/utils/js/magic";
const show = magic();

const user = ref(null);
onMounted(async () => {
    // 检查用户是否登录
    const briefUserInfo = await loginCheck();
    // 获取详细用户数据
    if (briefUserInfo) {
        user.value = await getUserInfo();
    }
});

const goBack = () => {
    uni.navigateBack();
};

const gotoLogin = () => {
    uni.navigateTo({
        url: "/pages/login/login"
    });
};

const form = ref({
    username: null,
    gender: null, // 1 for male, 2 for female
    email: "",
    phone: null,
    role: null, // 1 for student, 2 for teacher
    degree: null, // 1 for Bachelor, 2 for Master, 3 for PhD, 4 for Others
    workNum: null,
    graduateTime: "",
    password: null,
    confirmPassword: null
});

const handleGenderChange = (e) => {
    form.value.gender = +e.detail.value;
};

const handleRoleChange = (e) => {
    form.value.role = +e.detail.value;
};

const handleDegreeChange = (e) => {
    form.value.degree = +e.detail.value;
};

const handleGraduateTimeChange = (e) => {
    form.value.graduateTime = e.detail.value;
};

const requiredFields = ref({
    username: "姓名",
    gender: "性别",
    phone: "手机号",
    email: "电子邮箱",
    role: "身份",
    degree: "学位",
    workNum: "学号 / 工号",
    password: "密码",
    confirmPassword: "确认密码"
});

const register = async () => {
    uni.showToast({
        title: "提交中",
        icon: "loading",
        duration: 100000
    });
    const registerData = form.value;

    for (let requiredField in requiredFields.value) {
        if (!form.value[requiredField]) {
            uni.showToast({
                title: `请输入${requiredFields.value[requiredField]}`,
                icon: "none",
                duration: 800
            });
            return;
        }
    }

    if (form.value.role == 1 && !form.value.graduateTime) {
        uni.showToast({
            title: "请选择预计毕业时间",
            icon: "none"
        });
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^1[3-9]\d{9}$/;
    const pwdPattern = /^.{4,}$/;
    // 邮箱校验
    if (!emailPattern.test(registerData.email)) {
        uni.showToast({
            title: "请输入有效的邮箱",
            icon: "none"
        });
        return;
    }

    // 手机号校验
    if (!phonePattern.test(registerData.phone)) {
        uni.showToast({
            title: "请输入有效的手机号",
            icon: "none"
        });
        return;
    }

    // 密码校验
    if (!pwdPattern.test(registerData.password)) {
        uni.showToast({
            title: "密码长度必须大于3位",
            icon: "none"
        });
        return;
    }

    if (registerData.password !== registerData.confirmPassword) {
        uni.showToast({
            title: "两次密码输入不一致",
            icon: "none"
        });
        return;
    }
    const res = await uniRequest("POST", "user", "/register", registerData);
    uni.showToast({
        title: res.message,
        icon: "none",
        duration: 1000
    });
    if (res.status === 200) {
        setTimeout(() => {
            gotoLogin();
        }, 1000);
    }
};

const modifySubmit = async () => {
    const data = {
        sessionid: uni.getStorageSync("sessionid"),
        userData: form.value
    };
    const res = await uniRequest("POST", "user", "/modifyUserInfo", data);
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
        margin: 85rpx 40rpx;

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

.form-group .inputSection {
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

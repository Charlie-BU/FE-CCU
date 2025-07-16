<template>
	<view class="main">
		<view class="kuang shadow">
			<view class="hint">添加乒乓语录</view>
			<image class="images" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg" mode="aspectFill" />
			<view class="input_section" style="margin-top: 25px;">
				<view class="author">作者：</view>
				<input class="ipt" v-model="author" placeholder="请输入作者"/>
			</view>
			<view class="textarea_section">
				<view class="content">内容：</view>
				<textarea maxlength="-1" class="ipt tpyA" style="height: 150rpx;" v-model="content" placeholder="请输入内容" />
			</view>
			<button class="btn round" style="background-color: #f05b05;" @click="add">确认添加</button>
		</view>
	</view>
</template>

<script>
	import {uniRequest} from '@/utils/js/api.js'
	import {loginCheck} from '@/utils/js/loginCheck.js'
	import { magic } from '@/utils/js/magic.js'
	export default {
		data() {
			return {
				user: "",
				author: "",
				content: "",
				mottos: "",
				hide_this: magic(),
			}
		},
		onLoad() {
			loginCheck(user=>{
				this.user = user;
			});
			
		},
		methods: {
			add() {
				let data = {
					"author": this.author,
					"content": this.content,
					"user_id": this.user.id,
				};
				uniRequest("POST", "add_motto", data, "application", res => {
					wx.showToast({
						title: res.data.message,
						icon:"none",
						duration: 1000,
					});
					if (res.data.status == 200) {
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/management/index',
							})
						}, 1000);
					}
				});
				
			},
		}
	}
</script>



<style>
	.main {
		width: 100%;
		height: 1449rpx;
		background: linear-gradient(135deg, #1ABFC0, #FFD5A4);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		text-align: center;
		align-items: center;
	}
	
	.kuang {
		width: 650rpx;
		margin-top: 85rpx;
		background-color: #fff;
		padding: 50rpx 20rpx;
		border-radius: 30rpx;
		align-items: center;
	}
	
	.input_section {
		margin: 40rpx;
		display: flex;
	}
	
	.textarea_section {
		margin: 40rpx;
		display: flex;
	}
	
	.ipt {
		width: 180px;
	}
	
	.textarea {
		width: 180px;
		height: 60px;
	}
	
	.hint {
		width: 100%;
		color: black;
		font-size: 50rpx;
		font-weight: bold;
		text-align: center;
	}
	
	.images {
		height: 160rpx;
		width: 160rpx;
		border-radius: 50%;
	}
	
	.btn {
		background-color: #f05b05;
		color: #fff;
		width: 85%;
		font-size: 32rpx;
		margin: 40rpx;
	}
	
	.ipt {
		font-size: 26rpx;
	}
	
	.author{
		width: 50px;
	}
	
	.content {
		width: 50px;
	}
</style>
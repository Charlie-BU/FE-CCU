<template>
	<view class="u-form-item" :class="{'u-border-bottom': elBorderBottom, 'u-form-item__border-bottom--error': validateState === 'error' && showError('border-bottom')}">
		<view class="u-form-item__body" :style="{
			flexDirection: elLabelPosition == 'left' ? 'row' : 'column'
		}">
			<!-- 微信小程序中，将一个参数设置空字符串，结果会变成字符串"true" -->
			<view class="u-form-item--left" :style="{
				width: uLabelWidth,
				flex: `0 0 ${uLabelWidth}`,
				marginBottom: elLabelPosition == 'left' ? 0 : '10rpx',
			}">
				<!-- 为了块对齐 -->
				<view class="u-form-item--left__content" v-if="required || leftIcon || label">
					<!-- nvue不支持伪元素before -->
					<text v-if="required" class="u-form-item--left__content--required">*</text>
					<view class="u-form-item--left__content__icon" v-if="leftIcon">
						<u-icon :name="leftIcon" :custom-style="leftIconStyle" />
					</view>
					<view class="u-form-item--left__content__label" :style="[elLabelStyle, {
						'justify-content': elLabelAlign == 'left' ? 'flex-start' : elLabelAlign == 'center' ? 'center' : 'flex-end'
					}]">
						{{label}}
					</view>
				</view>
			</view>
			<view class="u-form-item--right u-flex">
				<view class="u-form-item--right__content">
					<view class="u-form-item--right__content__slot" :style="elLabelPosition == 'left' && elInputAlign == 'right' ? 'text-align:right;display: inline-block;line-height:initial;' : ''">
						<slot />
					</view>
					<view class="u-form-item--right__content__icon u-flex" v-if="$slots.right || rightIcon">
						<u-icon :custom-style="rightIconStyle" v-if="rightIcon" :name="rightIcon" />
						<slot name="right" />
					</view>
				</view>
			</view>
		</view>
		<view class="u-form-item__message" v-if="validateState === 'error' && showError('message')" :style="{
			paddingLeft: elLabelPosition == 'left' ? $u.addUnit(elLabelWidth) : '0',
			textAlign: elInputAlign == 'right' ? 'right' : 'left'
		}">{{validateMessage}}</view>
	</view>
</template>

<script>
	import Emitter from '../../libs/util/emitter.js';
	import schema from '../../libs/util/async-validator';
	// 去除警告信息
	schema.warning = function() {};

	/**
	 * form-item 表单item
	 * @description 此组件一般用于表单场景，可以配置Input输入框，Select弹出框，进行表单验证等。
	 * @tutorial https://vkuviewdoc.fsq.pub/components/form.html
	 * @property {String} label 左侧提示文字
	 * @property {Object} prop 表单域model对象的属性名，在使用 validate、resetFields 方法的情况下，该属性是必填的
	 * @property {Boolean} border-bottom 是否显示表单域的下划线边框
	 * @property {String} label-position 表单域提示文字的位置，left-左侧，top-上方
	 * @property {String Number} label-width 提示文字的宽度，单位rpx（默认90）
	 * @property {Object} label-style lable的样式，对象形式
	 * @property {String} label-align lable的对齐方式
	 * @property {String} right-icon 右侧自定义字体图标(限uView内置图标)或图片地址
	 * @property {String} left-icon 左侧自定义字体图标(限uView内置图标)或图片地址
	 * @property {Object} left-icon-style 左侧图标的样式，对象形式
	 * @property {Object} right-icon-style 右侧图标的样式，对象形式
	 * @property {Boolean} required 是否显示左边的"*"号，这里仅起展示作用，如需校验必填，请通过rules配置必填规则(默认false)
	 * @example <u-form-item label="姓名"><u-input v-model="form.name" /></u-form-item>
	 */

	export default {
		name: 'u-form-item',
		mixins: [Emitter],
		inject: {
			uForm: {
				default () {
					return null
				}
			}
		},
		props: {
			// input的label提示语
			label: {
				type: String,
				default: ''
			},
			// 绑定的值
			prop: {
				type: String,
				default: ''
			},
			// 是否显示表单域的下划线边框
			borderBottom: {
				type: [String, Boolean],
				default: ''
			},
			// label的位置，left-左边，top-上边
			labelPosition: {
				type: String,
				default: ''
			},
			// label的宽度，单位rpx
			labelWidth: {
				type: [String, Number],
				default: ''
			},
			// lable的样式，对象形式
			labelStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// lable字体的对齐方式
			labelAlign: {
				type: String,
				default: ''
			},
			// 右侧图标
			rightIcon: {
				type: String,
				default: ''
			},
			// 左侧图标
			leftIcon: {
				type: String,
				default: ''
			},
			// 左侧图标的样式
			leftIconStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 左侧图标的样式
			rightIconStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 是否显示左边的必填星号，只作显示用，具体校验必填的逻辑，请在rules中配置
			required: {
				type: Boolean,
				default: false
			},
			inputAlign:{
				type: String,
				default: ''
			},
		},
		data() {
			return {
				initialValue: '', // 存储的默认值
				// isRequired: false, // 是否必填，由于人性化考虑，必填"*"号通过props的required配置，不再通过rules的规则自动生成
				validateState: '', // 是否校验成功
				validateMessage: '', // 校验失败的提示语
				// 有错误时的提示方式，message-提示信息，border-如果input设置了边框，变成呈红色，
				errorType: ['message'],
				fieldValue: '', // 获取当前子组件input的输入的值
				// 父组件的参数，在computed计算中，无法得知this.parent发生变化，故将父组件的参数值，放到data中
				parentData: {
					borderBottom: true,
					labelWidth: 90,
					labelPosition: 'left',
					labelStyle: {},
					labelAlign: 'left',
					inputAlign: 'left',
				}
			};
		},
		watch: {
			validateState(val) {
				this.broadcastInputError();
			},
			// 监听u-form组件的errorType的变化
			"uForm.errorType"(val) {
				this.errorType = val;
				this.broadcastInputError();
			},
		},
		computed: {
			// 计算后的label宽度，由于需要多个判断，故放到computed中
			uLabelWidth() {
				// 如果用户设置label为空字符串(微信小程序空字符串最终会变成字符串的'true')，意味着要将label的位置宽度设置为auto
				return this.elLabelPosition == 'left' ? (this.label === 'true' || this.label === '' ? 'auto' : this.$u.addUnit(this
					.elLabelWidth)) : '100%';
			},
			showError() {
				return type => {
					// 如果errorType数组中含有none，或者toast提示类型
					if (this.errorType.indexOf('none') >= 0) return false;
					else if (this.errorType.indexOf(type) >= 0) return true;
					else return false;
				}
			},
			// label的宽度
			elLabelWidth() {
				// label默认宽度为90，优先使用本组件的值，如果没有(如果设置为0，也算是配置了值，依然起效)，则用u-form的值
				return (this.labelWidth != 0 || this.labelWidth != '') ? this.labelWidth : (this.parentData.labelWidth ? this.parentData
					.labelWidth :
					90);
			},
			// label的样式
			elLabelStyle() {
				return Object.keys(this.labelStyle).length ? this.labelStyle : (this.parentData.labelStyle ? this.parentData.labelStyle :
					{});
			},
			// label的位置，左侧或者上方
			elLabelPosition() {
				return this.labelPosition ? this.labelPosition : (this.parentData.labelPosition ? this.parentData.labelPosition :
					'left');
			},
			// label的对齐方式
			elLabelAlign() {
				return this.labelAlign ? this.labelAlign : (this.parentData.labelAlign ? this.parentData.labelAlign : 'left');
			},
			// label的下划线
			elBorderBottom() {
				// 子组件的borderBottom默认为空字符串，如果不等于空字符串，意味着子组件设置了值，优先使用子组件的值
				return this.borderBottom !== '' ? this.borderBottom : this.parentData.borderBottom ? this.parentData.borderBottom :
					true;
			},
			elInputAlign() {
				return this.inputAlign ? this.inputAlign : (this.parentData.inputAlign ? this.parentData.inputAlign : 'left');
			},
		},
		methods: {
			broadcastInputError() {
				// 子组件发出事件，第三个参数为true或者false，true代表有错误
				this.broadcast('u-input', 'onFormItemError', this.validateState === 'error' && this.showError('border'));
			},
			// 判断是否需要required校验
			setRules() {
				let that = this;
				// 由于人性化考虑，必填"*"号通过props的required配置，不再通过rules的规则自动生成
				// 从父组件u-form拿到当前u-form-item需要验证 的规则
				// let rules = this.getRules();
				// if (rules.length) {
				// 	this.isRequired = rules.some(rule => {
				// 		// 如果有必填项，就返回，没有的话，就是undefined
				// 		return rule.required;
				// 	});
				// }
				// #ifndef VUE3
				// blur事件
				this.$on('onFieldBlur', that.onFieldBlur);
				// change事件
				this.$on('onFieldChange', that.onFieldChange);
				// #endif
				// #ifdef VUE3

				// #endif
			},

			// 从u-form的rules属性中，取出当前u-form-item的校验规则
			getRules() {
				// 父组件的所有规则
				let rules = this.parent.rules;
				rules = rules ? rules[this.prop] : [];
				// 保证返回的是一个数组形式
				return [].concat(rules || []);
			},

			// blur事件时进行表单校验
			onFieldBlur() {
				this.validation('blur');
			},

			// change事件进行表单校验
			onFieldChange() {
				this.validation('change');
			},

			// 过滤出符合要求的rule规则
			getFilteredRule(triggerType = '') {
				let rules = this.getRules();
				// 整体验证表单时，triggerType为空字符串，此时返回所有规则进行验证
				if (!triggerType) return rules;
				// 历遍判断规则是否有对应的事件，比如blur，change触发等的事件
				// 使用indexOf判断，是因为某些时候设置的验证规则的trigger属性可能为多个，比如['blur','change']
				// 某些场景可能的判断规则，可能不存在trigger属性，故先判断是否存在此属性
				return rules.filter(res => res.trigger && res.trigger.indexOf(triggerType) !== -1);
			},

			getData(dataObj, name, defaultValue) {
				let newDataObj;
				if (dataObj) {
					newDataObj = JSON.parse(JSON.stringify(dataObj));
					let k = "",
						d = ".",
						l = "[",
						r = "]";
					name = name.replace(/\s+/g, k) + d;
					let tstr = k;
					for (let i = 0; i < name.length; i++) {
						let theChar = name.charAt(i);
						if (theChar != d && theChar != l && theChar != r) {
							tstr += theChar;
						} else if (newDataObj) {
							if (tstr != k) newDataObj = newDataObj[tstr];
							tstr = k;
						}
					}
				}
				if (typeof newDataObj === "undefined" && typeof defaultValue !== "undefined") newDataObj = defaultValue;
				return newDataObj;
			},

			setData(dataObj, name, value) {
				// 通过正则表达式  查找路径数据
				let dataValue;
				if (typeof value === "object") {
					dataValue = JSON.parse(JSON.stringify(value));
				} else {
					dataValue = value;
				}
				let regExp = new RegExp("([\\w$]+)|\\[(:\\d)\\]", "g");
				const patten = name.match(regExp);
				// 遍历路径  逐级查找  最后一级用于直接赋值
				for (let i = 0; i < patten.length - 1; i++) {
					let keyName = patten[i];
					if (typeof dataObj[keyName] !== "object") dataObj[keyName] = {};
					dataObj = dataObj[keyName];
				}
				// 最后一级
				dataObj[patten[patten.length - 1]] = dataValue;
			},

			// 校验数据
			validation(trigger, callback = () => {}) {
				// 检验之间，先获取需要校验的值
				//this.fieldValue = this.parent.model[this.prop];
				// 修改支持a.b
				this.fieldValue = this.getData(this.parent.model,this.prop);
				// blur和change是否有当前方式的校验规则
				let rules = this.getFilteredRule(trigger);
				// 判断是否有验证规则，如果没有规则，也调用回调方法，否则父组件u-form会因为
				// 对count变量的统计错误而无法进入上一层的回调
				if (!rules || rules.length === 0) {
					return callback('');
				}
				// 设置当前的装填，标识为校验中
				this.validateState = 'validating';
				// 调用async-validator的方法
				let validator = new schema({
					[this.prop]: rules
				});
				validator.validate({
					[this.prop]: this.fieldValue
				}, {
					firstFields: true
				}, (errors, fields) => {
					// 记录状态和报错信息
					this.validateState = !errors ? 'success' : 'error';
					this.validateMessage = errors ? errors[0].message : '';
					let field = errors ? errors[0].field : '';
					// 调用回调方法
					callback(this.validateMessage, {
						state: this.validateState,
						key: field,
						msg: this.validateMessage
					});
				});
			},

			// 清空当前的u-form-item
			resetField() {
				//this.parent.model[this.prop] = this.initialValue;
				this.setData(this.parent.model,this.prop,this.initialValue);
				// 设置为`success`状态，只是为了清空错误标记
				this.validateState = 'success';
			}
		},

		// 组件创建完成时，将当前实例保存到u-form中
		mounted() {
			// 支付宝、头条小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环应用
			this.parent = this.$u.$parent.call(this, 'u-form');
			if (this.parent) {
				// 历遍parentData中的属性，将parent中的同名属性赋值给parentData
				Object.keys(this.parentData).map(key => {
					this.parentData[key] = this.parent[key];
				});
				// 如果没有传入prop，或者uForm为空(如果u-form-input单独使用，就不会有uForm注入)，就不进行校验
				if (this.prop) {
					// 将本实例添加到父组件中
					this.parent.fields.push(this);
					this.errorType = this.parent.errorType;
					// 设置初始值
					this.initialValue = this.fieldValue;
					// 添加表单校验，这里必须要写在$nextTick中，因为u-form的rules是通过ref手动传入的
					// 不在$nextTick中的话，可能会造成执行此处代码时，父组件还没通过ref把规则给u-form，导致规则为空
					this.$nextTick(() => {
						this.setRules();
					})
				}
			}
		},
		// #ifndef VUE3
		// 组件销毁前，将实例从u-form的缓存中移除
		beforeDestroy() {
			// 如果当前没有prop的话表示当前不要进行删除（因为没有注入）
			if (this.parent && this.prop) {
				this.parent.fields.map((item, index) => {
					if (item === this) this.parent.fields.splice(index, 1);
				})
			}
		},
		// #endif

		// #ifdef VUE3
		beforeUnmount() {
			// 如果当前没有prop的话表示当前不要进行删除（因为没有注入）
			if (this.parent && this.prop) {
				this.parent.fields.map((item, index) => {
					if (item === this) this.parent.fields.splice(index, 1);
				})
			}
		},
		// #endif

	};
</script>

<style lang="scss" scoped>
	@import "../../libs/css/style.components.scss";

	.u-form-item {
		@include vue-flex;
		// align-items: flex-start;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: $u-main-color;
		box-sizing: border-box;
		line-height: $u-form-item-height;
		flex-direction: column;

		&__border-bottom--error:after {
			border-color: $u-type-error;
		}

		&__body {
			@include vue-flex;
		}

		&--left {
			@include vue-flex;
			align-items: center;

			&__content {
				position: relative;
				@include vue-flex;
				align-items: center;
				padding-right: 10rpx;
				flex: 1;

				&__icon {
					margin-right: 8rpx;
				}

				&--required {
					position: absolute;
					left: -16rpx;
					vertical-align: middle;
					color: $u-type-error;
					padding-top: 6rpx;
				}

				&__label {
					@include vue-flex;
					align-items: center;
					flex: 1;
				}
			}
		}

		&--right {
			flex: 1;

			&__content {
				@include vue-flex;
				align-items: center;
				flex: 1;

				&__slot {
					flex: 1;
					/* #ifndef MP */
					@include vue-flex;
					align-items: center;
					/* #endif */
				}

				&__icon {
					margin-left: 10rpx;
					color: $u-light-color;
					font-size: 30rpx;
				}
			}
		}

		&__message {
			font-size: 24rpx;
			line-height: 24rpx;
			color: $u-type-error;
			margin-top: 12rpx;
		}
	}
</style>

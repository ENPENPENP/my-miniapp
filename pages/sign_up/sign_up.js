var appInst = getApp();
import regExpUtils from '../../utils/regExpUtils.js'
import utils from '../../utils/util.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		bgHeight: appInst.globalData.bgHeight,
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		// 点击目标
		clickTarget: "",
		// 邮箱
		signEmail: null,
		signUserName: null,
		// 显示提示框
		showTip: false,
		// 隐藏提示框
		hideTip: false,
		// 提示框信息
		warnMsg: "",
		// 授权用户信息模态框
		getUserInfoDialog: false,
		canIUse: appInst.globalData.canIUse
	},

	/**
	 * 小程序声明周期方法
	 */

	onLoad: function (options) {},
	onReady: function () {},
	onShow: function () {},
	onHide: function () {},
	onUnload: function () {},
	onPullDownRefresh: function () {},
	onReachBottom: function () {},
	onShareAppMessage: function () {},

	/**
	 * 用户自定义方法
	 */

	showWarnTip: function (msg) {
		this.setData({
			showTip: true,
			warnMsg: msg
		});
		this.hideWarnTip(2500);
	},
	/**
	 * 隐藏提示框事件
	 * @param {事件参数} e 
	 */
	hideWarnTip: function (delayTime) {
		this.setData({
			hideTip: true
		});
		setTimeout(() => {
			this.setData({
				showTip: false,
				hideTip: false,
				warnMsg: null
			});
		}, delayTime);
	},
	/**
	 * 清除邮箱输入框的值
	 * @param {事件参数} e 
	 */
	clearEmail: function (e) {
		this.setData({
			signEmail: null
		})
	},
	/**
	 * 获取邮箱输入框的值
	 * @param {事件参数} e 
	 */
	getEmail: function (e) {
		var _originValue = e.detail.value;
		var _targetArray = [];
		// 使用正则表达式踢出不符合邮箱的字符
		for (let index = 0; index < _originValue.length; index++) {
			const char = _originValue[index];
			if (regExpUtils.checkEmailSingleChar(char)) {
				_targetArray.push(char);
			} else {
				if (!this.data.showWarnTip) {
					this.showWarnTip("只能输入英文/数字，'-'，'@'，'.'");
				}
			}
		}
		var _targetValue = _targetArray.join('');
		this.setData({
			signEmail: _targetValue
		})
	},
	/**
	 * 当输入框失去焦点出发的方法
	 * @param {事件参数} e 
	 */
	inputBlurEvent: function (e) {
		this.setData({
			clickTarget: ""
		})
	},
	/**
	 * 点击邮箱输入框
	 * @param {事件参数} e 
	 */
	clickEamilInput: function (e) {
		this.setData({
			clickTarget: "email"
		})
	},
	/**
	 * 点击用户名输入框
	 * @param {事件参数} e 
	 */
	clickUserNameInput: function (e) {
		this.setData({
			clickTarget: "username"
		})
	},
	/**
	 * 点击密码输入框
	 * @param {事件参数} e 
	 */
	clickPasswordInput: function (e) {
		this.setData({
			clickTarget: "password"
		})
	},
	/**
	 * 获取密码输入框的值
	 * @param {事件参数} e 
	 */
	getPassword: function (e) {
		var _pwd = e.detail.value;
		if(_pwd.length>18){
			_pwd = _pwd.substring(0,18);
		}
		this.setData({
			signPassword: _pwd
		})
	},
	/**
	 * 切换明文/非明文密码显示
	 * @param {事件参数} e 
	 */
	convertPassword: function (e) {
		this.setData({
			isShowPassword: !this.data.isShowPassword
		})
	},
	/**
	 * 获取用户名输入框的值
	 * @param {事件参数} e 
	 */
	getUserName: function (e) {
		this.setData({
			signUserName: e.detail.value
		})
	},
	/**
	 * 点击使用微信登录
	 * @param {事件参数} e 
	 */
	clickGetNickName: function (e) {
		this.setData({
			getUserInfoDialog: true
		})
	},
	/**
	 * 关闭模态框
	 */
	closeDialog: function (e) {
		this.setData({
			getUserInfoDialog: false
		})
	},
	/**
	 * 获取用户信息
	 * @param {时间参数} e 
	 */
	getUserInfo: function (e) {
		var that = this;
		wx.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
					wx.getUserInfo({
						success: function (res) {
							wx.setStorageSync('basicUserInfo', res.userInfo);
							that.setData({
								signUserName: res.userInfo.nickName
							})
							that.closeDialog();

						}
					})
				}
			}
		})
	},
	/**
	 * 点击邮箱注册按钮
	 * @param {事件参数} e 
	 */
	clickEmailSignUp: function (e) {
		var _userName = this.data.signUserName;
		var _signEmail = this.data.signEmail;
		var _signPassword = this.data.signPassword;
		if (!utils.stringNotNull(_userName) || !utils.stringNotNull(_signEmail) || !utils.stringNotNull(_signPassword)) {
			this.showWarnTip("请输入用户名，邮箱和密码");
		} else {
			if (!regExpUtils.checkEmail(_signEmail)) {
				this.showWarnTip("请按照正确的格式输入邮箱:xxx@xx.com");
			} else if (_signPassword.length < 6){
				this.showWarnTip("密码长度必须为6-18位字符");
			}else{
				console.log("正在注册");
			}
		}
	}
})
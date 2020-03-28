// pages/sign_in/sign_in.js
import regExpUtils from '../../utils/regExpUtils.js'
import networkUtils from '../../utils/networkUtils.js'
import utils from '../../utils/util.js'
var appInst = getApp();
Page({
	data: {
		// 背景高度
		bgHeight: appInst.globalData.bgHeight,
		// 导航栏字体大小
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		// 点击目标
		clickTarget: "",
		// 邮箱
		signEmail: null,
		// 密码
		signPassword: null,
		// 是否显示明文密码
		isShowPassword: false,
		// 显示提示框
		showTip: false,
		// 隐藏提示框
		hideTip: false,
		// 提示框信息
		warnMsg: "",
		// 授权用户信息模态框
		getUserInfoDialog: false,
		targetPage: null,
		canIUse: appInst.globalData.canIUse
	},

	onLoad: function (options) {
		this.setData({
			targetPage: options.targetPage
		})
	},
	onReady: function () {},
	onShow: function () {
		if (appInst.globalData.signIned) {
			wx.navigateBack({
				delta: 10
			})
		}
	},
	onHide: function () {},
	onUnload: function () {},

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
	 * 点击密码输入框
	 * @param {事件参数} e 
	 */
	clickPasswordInput: function (e) {
		this.setData({
			clickTarget: "password"
		})
	},
	/**
	 * 当输入框失去焦点出发的方法
	 * @param {事件参数} e 
	 */
	inputBlurEvent: function (e) {
		this.setData({
			clickTarget: null
		})
	},
	/**
	 * 跳转到注册页面
	 * @param {事件参数} e 
	 */
	toSignUp: function (e) {
		wx.navigateTo({
			url: '../sign_up/sign_up'
		});
	},
	/**
	 * 获取邮箱输入框的值
	 * @param {事件参数} e 
	 */
	getEmail: function (e) {
		var _originValue = e.detail.value;
		var _targetArray = [];
		// 使用正则表达式删除不符合邮箱命名规则的字符
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
	 * 获取密码输入框的值
	 * @param {事件参数} e 
	 */
	getPassword: function (e) {
		this.setData({
			signPassword: e.detail.value
		})
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
	 * 切换明文/非明文密码显示
	 * @param {事件参数} e 
	 */
	convertPassword: function (e) {
		this.setData({
			isShowPassword: !this.data.isShowPassword
		})
	},
	/**
	 * 显示提示框事件
	 * @param {事件参数} e 
	 */
	showWarnTip: function (msg) {
		if (this.data.showTip == true) {
			this.setData({
				warnMsg: msg
			});
		} else {
			this.setData({
				showTip: true,
				warnMsg: msg
			});
			this.hideWarnTip(2500);
		}
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
	 * 点击邮箱登录按钮
	 * @param {事件参数} e 
	 */
	clickEmailSignIn: function (e) {
		this.showWarnTip("很抱歉，目前只支持微信登录");
		// var _email = this.data.signEmail;
		// var _passord = this.data.signPassword;
		// if (!utils.stringNotNull(_email) || !utils.stringNotNull(_passord)) {
		// 	this.showWarnTip("请输入邮箱和密码");
		// } else {
		// 	if (!regExpUtils.checkEmail(_email)) {
		// 		this.showWarnTip("请按照正确的格式输入邮箱:xxx@xx.com");
		// 	} else {
		// 		// TODO 发送请求到服务器进行登录操作
		// 		console.log("正在登录")
		// 	}
		// }
	},
	/**
	 * 点击使用微信登录
	 * @param {事件参数} e 
	 */
	clickWeChatSignIn: function (e) {
		this.setData({
			getUserInfoDialog: true
		})
	},
	/**
	 * 点击拒绝授权按钮
	 * @param {时间参数} 
	 */
	rejectGrant: function (e) {
		this.closeDialog();
		this.clearBasicUserInfo();
	},
	/**
	 * 关闭模态框
	 */
	closeDialog: function () {
		this.setData({
			getUserInfoDialog: false
		})
	},
	/**
	 * 获取用户的基础信息
	 */
	getUserInfo: function () {
		var that = this;
		if (wx.getStorageSync('_basicUserInfo') == null || wx.getStorageSync('_basicUserInfo') == '' || appInst.globalData.signIned == false) {
			wx.getSetting({
				success: (res) => {
					if (res.authSetting['scope.userInfo']) {
						wx.getUserInfo({
							withCredentials: 'false',
							lang: 'zh_CN',
							timeout: 10000,
							success: (result) => {
								wx.setStorageSync('_basicUserInfo', result.userInfo);
							},
						});
					}
				}
			})
		}
	},
	/**
	 * 用户点击授权按钮
	 * @param {事件参数} e 
	 */
	allowGrant: function (e) {
		var that = this;
		this.getUserInfo();
		if (!appInst.globalData.signIned) {
			if (wx.getStorageSync('_basicUserInfo') == null || wx.getStorageSync('_basicUserInfo') == '' || appInst.globalData.signIned == false) {
				wx.getSetting({
					success: (res) => {
						if (res.authSetting['scope.userInfo']) {
							wx.getUserInfo({
								withCredentials: 'false',
								lang: 'zh_CN',
								timeout: 10000,
								success: (result) => {
									wx.setStorageSync('_basicUserInfo', result.userInfo);
									var basicUserInfo = result.userInfo;
									var _nickName = basicUserInfo.nickName;
									networkUtils.wxLogin().then(res => {
										var jscode = res.code;
										var _url = networkUtils.api_path + '/user/weChatSignIn';
										var _data = {
											"jscode": jscode,
											"nickName": _nickName
										}
										networkUtils.httpRequest(_url, _data, 'GET', 'json').then(res => {
											console.log(res.data)
											//获取用户信息成功
											if (res.data.status == 1) {
												var tokenInfo = {
													token: res.data.token,
													expireTime: res.data.expireTime
												}
												// 将数据存储在本地存储
												wx.setStorage({
													key: '_userInfo',
													data: res.data.userInfo,
													success: (result) => {},
													complete: () => {}
												});
												wx.setStorage({
													key: '_tokenInfo',
													data: tokenInfo,
													success: (result) => {},
													complete: () => {}
												});
												appInst.setSignInStatus();
												// 判断是否有需要跳转的页面
												var shareOptions = wx.getStorageSync('_shareOptions');
												// 有则跳转到对应页面
												if (shareOptions && shareOptions.query.targetUrl) {
													if (shareOptions.query.type == 'home') {
														wx.switchTab({
															url: '/pages/home/home',
														});
													} else if (shareOptions.query.type !=  'home') {
														wx.navigateTo({
															url: decodeURIComponent(shareOptions.query.targetUrl)
														})
													} else {
														wx.navigateBack({
															delta: 5
														})
													}
												}
												// 没有则直接返回首页
												else {
													setTimeout(() => {
														wx.navigateBack({
															delta: 1
														});
													}, 500);
												}
											} else {
												that.showWarnTip("登陆失败，服务器连接失败");
											}
										}).catch(err => {
											that.closeDialog();
											that.showWarnTip("登陆失败，服务器连接失败");
										})
									}).catch(err => {
										console.log(err);
									})
								},
								fail:function(e){
									this.showWarnTip('获取用户信息失败，请检查权限')
								}
							});
						}
					}
				})
			}

		}
	},
	/**
	 * 清除本地存储中的用户基本信息
	 */
	clearBasicUserInfo: function () {
		appInst.setSignOutStatus();
	}
})
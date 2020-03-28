//获取应用实例
const appInst = getApp()
Page({
	data: {
		StatusBar: appInst.globalData.StatusBar,
		CustomBar: appInst.globalData.CustomBar,
		basicUserInfo: wx.getStorageInfoSync('basicUserInfo'),
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		signIned: appInst.globalData.signIned,
		avatarUrl: null,
		nickName: null,
		modalName: null
	},
	/**
	 * 跳转到登陆页面
	 */
	toSignIn: function () {
		wx.navigateTo({
			url: '../sign_in/sign_in'
		})
	},
	onLoad: function () {
		appInst.checkToken();
	},
	onShow: function () {
		let basicUserInfo = wx.getStorageSync('_basicUserInfo');
		if (basicUserInfo != null) {
			this.setData({
				signIned: appInst.globalData.signIned,
				avatarUrl: basicUserInfo.avatarUrl,
				nickName: basicUserInfo.nickName
			})
		}

	},
	hideModal: function (e) {
		this.setData({
			modalName: ""
		})
	},
	clickSignOut: function (e) {
		this.setData({
			modalName: "signOutModal"
		})
	},
	confirmSignOut: function (e) {
		appInst.setSignOutStatus();
		this.hideModal();
		setTimeout(() => {
			this.setData({
				signIned: false,
				avatarUrl: null,
				nickName: null
			})
		}, 500)
	},
	toAbout:function(e){
		wx.navigateTo({
			url:'/pages/about/about'
		})
	},toUsage:function(e){
		wx.navigateTo({
			url:'/pages/usage/usage'
		})
	}
})
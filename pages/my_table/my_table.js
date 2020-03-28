// pages/my_table/my_table.js
var appInst = getApp();
import networkUtils from '../../utils/networkUtils.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		bgHeight: appInst.globalData.bgHeight,
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		myEventList: null,
		linkedEventList: null,
		userId: null,
		deleteTargetEventId: null,
		deleteTargetFileName: null,
		modalName: "",
		CustomBar: appInst.globalData.CustomBar,
		triggered: false,
		dataRefreshed: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		appInst.checkToken();
	},
	onReady: function () {},
	onShow: function () {
		var _userInfo = wx.getStorageSync('_userInfo');
		if (_userInfo != null) {
			this.setData({
				userId: _userInfo.userId
			})
			this.onRefreshing();
		}
	},
	onHide: function () {},
	onUnload: function () {},
	onPullDownRefresh: function () {},
	onReachBottom: function () {},
	onShareAppMessage: function () {},

	/**
	 * 显示指定的模态框
	 * @param {目标模态框名称} _modalName 
	 */
	showModal: function (_modalName) {
		this.setData({
			modalName: _modalName
		})
	},
	/**
	 * 隐藏所有模态框
	 */
	hideModal: function () {
		this.setData({
			modalName: ""
		})
	},
	/**
	 * 点击删除按钮
	 * @param {事件参数} e 
	 */
	clickDelete: function (e) {
		var targetEventId = e.currentTarget.id;
		var _myEventList = this.data.myEventList;
		for (let index = 0; index < _myEventList.length; index++) {
			if (_myEventList[index].eventId == targetEventId) {
				var _fileName = _myEventList[index].fileInfo.fileName;
				this.setData({
					deleteTargetFileName: _fileName,
					deleteTargetEventId: targetEventId
				})
				this.showModal("deleteModal");
				break;
			}
		}
	},
	/**
	 * 确定删除
	 * @param {时间参数} e 
	 */
	comfirmDelete: function (e) {
		var url = networkUtils.api_path + '/event/delete/' + this.data.deleteTargetEventId;
		networkUtils.httpRequest(url, null, 'GET').then(res => {
			if (res.data.status == 1) {
				this.getData();
			} else {
				console.log(res.data.errMsg);
			}
			this.hideModal();
		}).catch(err => {
			console.log(err);
		})
	},
	toNewTable: function (e) {
		wx.navigateTo({
			url: '../new_table/new_table',
		});
	},
	onPulling: function (e) {
		// console.log('pulling' + e);
	},
	onRefreshing() {
		if (this._freshing) return;
		this._freshing = true;
		this.getData(() => {
			this.setData({
				dataRefreshed: true
			})
		});
		setTimeout(() => {
			if (this.data.dataRefreshed) {
				this.setData({
					triggered: false,
					dataRefreshed: false
				})
				this._freshing = false;
			}
		}, 1500);
	},
	onRestore: function (e) {
		// console.log('onRestore:', e)
	},
	onAbort: function (e) {
		this.setData({
			triggered: false
		})
	},
	getData: function (callBack) {
		var _url = networkUtils.api_path + '/user_event/getEvent/' + this.data.userId;
		networkUtils.httpRequest(_url, null).then(res => {
			if (res.data.status == 1) {
				var _linkedEventList = res.data.linkedEventList;
				var _myEventList = new Array();
				for (let i = 0; i < _linkedEventList.length; i++) {
					const element = _linkedEventList[i];
					if (element.userId == this.data.userId) {
						_myEventList.push(element);
					}
				}
				this.setData({
					linkedEventList: res.data.linkedEventList,
					myEventList: _myEventList
				});
				if (typeof callBack == 'function' && callBack != null) {
					callBack();
				}
			} else {
				console.log(res.data.errMsg);
			}
		}).catch(err => {
			console.log(err);
		})
	},
	toCheckPage: function (e) {
		wx.navigateTo({
			url: '/pages/check_table/check_table?eventId=' + e.currentTarget.id + '&type=normal'
		})
	}
})
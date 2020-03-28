// pages/about/about.js
Page({
	data: {

	},
	copyColorUi: function (e) {
		wx.setClipboardData({
			data: 'https://github.com/weilanwl/ColorUI',
			success: (result) => {},
			fail: () => {},
			complete: () => {}
		});
	},
	copyWeUi: function (e) {
		wx.setClipboardData({
			data: 'https://github.com/Tencent/weui',
			success: (result) => {},
			fail: () => {},
			complete: () => {}
		});
	}
})
//app.js
import networkUtils from './utils/networkUtils.js'
App({
  onLaunch: function (options) {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;

        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.capsuleHeight = capsule.bottom - capsule.top;
          this.globalData.navigateBarTitleFontSize = Math.round((capsule.bottom - capsule.top) * 0.6);
          this.globalData.CustomBar = capsule.bottom + Math.round(e.statusBarHeight * 0.2);
        } else {
          this.globalData.CustomBar = Math.round(e.statusBarHeight * 1.2);
        }
        this.globalData.tarBarHeight = e.screenHeight - e.windowHeight;
        this.globalData.bgHeight = e.screenHeight - this.globalData.CustomBar;
      }
    })
    this.globalData.signIned = wx.getStorageSync('_userInfo') != null && (typeof wx.getStorageSync('_userInfo') != 'string') ? true : false;
    this.checkToken();
  },
  onShow: function (options) {
    // 点击微信群分享的带shareTicket进入小程序的
    if (options.scene == 1044 || options.scene == 1007 || options.scene == 1008) {
      var targetUrl = decodeURIComponent(options.query.targetUrl);
      if (options.query.type != 'home') {
        wx.setStorage({
          key: '_shareOptions',
          data: options,
          success: (result) => {},
          complete: () => {}
        });
        // 没有登陆的跳转到登录页面
        if (this.globalData.signIned == false) {
          wx.navigateTo({
            url: '/pages/sign_in/sign_in'
          })
          // 已经登录的直接跳转到目标页面
        } else {
          wx.navigateTo({
            url: targetUrl
          })
        }
      }else if(options.query.type == 'home'){
        wx.switchTab({
          url: '/pages/home/home',
        });
      }
    }
  },
  globalData: {
    // 除导航栏外的屏幕高度，用于设置背景
    bgHeight: null,
    userInfo: null,
    StatusBar: null,
    CustomBar: null,
    Custom: null,
    capsuleHeight: null,
    navigateBarTitleFontSize: null,
    tarBarHeight: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    signIned: null,
  },
  setSignInStatus: function () {
    this.globalData.signIned = true;
  },
  setSignOutStatus: function () {
    this.globalData.signIned = false;
    wx.removeStorage({
      key: '_basicUserInfo',
    })
    wx.removeStorage({
      key: '_userInfo',
    });
    wx.removeStorage({
      key: '_tokenInfo',
    })

  },
  checkToken: function () {
    if (!this.globalData.signIned) {
      var _tokenInfo = wx.getStorageSync('_tokenInfo');
      var _userInfo = wx.getStorageSync('_userInfo');
      var now = new Date();
      var expireTime = new Date(_tokenInfo.expireTime);
      if (now.getTime() - expireTime.getTime() > 0) {
        networkUtils.wxLogin().then(res => {
          var jscode = res.code;
          var _url = networkUtils.api_path + '/token/update/' + _userInfo.userId + '?jscode=' + jscode;
          networkUtils.httpRequest(_url, null).then(res => {
            if (res.data.status == 1) {
              wx.setStorageSync('_tokenInfo', {
                token: res.data.token,
                expireTime: res.data.expireTime
              });
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
})
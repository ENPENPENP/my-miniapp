const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    targetPage: {
      type: String,
      default: null
    },
    lastPage: {
      type: String,
      default: null
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    navigateBarTitleFontSize: app.globalData.navigateBarTitleFontSize,
    signIned: wx.getStorageSync('_usesrInfo') == null ? false : true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      if (this.data.signIned && (this.data.lastPage == "/pages/sign_in/sign_in")) {
        wx.navigateBack({
          delta: 10
        })
      }
      if (this.data.signIned && this.data.lastPage != "/pages/sign_in/sign_in") {
        wx.navigateBack({
          delta: 1
        })
      }
      if (!this.data.signIned) {
        wx.navigateBack({
          delta: 1
        })
      }
    },
    toHome() {
      wx.navigateBack({
        delta: 10
      })
    }
  }
})
// pages/home/home.js
var appInst = getApp();
Page({
    data: {
        bgHeight: appInst.globalData.bgHeight,
        navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
        tarBarHeight: appInst.globalData.tarBarHeight,
        CustomBar: appInst.globalData.CustomBar,
        signIned: appInst.globalData.signIned,
        modalName: "",
        triggered: false,
        dataRefreshed: false
    },
    onLoad: function (options) {
        // wx.showShareMenu({
        //     withShareTicket: true,
        // })
        this.setData({
            signIned: appInst.globalData.signIned,
            modalName: ""
        });
    },
    onReady: function () {},
    onShow: function (options) {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {
        return {
            title: '易xcel',
            path: '/pages/home/home?type=home',
            success: function (res) {
                console.log('share success')
            },
            fail: function (res) {
                console.log(res)
            }
        }
    },
    /**
     * 如果已经登陆，跳转到新建表格页面，否则跳转到登陆页面
     * @param {事件参数} e 
     */
    toNewTable: function (e) {
        var curPages = getCurrentPages();
        var curPageRoute = curPages[curPages.length - 1].route;
        wx.navigateTo({
            url: appInst.globalData.signIned ? '../new_table/new_table' : ('../sign_in/sign_in?targetPage=' + '../new_table/new_table' + '?lastPage=' + curPageRoute),
        })
    },
    toMyTable: function (e) {
        var curPages = getCurrentPages();
        var curPageRoute = curPages[curPages.length - 1].route;
        wx.navigateTo({
            url: appInst.globalData.signIned ? '../my_table/my_table' : ('../sign_in/sign_in?targetPage=' + '../my_table/my_table' + '?lastPage=' + curPageRoute),
        })
    },
    showGroupModal: function (e) {
        this.setData({
            modalName: "groupModal"
        })
    },
    hideModal: function (e) {
        this.setData({
            modalName: ""
        })
    },
    click: function (e) {
        console.log(e)
    },
    onPulling: function (e) {
        // console.log('pulling' + e);
    },
    onRefresh: function () {
        console.log('onFresh')
        if (this._freshing) return;
        this._freshing = true;
        setTimeout(() => {
            this.setData({
                triggered: false,
            })
            this._freshing = false;
        }, 2000);
    },
    onRestore: function (e) {},
    onAbort: function (e) {
        this.setData({
            triggered: false
        })
    },
})
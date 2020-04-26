//index.js
//获取应用实例
const app = getApp()

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    region: ['全部', '全部', '全部'],
    customItem: '全部',
    key: '',
    keyShowed: false,
    searchResult: []
  },
  //事件处理函数
  bindViewTap: function(event) {
    wx.navigateTo({
      url: '../article/article?shopid=' + event.currentTarget.dataset.shopid
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  search: function() {
    var that = this
    wx.request({
      url: app.globalData.baseWebApiUrl + '/api/search',
      data: {
        key: that.data.key,
        region: that.data.region.join(',')
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          searchResult: res.data
        })
        console.info(res)
      },
      fail: function(res) {
        console.error(res)
      }
    })
    // 隐藏相关搜索
    this.setData({
      key: that.data.key,
      keyShowed: false
    });
  },
  // 输入框相关
  showInput: function() {
    this.setData({
      keyShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      key: "",
      keyShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      key: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      key: e.detail.value
    });
  }
})
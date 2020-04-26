const app = getApp()

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    shopid: "",
    swiperList: [],
    shop: {},
    gallery: false,
    currentPic: 0,
  },
  onLoad: function(options) {
    console.log(options.shopid)
    this.data.shopid = options.shopid
    this.getPics()
    // this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
    this.getShop()
  },
  getPics: function() {
    var that = this
    wx.request({
      url: app.globalData.baseWebApiUrl + '/api/getPics',
      data: {
        shopId: this.data.shopid,
        type: "title"
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          swiperList: res.data
        })
        console.info(res)
      },
      fail: function(res) {
        console.error(res)
      }
    })
  },
  getShop: function() {
    var that = this
    wx.request({
      url: app.globalData.baseWebApiUrl + '/api/getShop/' + that.data.shopid,
      success: function(res) {
        that.setData({
          shop: res.data
        })
        console.info(res)
      },
      fail: function(res) {
        console.error(res)
      }
    })
  },
  close: function() {
    this.setData({
      gallery: false,
    });
  },
  open: function(event) {
    var currentPic = event.currentTarget.dataset.bindex
    this.setData({
      gallery: true,
      currentPic: this.data.swiperList[currentPic].pic
    });
  }
});
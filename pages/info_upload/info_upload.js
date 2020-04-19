// pages/uploadImgFile/upload/upload.js
var app = getApp()
var competitionId
var competition
var imgCount = 0
//图片上传
var imgUpload = function(images, competitionId, i) {
  if (i != images.length) {
    wx.uploadFile({
      url: app.globalData.baseWebApiUrl + 'fileUpload/competitionImgUpload',
      filePath: images[i],
      name: 'uploadfile_img',
      formData: {
        'imgIndex': i,
        competitionId: competitionId
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function(res) {
        var resJson = JSON.parse(res.data)
        if (resJson.bl) {
          // wx.showToast({
          //   title: '第' + (i+1) + '张上传成功',
          //   icon: 'none'
          // })
          console.info('第' + (i + 1) + '张上传成功')

          i++
          imgUpload(images, competitionId, i)

        } else {
          wx.showToast({
            title: '第' + (i + 1) + '张上传失败',
            icon: 'none'
          })
          return
        }

      }
    })

  } else {
    wx.showToast({
      title: '图片全部上传完成',
      icon: 'none'
    })
    wx.hideLoading()
    wx.navigateBack({

    })
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    competitionId = options.competitionId;
    //已上传图片回显
    wx.request({
      url: app.globalData.baseWebApiUrl + 'competition/getCompetitionById',
      data: {
        competitionId: competitionId
      },
      method: 'GET',
      success: function(res) {
        competition = res.data
        console.info(competition)
        var imges = []
        console.info(competition.image3)
        if (competition.image1 != null && competition.image1 != undefined && competition.image1 != '') {
          imges.push(app.globalData.baseWebApiUrl + 'fileUpload/downloadImg?filePath=' + competition.image1)
          imgCount++

        }
        if (competition.image2 != null && competition.image2 != undefined && competition.image2 != '') {
          imges.push(app.globalData.baseWebApiUrl + 'fileUpload/downloadImg?filePath=' + competition.image2)
          imgCount++
        }
        if (competition.image3 != null && competition.image3 != undefined && competition.image3 != '') {
          imges.push(app.globalData.baseWebApiUrl + 'fileUpload/downloadImg?filePath=' + competition.image3)
          imgCount++
        }
        console.info(imges)
        that.setData({
          images: imges
        })
        that.setData({
          images: that.data.images
        })
        console.info(that.data)
      }

    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '海大高尔夫',
      desc: '点击进入小程序',
      path: '/pages/index/index'
    }
  },
  chooseImage(e) {
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 3 ? images : images.slice(0, 3)
        that.setData({
          images: this.data.images
        })
      }
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    this.setData({
      images: this.data.images
    })
    imgCount--
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },
  //上传图片
  submitForm(e) {
    var that = this
    if (imgCount > 0) {
      wx.showToast('请删除重新选择', 1000)
      return
    }
    var images = this.data.images
    if (images.length == 0) {
      wx.showToast('没有选择图片', 1000)
      return
    }
    wx.showLoading({
      title: '上传中',
      task: true
    })
    // 比赛图片上传
    imgUpload(images, competitionId, 0)

  },
  //删除比赛图片
  deleteCompetitionImg: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '此操作将删除该比赛位于服务器上的所有比赛图片,确定进行此操作吗?',
      success: function() {
        wx.request({
          url: app.globalData.baseWebApiUrl + 'competition/deleteCompetitionImg',
          method: 'GET',
          data: {
            competitionId: competitionId
          },
          success: function(res) {
            if (res.data.bl) {
              wx.showToastSuccess('已清空服务器图片')
              that.setData({
                images: []
              })
              imgCount = 0
            } else {

            }
          }
        })
      }
    })

  }

})
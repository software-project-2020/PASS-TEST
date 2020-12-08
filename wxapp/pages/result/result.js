// pages/result/result.js
var util = require('../../utils/util')
Page({

  // /**
  //  * 页面的初始数据
  //  */
  // data: {
  //   toView: 'green'
  // },

  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  // onLoad: function (options) {

  // },

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },

  // upper(e) {
  //   console.log(e)
  // },

  // lower(e) {
  //   console.log(e)
  // },

  // scroll(e) {
  //   console.log(e)
  // },

  // scrollToTop() {
  //   this.setAction({
  //     scrollTop: 0
  //   })
  // },

  // tap() {
  //   for (let i = 0; i < order.length; ++i) {
  //     if (order[i] === this.data.toView) {
  //       this.setData({
  //         toView: order[i + 1],
  //         scrollTop: (i + 1) * 200
  //       })
  //       break
  //     }
  //   }
  // },

  // tapMove() {
  //   this.setData({
  //     scrollTop: this.data.scrollTop + 10
  //   })
  // },
  // return: function (e) {
  //   wx.navigateTo({
  //     url: '../../pages/start/start'
  //   })
  // }

  data: {
    arr: [],
    triggered: false,
  },
  onReady: function () {
    const arr = []
    for (let i = 0; i < 100; i++) 
      arr.push(i)
    this.setData({
      arr : arr
    })

    console.log("arr : "+arr)

    setTimeout(() => {
      this.setData({
        triggered: true,
      })
    }, 1000)
  },

  // onPulling(e) {
  //   console.log('onPulling:', e)
  // },

  // onRefresh() {
  //   if (this._freshing) return
  //   this._freshing = true
  //   setTimeout(() => {
  //     this.setData({
  //       triggered: false,
  //     })
  //     this._freshing = false
  //   }, 3000)
  // },

  // onRestore(e) {
  //   console.log('onRestore:', e)
  // },

  // onAbort(e) {
  //   console.log('onAbort', e)
  // },
})
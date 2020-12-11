// pages/SelfCenter/suggestion/suggestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      uploaderList: [],
      uploaderNum:0,
      showUpload:true,
      // show:false,//控制下拉列表的显示隐藏，false隐藏、true显示
      // selectData:['时间问题','题目问题','其他问题'],//下拉列表的数据
      // index:0,//选择的下拉列表下标
      imagelist:[],
      feedback_type:null,
      contact_info:null,
      feedback_content:null,
      //
      selectList: [{"text": "时间问题"}, {"text": "难度问题"}, {"text": "其他问题"}],
      select: false,
      select_value1: {
        "text": "未选择"
      }
  },
  bindblur:function(e){
    var value=e.detail.value;
     this.setData({
      contact_info:value
    })
    console.log(this.data.contact_info)
  },

  bindblur1: function (e) {
    this.setData({
      feedback_content: e.detail.value
    })
    console.log(this.data.feedback_content)
  },
  //index.js
    // 删除图片
    clearImg:function(e){
        var nowList = [];//新数据
        var uploaderList = this.data.uploaderList;//原数据
        
        for (let i = 0; i < uploaderList.length;i++){
            if (i == e.currentTarget.dataset.index){
                continue;
            }else{
                nowList.push(uploaderList[i])
            }
        }
        this.setData({
            uploaderNum: this.data.uploaderNum - 1,
            uploaderList: nowList,
            showUpload: true
        })
    },
    //展示图片
    showImg:function(e){
        var that=this;
        wx.previewImage({
            urls: that.data.uploaderList,
            current: that.data.uploaderList[e.currentTarget.dataset.index]
        })
    },
    //上传图片
    upload: function(e) {
      var imagelist = this.data.imagelist
        var that = this;
        wx.chooseImage({
            count: 9 - that.data.uploaderNum, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                console.log(res)
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                let uploaderList = that.data.uploaderList.concat(tempFilePaths);
                if (uploaderList.length==9){
                    that.setData({
                        showUpload:false
                    })
                }
                that.setData({
                    uploaderList: uploaderList,
                    uploaderNum: uploaderList.length,
                })
                for(var i=0;i<uploaderList.length;i++){
                  wx.getFileSystemManager().readFile({
                  filePath: res.tempFilePaths[i], //选择图片返回的相对路径
                  encoding: 'base64', //编码格式
                  success: res => { //成功的回调
                    // console.log('data:image/png;base64,' + res.data)
                    imagelist.push(res.data)
                  }
                })
                }
                console.log(that.data.imagelist)
            }
        })
    },
   // 点击下拉显示框
//  selectTap(){
//   this.setData({
//    show: !this.data.show
//   });
//   },
//   // 点击下拉列表
//   optionTap(e){
//     var selectData = this.data.selectData
//   let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
//   this.setData({
//    index:Index,
//    show:!this.data.show,
//    feedback_type:selectData[e.currentTarget.dataset.index]
//   });
//   console.log(this.data.feedback_type)
//   },

m_select_touch(e) {
  let that = this;
  let selectIndex = e.detail.selIndex;
    let value1 = that.data.selectList[selectIndex];
    that.setData({
      select_value1: value1,
      feedback_type:value1.text
    })
    // console.log(this.data.feedback_type)
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
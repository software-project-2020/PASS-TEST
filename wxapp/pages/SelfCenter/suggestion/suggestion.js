// pages/SelfCenter/suggestion/suggestion.js
var userutil = require('../../../utils/userutil.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
      uploaderList: [],
      uploaderNum:0,
      showUpload:true,
      imagelist:[],
      feedback_type:null,
      contact_info:null,
      feedback_content:null,
      selectList: [{"text": "时间问题"}, {"text": "难度问题"}, {"text": "其他问题"}],
      select: false,
      select_value1: {
        "text": "未选择"
      }
  },
  bindblur:function(e){
    var value=e.detail.value;
     this.setData({
       feedback_content: value
    })
    // console.log(this.data.feedback_content)
  },

  bindblur1: function (e) {
    var value=e.detail.value;
    this.setData({
      contact_info:value
    })
    // console.log(value)
    // console.log(this.data.contact_info)
  },
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
                    // imagelist.push('data:image/png;base64,' +res.data)
                    imagelist.push(res.data)
                  }
                })
                }
                // console.log(that.data.imagelist)
            }
        })
    },

    submit(){
      var that = this
      setTimeout(function(){
      if(that.data.feedback_type==null||that.data.feedback_content==null){
        wx.showModal({
          title: '抱歉',
          content: '问题类型和反馈内容不能为空!',
          confirmText: '返回',
          showCancel:false,
          success: function (res) {
          }
        })
      }
      else{
        var feedbackdata={
        openid:getApp().globalData.userInfo.openid,
        feedback_type:that.data.feedback_type,
        feedback_content:that.data.feedback_content,
        imagelist:JSON.stringify(that.data.imagelist),
        contact_info:that.data.contact_info,
      }
      console.log(JSON.stringify(feedbackdata))
      userutil.feedbackInfo(feedbackdata)
      wx.showModal({
        title: '提交成功',
        content: '感谢您的配合!',
        confirmText: '返回',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
            })
          }
        }
      })
      }
      },500)
      
    },

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
onLoad: function () {
},

})
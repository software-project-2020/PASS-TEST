module.exports = {
  getRanklists: getRanklists
}
// 获得排行榜数据
function getRanklists(openid, age, type, page_num, list_num, callback) {
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.zghy.xyz/api/test/ranklist',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      openid: openid,
      age: age,
      type: type,
      page_num: page_num,
      list_num: list_num
    },
    success: function (res) {
      // console.log(res.data)
      callback && callback(JSON.parse(res.data))
    }
  })
}
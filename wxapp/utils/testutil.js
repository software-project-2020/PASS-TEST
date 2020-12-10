module.exports = {
  getQuestions: getQuestions,
  getconfiguration: getconfiguration,
  getS12: getS12
}
// 获得题目数据
function getQuestions(testId, category, num, callback) {
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.zghy.xyz/api/test/detail',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      test_id: testId,
      category: category,
      num: num
    },
    success: function (res) {
      // console.log(res.data)
      callback && callback(JSON.parse(res.data))
    }
  })
}
// 获得题目相关参数
function getconfiguration(age_group, test_id, callback) {
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.zghy.xyz/api/test/configuration',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      age_group: age_group,
      test_id: test_id,
    },
    success: function (res) {
      callback && callback(JSON.parse(res.data).data);
    }
  })
}

//获得S12题目
function getS12(ageGroup, callback) {
  var qnumlist = []
  getconfiguration(ageGroup, 'S12', (res) => {
    console.log(res)
    for (var i = 0; i < res.length; i++) {
      var temp = JSON.parse(res[i].parameter_info)
      console.log(temp)
      qnumlist[i] = temp.num
    }
    var allnum = 0
    var alllist = []
    var qnum, qlist
    getQuestions('S12', 0, qnumlist[0], (res) => {
      qnum = res.data.length
      qlist = res.data
      alllist = alllist.concat(qlist)
      allnum = allnum + qnum
      getQuestions('S12', 1, qnumlist[1], (res) => {
        qnum = res.data.length
        qlist = res.data
        alllist = alllist.concat(qlist)
        allnum = allnum + qnum
        getQuestions('S12', 2, qnumlist[2], (res) => {
          qnum = res.data.length
          qlist = res.data
          alllist = alllist.concat(qlist)
          allnum = allnum + qnum
          getQuestions('S12', 3, qnumlist[3], (res) => {
            qnum = res.data.length
            qlist = res.data
            alllist = alllist.concat(qlist)
            allnum = allnum + qnum
            getQuestions('S12', 4, qnumlist[4], (res) => {
              qnum = res.data.length
              qlist = res.data
              alllist = alllist.concat(qlist)
              allnum = allnum + qnum
              for (var j = 0; j < allnum; j++) {
                alllist[j] = JSON.parse(alllist[j])
              }
              var res = {
                'qnum': allnum,
                'qlist': alllist
              }
              callback && callback(res)
            })
          })
        })
      })
    })
  })


}
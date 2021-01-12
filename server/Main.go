package main

import (
	"./driver"
	"./models"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
)

var Db *sql.DB

func init() {
	Db = driver.ConnectSQL()
}

func checkErr(err error) {
	if err != nil {
		fmt.Println(err)
		log.Fatalln(err)
	}
}

func recoverErr() {
	if err := recover(); err != nil {
		log.Println(err)
		fmt.Println("程序捕获，继续执行")
	}
}

//func checkEmpty(value string, name string,errorCode int,ctx *gin.Context) {
//	if value == "" {
//		ctx.JSON()
//		//panic(name + "字段为空")
//	}
//}

func main() {
	f, _ := os.OpenFile("gin.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	defer f.Close()
	gin.DefaultWriter = io.MultiWriter(f)
	r := gin.Default()
	// 获取用户信息
	//post = {
	//	  "userid": 7
	//}
	//r.POST("/api/user/getbyid", getUserById)
	// 用户注册  注册时间和上次登录时间直接用time.Now()
	//post = {
	//    "openid": "",
	//    "session_key": "",
	//    "age": ,
	//    "gender": ,
	//    "nickname": "用户名",
	//    "birthday": "2020-01-01",
	//}
	//r.POST("/api/user/register", registerUser)
	// 获取题目单个题目的信息
	//post = {
	//    "test_id": "S11",
	//    "age_group": 0
	//}
	r.POST("/api/test/configuration", getConfiguration)

	r.POST("/api/test/detail", getDetail)

	r.POST("/api/user/login", userLogin)

	r.POST("/api/user/info", userInfo)

	r.POST("/api/user/feedback", userFeedback)

	r.POST("/api/test/submit", userSubmit)

	r.POST("/api/test/getresult", getResult)

	r.POST("/api/test/gethistory", getHistory)

	r.POST("/api/test/ranklist", rankList)

	r.POST("/api/test/lasttest", lastTest)

	r.GET("/api/root/datastastics", getDataStastics)

	r.POST("/api/root/questionbank", questionBank)

	r.GET("/api/root/feedback",setFeedback)

	r.Run(":23333")
}

func getUserById(c *gin.Context) {
	defer recoverErr()
	user := models.User{}
	id := c.PostForm("userid")
	sqlForRun := "select * from user where id = ?;"
	stmt, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt.Close()
	row := stmt.QueryRow(id)
	var registerTime string
	var lastLoginTime string
	var birthday string
	err = row.Scan(&user.Id, &user.Openid, &user.SessionKey, &user.Age, &user.Gender, &registerTime,
		&lastLoginTime, &user.NickName, &birthday)
	if err == sql.ErrNoRows {
		panic("不存在这个用户")
	}
	user.RegisterTime, _ = time.Parse("2006-01-02 15:04:05", registerTime)
	user.LastLoginTime, _ = time.Parse("2006-01-02 15:04:05", lastLoginTime)
	user.Birthday, _ = time.Parse("2006-01-02", birthday)
	c.JSON(200, gin.H{
		"id":            user.Id,
		"openid":        user.Openid,
		"session_key":   user.SessionKey,
		"age":           user.Age,
		"gender":        user.Gender,
		"register_time": user.RegisterTime,
		"lastLoginTime": user.LastLoginTime,
		"nickname":      user.NickName,
		"birthday":      user.Birthday,
	})
}

func registerUser(c *gin.Context) {
	sql := "insert into user(openid,session_key,age,gender,register_time,last_login_time,nickname,birthday)" +
		" values(?,?,?,?,?,?,?,?)"
	openid := c.PostForm("openid")
	//checkEmpty(openid, "open_id",10001)
	res, err := Db.Exec(sql, openid, c.PostForm("session_key"), c.PostForm("age"),
		c.PostForm("gender"), time.Now(), time.Now(), c.PostForm("nickname"), c.PostForm("birthday"))
	checkErr(err)
	fmt.Println(res.LastInsertId())
}

func getConfiguration(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	testId := c.PostForm("test_id")
	if testId == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("test_id" + "字段为空")
	}
	//checkEmpty(testId, "test_id",10001,c)
	ageGroup := c.PostForm("age_group")
	if ageGroup == "" {
		result["error_code"] = 10002
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("age_group" + "字段为空")

	}
	//checkEmpty(ageGroup, "age_group",10002,c)
	sql := "select * from parameter_configuration where test_id = ? and age_group = ?"
	stmt, err := Db.Prepare(sql)
	checkErr(err)
	defer stmt.Close()
	row, err := stmt.Query(testId, ageGroup)
	var list []map[string]interface{}
	for row.Next() {
		config := new(models.Configuration)
		resultData := make(map[string]interface{})
		err = row.Scan(&config.TestId, &config.Difficulty, &config.AgeGroup, &config.ParameterInfo)
		resultData["difficulty"] = config.Difficulty
		resultData["parameter_info"] = config.ParameterInfo
		list = append(list, resultData)
	}
	result["error_code"] = 0
	result["data"] = list
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))
}

func getDetail(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	testId := c.PostForm("test_id")
	if testId == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("test_id" + "字段为空")
	}
	category := c.PostForm("category")
	if category == "" {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("category" + "字段为空")

	}
	num := c.PostForm("num")
	if num == "" {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("num" + "字段为空")

	}
	sql := "select * from test_detail where test_id = ? and category = ?"
	stmt, err := Db.Prepare(sql)
	checkErr(err)
	defer stmt.Close()
	row, err := stmt.Query(testId, category)
	var list []string
	var details models.Details
	for row.Next() {
		detail := new(models.Detail)
		err = row.Scan(&detail.TestId, &detail.Category, &detail.Details)
		details.Details = append(details.Details, *detail)
	}
	for i := len(details.Details) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		details.Details[i], details.Details[j] = details.Details[j], details.Details[i]
	}
	numint, err := strconv.Atoi(num)
	checkErr(err)
	if len(details.Details) < numint {
		result["error_code"] = 10004
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	}
	for i := 0; i < numint; i++ {
		list = append(list, details.Details[i].Details)
	}
	result["data"] = list
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))
}

func userLogin(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	appid := "wxbe7e6a8c236b2b8c"
	appSecret := "881be456b991f2037fea8217908d6c9d"
	code := c.PostForm("code")
	if code == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("code" + "字段为空")
	}
	nickname := c.PostForm("nickname")
	if nickname == "" {
		result["error_code"] = 10002
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("nickname" + "字段为空")
	}
	gender := c.PostForm("gender")
	if gender == "" {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("gender" + "字段为空")
	}
	url := "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + appSecret +
		"&js_code=" + code + "&grant_type=authorization_code"
	resp, err := http.Get(url)
	checkErr(err)
	body, err := ioutil.ReadAll(resp.Body)
	checkErr(err)
	//fmt.Println(string(body))
	if strings.Contains(string(body), "openid") {
		user := models.User{}
		requestBody := make(map[string]interface{})
		err = json.Unmarshal(body, &requestBody)
		checkErr(err)
		sqlForRun := "select * from user where openid = ?;"
		stmt, err := Db.Prepare(sqlForRun)
		checkErr(err)
		defer stmt.Close()
		row := stmt.QueryRow(requestBody["openid"])
		var registerTime string
		var lastLoginTime string
		var birthday string
		err = row.Scan(&user.Id, &user.Openid, &user.SessionKey, &user.Age, &user.Gender, &registerTime,
			&lastLoginTime, &user.NickName, &birthday)
		if err == sql.ErrNoRows {
			sqlForRun = "insert into user(openid,session_key,gender,register_time,last_login_time,nickname,age)" +
				" values(?,?,?,?,?,?,?)"
			res, err := Db.Exec(sqlForRun, requestBody["openid"], requestBody["session_key"],
				c.PostForm("gender"), time.Now(), time.Now(), c.PostForm("nickname"), 10)
			checkErr(err)
			_, _ = res.LastInsertId()
			c.JSON(200, gin.H{
				"openid": requestBody["openid"],
				"flag":   true,
			})
		} else {
			sqlForRun = "update user set last_login_time = ? where openid = ?"
			stmt2, err := Db.Prepare(sqlForRun)
			checkErr(err)
			defer stmt2.Close()
			_, err = stmt2.Exec(time.Now(), requestBody["openid"])
			checkErr(err)
			user.LastLoginTime = time.Now()
			c.JSON(200, gin.H{
				"id":            user.Id,
				"openid":        user.Openid,
				"session_key":   user.SessionKey,
				"age":           user.Age,
				"gender":        user.Gender,
				"register_time": user.RegisterTime,
				"lastLoginTime": user.LastLoginTime,
				"nickname":      user.NickName,
				"birthday":      user.Birthday,
			})
		}
	} else {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic(string(body))
	}

}

func userInfo(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	openId := c.PostForm("openid")
	if openId == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("openid" + "字段为空")
	}
	//checkEmpty(testId, "test_id",10001,c)
	birthday := c.PostForm("birthday")
	if birthday == "" {
		result["error_code"] = 10002
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("birthday" + "字段为空")
	}
	gender := c.PostForm("gender")
	if gender == "" {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("gender" + "字段为空")
	}
	birthdayDate, _ := time.Parse("2006-01-02", birthday)
	age := time.Now().Year() - birthdayDate.Year()
	sqlForRun := "update user set age = ?, birthday = ?, gender = ? where openid = ?"
	stmt2, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt2.Close()
	_, err = stmt2.Exec(age, birthday, gender, openId)
	if err != nil {
		result["error_code"] = 10004
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("未知错误")
	} else {
		result["error_code"] = 0
		var list = make(map[string]interface{})
		list["age"] = age
		result["data"] = list
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	}
}

func userFeedback(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	openid := c.PostForm("openid")
	feedback_type := c.PostForm("feedback_type")
	contact_info := c.PostForm("contact_info")
	feedback_content := c.PostForm("feedback_content")
	imagelist := c.PostForm("imagelist")
	var requestBody []string
	err := json.Unmarshal([]byte(imagelist), &requestBody)
	fmt.Println(requestBody)
	sqlForRun := "insert into feedback(feedback_type,user_id,contact_info,feedback_content" +
		",img_url,feedback_time) values(?,?,?,?,?,?)"
	_, err = Db.Exec(sqlForRun, feedback_type, openid,
		contact_info, feedback_content, imagelist, time.Now())
	if err != nil {
		checkErr(err)
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("sql 异常")
	}
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))
}

func userSubmit(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	openid := c.PostForm("openid")
	if openid == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("openid" + "字段为空")
	}
	age := c.PostForm("age")
	if age == "" {
		result["error_code"] = 10002
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("age" + "字段为空")
	}
	score := c.PostForm("score")
	if score == "" {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("score" + "字段为空")
	}
	cost_time := c.PostForm("cost_time")
	if cost_time == "" {
		result["error_code"] = 10004
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("cost_time" + "字段为空")
	}
	var scoreList []float64
	err := json.Unmarshal([]byte(score), &scoreList)
	checkErr(err)
	if len(scoreList) != 5 {
		result["error_code"] = 20001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("score" + "字段数据异常")
	}
	sqlForRun := "SELECT max(test_order) from test_result where openid = ?"
	stmt, err := Db.Prepare(sqlForRun)
	defer stmt.Close()
	row := stmt.QueryRow(openid)
	var test_order int
	err = row.Scan(&test_order)
	test_order += 1

	sqlForRun = "select p.openid,m, plan_score, attention_score, simul_score, suc_score, total_score from  (SELECT max(test_order) m,openid from test_result  group by openid ) p , test_result where p.m = test_result.test_order and p.openid=test_result.openid and p.openid IN ( SELECT openid FROM `user` WHERE age = ? )"
	stmt2, err := Db.Prepare(sqlForRun)
	defer stmt2.Close()
	row2, _ := stmt2.Query(age)
	var userTResultList []models.UserTestResult
	for row2.Next() {
		UTResult := new(models.UserTestResult)
		err = row2.Scan(&UTResult.Openid, &UTResult.TestOrder, &UTResult.PlanScore, &UTResult.AttentionScore,
			&UTResult.SimulScore, &UTResult.SucScore, &UTResult.TotalScore)
		if UTResult.Openid == openid {
			continue
		} else {
			userTResultList = append(userTResultList, *UTResult)
		}
	}
	UTResult := new(models.UserTestResult)
	UTResult.Openid = openid
	UTResult.TestOrder = test_order
	UTResult.PlanScore = scoreList[0]
	UTResult.AttentionScore = scoreList[2]
	UTResult.SimulScore = scoreList[1]
	UTResult.SucScore = scoreList[3]
	UTResult.TotalScore = scoreList[4]
	UTResult.Flag = 1
	userTResultList = append(userTResultList, *UTResult)
	sumPeople := len(userTResultList)

	var avgP float64
	var avgA float64
	var avgS1 float64
	var avgS2 float64
	TotalP := 0.0
	TotalA := 0.0
	TotalS1 := 0.0
	TotalS2 := 0.0

	for i := 0; i < sumPeople; i++ {
		TotalP += userTResultList[i].PlanScore
		TotalA += userTResultList[i].AttentionScore
		TotalS1 += userTResultList[i].SimulScore
		TotalS2 += userTResultList[i].SucScore
	}
	avgP = TotalP / float64(sumPeople)
	avgA = TotalA / float64(sumPeople)
	avgS1 = TotalS1 / float64(sumPeople)
	avgS2 = TotalS2 / float64(sumPeople)
	var insertPRank int
	var insertARank int
	var insertS1Rank int
	var insertS2Rank int
	var insertTRank int
	sort.SliceStable(userTResultList, func(i, j int) bool {
		if userTResultList[i].PlanScore > userTResultList[j].PlanScore {
			return true
		}
		return false
	})
	for i := 0; i < sumPeople; i++ {
		if userTResultList[i].Flag == 1 {
			insertPRank = i + 1
			break
		}
	}
	sort.SliceStable(userTResultList, func(i, j int) bool {
		if userTResultList[i].AttentionScore > userTResultList[j].AttentionScore {
			return true
		}
		return false
	})
	for i := 0; i < sumPeople; i++ {
		if userTResultList[i].Flag == 1 {
			insertARank = i + 1
			break
		}
	}
	sort.SliceStable(userTResultList, func(i, j int) bool {
		if userTResultList[i].SimulScore > userTResultList[j].SimulScore {
			return true
		}
		return false
	})
	for i := 0; i < sumPeople; i++ {
		if userTResultList[i].Flag == 1 {
			insertS1Rank = i + 1
			break
		}
	}
	sort.SliceStable(userTResultList, func(i, j int) bool {
		if userTResultList[i].SucScore > userTResultList[j].SucScore {
			return true
		}
		return false
	})
	for i := 0; i < sumPeople; i++ {
		if userTResultList[i].Flag == 1 {
			insertS2Rank = i + 1
			break
		}
	}
	sort.SliceStable(userTResultList, func(i, j int) bool {
		if userTResultList[i].TotalScore > userTResultList[j].TotalScore {
			return true
		}
		return false
	})
	for i := 0; i < sumPeople; i++ {
		if userTResultList[i].Flag == 1 {
			insertTRank = i + 1
			break
		}
	}
	sqlForRun = "insert into test_result(openid,test_order,plan_score,plan_rank" +
		",attention_score,attention_rank,simul_score,simul_rank,suc_score,suc_rank,cost_time" +
		",test_date,sum_people,total_score,total_rank,plan_avg_score,attention_avg_score,simul_avg_score,suc_avg_score)" +
		" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	_, err = Db.Exec(sqlForRun, openid, test_order, scoreList[0], insertPRank, scoreList[2], insertARank, scoreList[1],
		insertS1Rank, scoreList[3], insertS2Rank, cost_time, time.Now().Format("2006-01-02 15:04:05"), sumPeople, scoreList[4], insertTRank,
		avgP, avgA, avgS1, avgS2)
	if err != nil {
		checkErr(err)
		result["error_code"] = 30001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("sql 异常")
	}
	reList := make(map[string]interface{})
	reList["plan_rank"] = insertPRank
	reList["plan_avg_score"] = avgP
	reList["attention_rank"] = insertARank
	reList["attention_avg_score"] = avgA
	reList["simul_rank"] = insertS1Rank
	reList["simul_avg_score"] = avgS1
	reList["suc_rank"] = insertS2Rank
	reList["suc_avg_score"] = avgS2
	reList["total_rank"] = insertTRank
	reList["sum_peoele"] = sumPeople
	result["data"] = reList
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))

}

func getResult(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	testid := c.PostForm("testid")
	if testid == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("testid" + "字段为空")
	}
	var resultAndRank models.ResultAndRank
	sqlForRun := "SELECT plan_rank,plan_avg_score,attention_rank,attention_avg_score,simul_rank,simul_avg_score" +
		",suc_rank,suc_avg_score,total_rank,sum_people,plan_score,attention_score,simul_score,suc_score,test_date" +
		" from test_result where test_id = ?"
	stmt, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt.Close()
	row := stmt.QueryRow(testid)
	var date string
	err = row.Scan(&resultAndRank.PlanRank, &resultAndRank.PlanAvgScore, &resultAndRank.AttentionRank, &resultAndRank.AttentionAvgScore,
		&resultAndRank.SimulRank, &resultAndRank.SimulAvgScore, &resultAndRank.SucRank, &resultAndRank.SucAvgScore,
		&resultAndRank.TotalRank, &resultAndRank.SumPeople, &resultAndRank.PlanScore,
		&resultAndRank.AttentionScore, &resultAndRank.SimulScore, &resultAndRank.SucScore, &date)
	checkErr(err)
	resultAndRank.TestDate, _ = time.Parse("2006-01-02 15:04:05", date)
	reList := make(map[string]interface{})
	reList["plan_rank"] = resultAndRank.PlanRank
	reList["plan_avg_score"] = resultAndRank.PlanAvgScore
	reList["attention_rank"] = resultAndRank.AttentionRank
	reList["attention_avg_score"] = resultAndRank.AttentionAvgScore
	reList["simul_rank"] = resultAndRank.SimulRank
	reList["simul_avg_score"] = resultAndRank.SimulAvgScore
	reList["suc_rank"] = resultAndRank.SucRank
	reList["suc_avg_score"] = resultAndRank.SucAvgScore
	reList["total_rank"] = resultAndRank.TotalRank
	reList["sum_peoele"] = resultAndRank.SumPeople
	reList["plan_score"] = resultAndRank.PlanScore
	reList["attention_score"] = resultAndRank.AttentionScore
	reList["simul_score"] = resultAndRank.SimulScore
	reList["suc_score"] = resultAndRank.SucScore
	reList["test_time"] = resultAndRank.TestDate.Format("2006-01-02 15:04:05")
	result["data"] = reList
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))

}

func getHistory(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	openid := c.PostForm("openid")
	if openid == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("openid" + "字段为空")
	}
	testyear := c.PostForm("testyear")
	if testyear == "" {
		result["error_code"] = 10002
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("testyear" + "字段为空")
	}
	testyearNum, err := strconv.Atoi(testyear)
	testmonth := c.PostForm("testmonth")
	if testmonth == "" {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("testmonth" + "字段为空")
	}
	testmonthNum, err := strconv.Atoi(testmonth)

	sqlForRun := "SELECT openid, test_id,total_score,test_date FROM test_result WHERE openid = ?"
	stmt, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt.Close()
	row, _ := stmt.Query(openid)
	var record []map[string]interface{}
	for row.Next() {
		history := new(models.History)
		var date string
		err = row.Scan(&history.Openid, &history.TestId, &history.TotalScore, &date)
		checkErr(err)
		history.TestDate, _ = time.Parse("2006-01-02 15:04:05", date)
		if history.TestDate.Year() == testyearNum && int(history.TestDate.Month()) == testmonthNum {
			tmp := make(map[string]interface{})
			tmp["testtime"] = history.TestDate.Format("2006-01-02 15:04:05")
			tmp["testscore"] = history.TotalScore
			tmp["testid"] = history.TestId
			record = append(record, tmp)
		}
	}
	result["data"] = record
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))
}

func rankList(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	openid := c.PostForm("openid")
	if openid == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("openid" + "字段为空")
	}
	age := c.PostForm("age")
	if age == "" {
		result["error_code"] = 10002
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("age" + "字段为空")
	}
	tp := c.PostForm("type")
	if tp == "" {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("type" + "字段为空")
	}
	page_num := c.PostForm("page_num")
	if page_num == "" {
		result["error_code"] = 10004
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("page_num" + "字段为空")
	}
	list_num := c.PostForm("list_num")
	if list_num == "" {
		result["error_code"] = 10005
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("list_num" + "字段为空")
	}
	sqlForRun := "select p.openid,m, plan_score, attention_score, simul_score, suc_score, total_score,u.nickname from  (SELECT max(test_order) m,openid from test_result  group by openid ) p , test_result,`user` u where p.openid=u.openid and p.m = test_result.test_order and p.openid=test_result.openid and p.openid IN ( SELECT openid FROM `user` WHERE age = ? )"
	stmt, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt.Close()
	row, _ := stmt.Query(age)
	var userTResultList []models.UserTestResult
	for row.Next() {
		UTResult := new(models.UserTestResult)
		err = row.Scan(&UTResult.Openid, &UTResult.TestOrder, &UTResult.PlanScore, &UTResult.AttentionScore,
			&UTResult.SimulScore, &UTResult.SucScore, &UTResult.TotalScore, &UTResult.Nickname)
		userTResultList = append(userTResultList, *UTResult)
	}
	sumPeople := len(userTResultList)
	list_num_int, err := strconv.Atoi(list_num)
	checkErr(err)
	all_number := sumPeople / list_num_int
	if sumPeople%list_num_int != 0 {
		all_number += 1
	}
	if tp == "P" {
		resdata := make(map[string]interface{})
		resdata["all_number"] = all_number
		sort.SliceStable(userTResultList, func(i, j int) bool {
			if userTResultList[i].PlanScore > userTResultList[j].PlanScore {
				return true
			}
			return false
		})
		page_num_int, err := strconv.Atoi(page_num)
		checkErr(err)
		needMin := list_num_int * (page_num_int - 1)
		needMax := list_num_int*page_num_int - 1
		var myscore float64
		var myrank int
		var relist []map[string]interface{}
		for i := 0; i < sumPeople; i++ {
			if userTResultList[i].Openid == openid {
				myscore = userTResultList[i].PlanScore
				myrank = i + 1
			}
			if needMin <= i && i <= needMax {
				people := make(map[string]interface{})
				people["rank"] = i + 1
				people["nick_name"] = userTResultList[i].Nickname
				people["score"] = userTResultList[i].PlanScore
				relist = append(relist, people)
			}
		}
		resdata["my_score"] = myscore
		resdata["my_rank"] = myrank
		resdata["rank_list"] = relist
		result["data"] = resdata
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	}
	if tp == "A" {
		resdata := make(map[string]interface{})
		resdata["all_number"] = all_number
		sort.SliceStable(userTResultList, func(i, j int) bool {
			if userTResultList[i].AttentionScore > userTResultList[j].AttentionScore {
				return true
			}
			return false
		})
		page_num_int, err := strconv.Atoi(page_num)
		checkErr(err)
		needMin := list_num_int * (page_num_int - 1)
		needMax := list_num_int*page_num_int - 1
		var myscore float64
		var myrank int
		var relist []map[string]interface{}
		for i := 0; i < sumPeople; i++ {
			if userTResultList[i].Openid == openid {
				myscore = userTResultList[i].AttentionScore
				myrank = i + 1
			}
			if needMin <= i && i <= needMax {
				people := make(map[string]interface{})
				people["rank"] = i + 1
				people["nick_name"] = userTResultList[i].Nickname
				people["score"] = userTResultList[i].AttentionScore
				relist = append(relist, people)
			}
		}
		resdata["my_score"] = myscore
		resdata["my_rank"] = myrank
		resdata["rank_list"] = relist
		result["data"] = resdata
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	}
	if tp == "S1" {
		resdata := make(map[string]interface{})
		resdata["all_number"] = all_number
		sort.SliceStable(userTResultList, func(i, j int) bool {
			if userTResultList[i].SimulScore > userTResultList[j].SimulScore {
				return true
			}
			return false
		})
		page_num_int, err := strconv.Atoi(page_num)
		checkErr(err)
		needMin := list_num_int * (page_num_int - 1)
		needMax := list_num_int*page_num_int - 1
		var myscore float64
		var myrank int
		var relist []map[string]interface{}
		for i := 0; i < sumPeople; i++ {
			if userTResultList[i].Openid == openid {
				myscore = userTResultList[i].SimulScore
				myrank = i + 1
			}
			if needMin <= i && i <= needMax {
				people := make(map[string]interface{})
				people["rank"] = i + 1
				people["nick_name"] = userTResultList[i].Nickname
				people["score"] = userTResultList[i].SimulScore
				relist = append(relist, people)
			}
		}
		resdata["my_score"] = myscore
		resdata["my_rank"] = myrank
		resdata["rank_list"] = relist
		result["data"] = resdata
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	}
	if tp == "S2" {
		resdata := make(map[string]interface{})
		resdata["all_number"] = all_number
		sort.SliceStable(userTResultList, func(i, j int) bool {
			if userTResultList[i].SucScore > userTResultList[j].SucScore {
				return true
			}
			return false
		})
		page_num_int, err := strconv.Atoi(page_num)
		checkErr(err)
		needMin := list_num_int * (page_num_int - 1)
		needMax := list_num_int*page_num_int - 1
		var myscore float64
		var myrank int
		var relist []map[string]interface{}
		for i := 0; i < sumPeople; i++ {
			if userTResultList[i].Openid == openid {
				myscore = userTResultList[i].SucScore
				myrank = i + 1
			}
			if needMin <= i && i <= needMax {
				people := make(map[string]interface{})
				people["rank"] = i + 1
				people["nick_name"] = userTResultList[i].Nickname
				people["score"] = userTResultList[i].SucScore
				relist = append(relist, people)
			}
		}
		resdata["my_score"] = myscore
		resdata["my_rank"] = myrank
		resdata["rank_list"] = relist
		result["data"] = resdata
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	}
	if tp == "T" {
		resdata := make(map[string]interface{})
		resdata["all_number"] = all_number
		sort.SliceStable(userTResultList, func(i, j int) bool {
			if userTResultList[i].TotalScore > userTResultList[j].TotalScore {
				return true
			}
			return false
		})
		page_num_int, err := strconv.Atoi(page_num)
		checkErr(err)
		needMin := list_num_int * (page_num_int - 1)
		needMax := list_num_int*page_num_int - 1
		var myscore float64
		var myrank int
		var relist []map[string]interface{}
		for i := 0; i < sumPeople; i++ {
			if userTResultList[i].Openid == openid {
				myscore = userTResultList[i].TotalScore
				myrank = i + 1
			}
			if needMin <= i && i <= needMax {
				people := make(map[string]interface{})
				people["rank"] = i + 1
				people["nick_name"] = userTResultList[i].Nickname
				people["score"] = userTResultList[i].TotalScore
				relist = append(relist, people)
			}
		}
		resdata["my_score"] = myscore
		resdata["my_rank"] = myrank
		resdata["rank_list"] = relist
		result["data"] = resdata
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	}
}

func lastTest(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	openid := c.PostForm("openid")
	if openid == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("openid" + "字段为空")
	}
	data := make(map[string]interface{})
	sqlForRun := "SELECT plan_score,attention_score,simul_score,suc_score,test_date FROM test_result WHERE openid = ? ORDER BY test_id DESC LIMIT 1"
	stmt, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt.Close()
	row, _ := stmt.Query(openid)
	var plan_score int
	var attention_score int
	var simul_score int
	var suc_score int
	var unprase_test_time string
	if row.Next() {
		err = row.Scan(&plan_score, &attention_score, &simul_score, &suc_score, &unprase_test_time)
		checkErr(err)
		var test_time time.Time
		test_time, _ = time.Parse("2006-01-02 15:04:05", unprase_test_time)
		data["plan_score"] = plan_score
		data["attention_score"] = attention_score
		data["simul_score"] = simul_score
		data["suc_score"] = suc_score
		data["test_time"] = test_time.Format("2006-01-02 15:04:05")
		result["data"] = data
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	} else {
		result["data"] = data
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
	}
}

func getDataStastics(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	sqlForRun := "SELECT age, sum(plan_score)/COUNT(*),sum(attention_score)/COUNT(*),sum(simul_score)/COUNT(*),sum(suc_score)/COUNT(*) FROM `user`,test_result WHERE `user`.openid = test_result.openid GROUP BY age"
	stmt, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt.Close()
	row, _ := stmt.Query()
	var age int
	var plan_score float64
	var attention_score float64
	var simul_score float64
	var suc_score float64
	var list []map[string]interface{}
	for row.Next() {
		err = row.Scan(&age, &plan_score, &attention_score, &simul_score, &suc_score)
		data := make(map[string]interface{})
		data["age"] = age
		data["plan_avg_score"] = plan_score
		data["attention_avg_score"] = attention_score
		data["simul_avg_score"] = simul_score
		data["suc_avg_score"] = suc_score
		list = append(list, data)
	}
	result["data"] = list
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))
}

func questionBank(c *gin.Context) {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	modify_detail := c.PostForm("modify_detail")
	if modify_detail == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("modify_detail" + "字段为空")
	}
	test_id := c.PostForm("test_id")
	if test_id == "" {
		result["error_code"] = 10002
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("test_id" + "字段为空")
	}
	age_group := c.PostForm("age_group")
	if age_group == "" {
		result["error_code"] = 10003
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("age_group" + "字段为空")
	}
	difficulty := c.PostForm("difficulty")
	if difficulty == "" {
		result["error_code"] = 10004
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("difficulty" + "字段为空")
	}
	parameter_info := c.PostForm("parameter_info")
	if parameter_info == "" {
		result["error_code"] = 10005
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("parameter_info" + "字段为空")
	}
	sqlForRun := "update parameter_configuration set parameter_info = ? where test_id = ? and difficulty = ? and age_group = ?"
	stmt, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt.Close()
	_, err = stmt.Exec(parameter_info,test_id,difficulty,age_group)
	checkErr(err)
	sqlForRun = "insert into parameter_modify(modify_date,modify_detail) values(?,?)"
	stmt2, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt2.Close()
	_, err = stmt.Exec(time.Now(),modify_detail)
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))
}

func setFeedback(c *gin.Context)  {
	defer recoverErr()
	result := make(map[string]interface{})
	result["error_code"] = 0
	beginTime := c.PostForm("beginTime")
	if beginTime == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("beginTime" + "字段为空")
	}
	endTime := c.PostForm("endTime")
	if endTime == "" {
		result["error_code"] = 10001
		mapJson, err := json.Marshal(result)
		checkErr(err)
		c.JSON(200, string(mapJson))
		panic("endTime" + "字段为空")
	}
	sqlForRun := "select (contack_info,feedback_type,feedback_content,img_url,feedback_time) from feedback where feedbakc_time > ? and feedbacktime<?";
	stmt, err := Db.Prepare(sqlForRun)
	checkErr(err)
	defer stmt.Close()
	row, _ := stmt.Query(beginTime,endTime)
	var contack_info string
	var feedback_type string
	var feedback_content string
	var img_url string
	var feedback_time string
	var list []map[string]interface{}
	for row.Next() {
		err = row.Scan(&contack_info, &feedback_type, &feedback_content, &img_url, &feedback_time)
		data := make(map[string]interface{})
		data["contack_info"] = contack_info
		data["feedback_type"] = feedback_type
		data["feedback_content"] = feedback_content
		data["img_url"] = img_url
		data["feedback_time"],_ = time.Parse("2006-01-02 15:04:05", feedback_time)
		list = append(list, data)
	}
	result["data"] = list
	mapJson, err := json.Marshal(result)
	checkErr(err)
	c.JSON(200, string(mapJson))
}



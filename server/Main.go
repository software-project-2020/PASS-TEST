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
			sqlForRun = "insert into user(openid,session_key,gender,register_time,last_login_time,nickname)" +
				" values(?,?,?,?,?,?)"
			res, err := Db.Exec(sqlForRun, requestBody["openid"], requestBody["session_key"],
				c.PostForm("gender"), time.Now(), time.Now(), c.PostForm("nickname"))
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

	sqlForRun = "SELECT openid, max( test_order ), plan_score, attention_score, simul_score, suc_score, total_score FROM test_result WHERE openid IN ( SELECT openid FROM `user` WHERE age = ? ) GROUP BY openid"
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
	UTResult.AttentionScore = scoreList[1]
	UTResult.SimulScore = scoreList[2]
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
			insertPRank = i+1
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
			insertARank = i+1
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
			insertS1Rank = i+1
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
			insertS2Rank = i+1
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
			insertTRank = i+1
			break
		}
	}
	sqlForRun = "insert into test_result(openid,test_order,plan_score,plan_rank" +
		",attention_score,attention_rank,simul_score,simul_rank,suc_score,suc_rank,cost_time" +
		",test_date,sum_people,total_score,total_rank) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	_, err = Db.Exec(sqlForRun, openid, test_order, scoreList[0], insertPRank, scoreList[1], insertARank, scoreList[2],
		insertS1Rank, scoreList[3], insertS2Rank, cost_time, time.Now(), sumPeople, scoreList[4], insertTRank)
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

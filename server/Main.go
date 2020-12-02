package main

import (
	"./driver"
	"./models"
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"time"
)

var Db *sql.DB

func init() {
	Db = driver.ConnectSQL()
}

func checkErr(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

func recoverErr() {
	if err := recover(); err != nil {
		log.Println(err)
		fmt.Println("程序捕获，继续执行")

	}
}

func checkEmpty(value string, name string) {
	if value == "" {
		panic(name + "字段为空")
	}
}

func main() {
	r := gin.Default()
	// 获取用户信息
	//post = {
	//	  "userid": 7
	//}
	r.POST("/api/user/getbyid", getUserById)
	// 用户注册  注册时间和上次登录时间直接用time.Now()
	//post = {
	//    "openid": "",
	//    "session_key": "",
	//    "age": ,
	//    "gender": ,
	//    "nickname": "用户名",
	//    "birthday": "2020-01-01",
	//}
	r.POST("/api/user/register", registerUser)
	// 获取题目单个题目的信息
	//post = {
	//    "test_id": "S11",
	//    "age_group": 0
	//}
	r.POST("/api/test/configuration", getConfiguration)

	r.Run(":23333")
}

func getUserById(c *gin.Context) {
	defer recoverErr()
	user := models.User{}
	id := c.PostForm("userid")
	sql := "select * from user where id = ?;"
	stmt, err := Db.Prepare(sql)
	checkErr(err)
	defer stmt.Close()
	row := stmt.QueryRow(id)
	var registerTime string
	var lastLoginTime string
	var birthday string
	err = row.Scan(&user.Id, &user.Openid, &user.SessionKey, &user.Age, &user.Gender, &registerTime,
		&lastLoginTime, &user.NickName, &birthday)
	checkErr(err)
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
	checkEmpty(openid, "open_id")
	res, err := Db.Exec(sql, openid, c.PostForm("session_key"), c.PostForm("age"),
		c.PostForm("gender"), time.Now(), time.Now(), c.PostForm("nickname"), c.PostForm("birthday"))
	checkErr(err)
	fmt.Println(res.LastInsertId())
}

func getConfiguration(c *gin.Context) {
	defer recoverErr()
	configs := models.Configurations{}
	testId := c.PostForm("test_id")
	checkEmpty(testId, "test_id")
	ageGroup := c.PostForm("age_group")
	checkEmpty(ageGroup, "age_group")
	sql := "select * from parameter_configuration where test_id = ? and age_group = ?"
	stmt, err := Db.Prepare(sql)
	checkErr(err)
	defer stmt.Close()
	row,err := stmt.Query(testId, ageGroup)
	for row.Next(){
		config := new(models.Configuration)
		err = row.Scan(&config.TestId, &config.Difficulty, &config.AgeGroup, &config.ParameterInfo)
		configs.Configurations = append(configs.Configurations,*config)
	}
	fmt.Println(configs)
	checkErr(err)
	c.JSON(200,"ok")
	//c.JSON(200, gin.H{
	//	"difficulty": config.Difficulty,
	//	"parameter":  config.ParameterInfo,
	//})
}

package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"time"
)

var Db *sql.DB

func init() {
	fmt.Println(time.Now())
	fmt.Println("系统启动的时候就加载(并不是用户访问的时候加载) 因为连接池 只是用户使用的时候就会建立连接 用完返回")
	var err error
	Db, err = sql.Open("mysql", "pass:pass@tcp(47.102.101.77:3306)/PASSGO?charset=utf8mb4&parseTime=true&loc=Local")
	if err != nil {
		log.Panicln("err:", err.Error())
	}
	// 参数为0 表示无限制
	Db.SetMaxOpenConns(2000)
	Db.SetMaxIdleConns(1000)
}

func checkErr(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

type User struct {
	id            int       `db:"id"`
	openid        string    `db:"openid"`
	sessionKey    string    `db:"session_key"`
	age           int       `db:"age"`
	gender        int       `db:"gender"`
	registerTime  time.Time `db:"register_time"`
	lastLoginTime time.Time `db:"lastLogin_time"`
	nickName      string    `db:"nickname"`
	birthday      time.Time `db:"birthday"`
}

type Configuration struct {
	testId string `db:"test_id"`
	difficulty int `db:"difficulty"`
	ageGroup int `db:"age_group"`
	parameterInfo string `db:"parameter_info"`
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
	r.POST("/api/test/configuration",getConfiguration)

	r.Run(":23333")
}

func getUserById(c *gin.Context) {
	user := User{}
	id := c.PostForm("userid")
	sql := "select * from user where id = ?;"
	stmt, err := Db.Prepare(sql)
	checkErr(err)
	defer stmt.Close()
	row := stmt.QueryRow(id)
	var registerTime string
	var lastLoginTime string
	var birthday string
	err = row.Scan(&user.id, &user.openid, &user.sessionKey, &user.age, &user.gender, &registerTime,
		&lastLoginTime, &user.nickName, &birthday)
	checkErr(err)
	user.registerTime, _ = time.Parse("2006-01-02 15:04:05", registerTime)
	user.lastLoginTime, _ = time.Parse("2006-01-02 15:04:05", lastLoginTime)
	user.birthday, _ = time.Parse("2006-01-02", birthday)
	c.JSON(200, gin.H{
		"id":            user.id,
		"openid":        user.openid,
		"session_key":   user.sessionKey,
		"age":           user.age,
		"gender":        user.gender,
		"register_time": user.registerTime,
		"lastLoginTime": user.lastLoginTime,
		"nickname":      user.nickName,
		"birthday":      user.birthday,
	})
}

func registerUser(c *gin.Context) {
	sql := "insert into user(openid,session_key,age,gender,register_time,last_login_time,nickname,birthday)" +
		" values(?,?,?,?,?,?,?,?)"
	res,err:= Db.Exec(sql,c.PostForm("openid"),c.PostForm("session_key"),c.PostForm("age"),
		c.PostForm("gender"),time.Now(),time.Now(),c.PostForm("nickname"),c.PostForm("birthday"))
	checkErr(err)
	fmt.Println(res.LastInsertId())
}

func getConfiguration(c *gin.Context){
	conifg :=Configuration{}
	testId := c.PostForm("test_id")
	ageGroup := c.PostForm("age_group")
	sql :="select * from parameter_configuration where test_id = ? and age_group = ?"
	stmt,err := Db.Prepare(sql)
	checkErr(err)
	defer stmt.Close()
	row := stmt.QueryRow(testId,ageGroup)
	err = row.Scan(&conifg.testId,&conifg.difficulty,&conifg.ageGroup,&conifg.parameterInfo)
	checkErr(err)
	c.JSON(200,gin.H{
		"difficulty":conifg.difficulty,
		"parameter":conifg.parameterInfo,
	})
}

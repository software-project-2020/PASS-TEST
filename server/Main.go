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
	fmt.Println("系统启动的时候就加载(并不是用户访问的时候加载) 因为连接池 只是用户使用的时候就会建立连接 用完返回")
	var err error
	Db, err = sql.Open("mysql", "pass:pass@tcp(47.102.101.77:3306)/PASSGO")
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

func main() {
	r := gin.Default()
	r.POST("/api/getuserinfo", func(c *gin.Context) {
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
		user.registerTime,_ = time.Parse("2006-01-02 15:04:05",registerTime)
		user.lastLoginTime,_ = time.Parse("2006-01-02 15:04:05",lastLoginTime)
		user.birthday,_ = time.Parse("2006-01-02 15:04:05",birthday)
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
	})
	r.GET("/pings", func(c *gin.Context) {
		fmt.Println("Hello, World2!")
	})
	r.Run(":23333")
}

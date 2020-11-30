package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

var Db *sql.DB

func init() {
	fmt.Println("系统启动的时候就加载(并不是用户访问的时候加载) 因为连接池 只是用户使用的时候就会建立连接 用完返回")
	var err error
	Db, err = sql.Open("mysql", "xxx:xx@tcp(1111:3306)/xxxx")
	if err != nil {
		log.Panicln("err:", err.Error())
	}

	Db.SetMaxOpenConns(0)
	Db.SetMaxIdleConns(0)
}

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		fmt.Println("Hello, World1!")
		//var err error
		//result, e := Db.Exec("insert into xxxx(name, phone) values (?,?);", "姓名", "手机号")
		//if e != nil {
		//	log.Panicln("user insert error", e.Error())
		//}
		//id, err := result.LastInsertId()
		//if err != nil {
		//	log.Panicln("user insert id error", err.Error(), id)
		//}
		//c.JSON(200, gin.H{
		//	"message": "pong1",
		//})
	})
	r.GET("/pings", func(c *gin.Context) {
		fmt.Println("Hello, World2!")
	})
	r.Run(":23333")
}

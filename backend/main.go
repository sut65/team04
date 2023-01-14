package main

import (
	"github.com/gin-gonic/gin"
	"github.com/team04/controller"
	"github.com/team04/entity"
)

func main() {
	entity.SetupDatabase()
	r := gin.Default()
	r.GET("/health", controller.Health)
	r.Run()

}

package main

import (
	"github.com/gin-gonic/gin"
	"github.com/team04/controller"
)

func main() {
	r := gin.Default()
	r.GET("/health", controller.Health)
	r.Run()
}

package main

import (
	"github.com/gin-gonic/gin"
	"github.com/team04/controller"
	"github.com/team04/entity"
)

func main() {
	entity.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())
	r.GET("/health", controller.Health)

	//------ BookPurchasing System ------//
	r.GET("/publisher", controller.GetAllPublisher)
	r.GET("/publisher/:id", controller.GetPublisherByID)
	r.POST("/publisher", controller.CreatePublisher)
	r.PATCH("/publisher", controller.UpdatePublisher)
	r.DELETE("/publisher/:id", controller.DeletePublisher)
	//Librarian
	r.GET("/librarian", controller.GetAllLibrarian)
	r.GET("/librarian/:id", controller.GetLibrarianByID)
	r.POST("/librarian", controller.CreateLibrarian)
	r.PATCH("/librarian", controller.UpdateLibrarian)
	r.DELETE("/librarian/:id", controller.DeleteLibrarian)
	r.Run()

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

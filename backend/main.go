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
	//bookPurchasing
	r.GET("/bookPurchasing", controller.GetAllBookPurchasing)
	r.GET("/bookPurchasing/:id", controller.GetBookPurchasingByID)
	r.POST("/bookPurchasing", controller.CreateBookPurchasing)
	r.PATCH("/bookPurchasing", controller.UpdateBookPurchasing)
	r.DELETE("/bookPurchasing/:id", controller.DeleteBookPurchasing)
	//publisher
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

	// //------ EquipmentPurchasing System ------//
	// //EquipmentPurchasing
	// r.GET("/equipmentPurchasing", controller.GetAllEquipmentPurchasing)
	// r.GET("/equipmentPurchasing/:id", controller.GetEquipmentPurchasingByID)
	// r.POST("/equipmentPurchasing", controller.CreateEquipmentPurchasing)
	// r.PATCH("/equipmentPurchasing", controller.UpdateEquipmentPurchasing)
	// r.DELETE("/equipmentPurchasing/:id", controller.DeleteEquipmentPurchasing)

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

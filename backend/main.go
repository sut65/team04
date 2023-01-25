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

	//
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

	//
	//------ BorrowBook System ------//
	// User
	r.GET("/users", controller.ListUsers)
	r.GET("/users/:id", controller.GetUser)
	r.POST("/users", controller.CreateUser)
	r.PATCH("/users", controller.UpdateUser)
	r.DELETE("/users/:id", controller.DeleteUser)
	// BorrowBook
	r.GET("/borrow_books", controller.ListBorrowBooks)
	r.GET("/borrow_books/:id", controller.GetBorrowBook)
	r.POST("/borrow_books", controller.CreateBorrowBook)
	r.PATCH("/borrow_books", controller.UpdateBorrowBook)
	r.DELETE("/borrow_books/:id", controller.DeleteBorrowBook)

	//
	//------ ReturnBook System ------//
	// LostBook
	r.GET("/lost_books", controller.ListLostBooks)
	r.GET("/lost_books/:id", controller.GetLostBook)
	r.POST("/lost_books", controller.CreateLostBook)
	r.PATCH("/lost_books", controller.UpdateLostBook)
	r.DELETE("/lost_books/:id", controller.DeleteLostBook)
	// ReturnBook
	r.GET("/return_books", controller.ListReturnBooks)
	r.GET("/return_books/:id", controller.GetReturnBook)
	r.POST("/return_books", controller.CreateReturnBook)
	r.PATCH("/return_books", controller.UpdateReturnBook)
	r.DELETE("/return_books/:id", controller.DeleteReturnBook)

	//----------Borrow & Return Equipment & equipment status----
	// BorrowEquipment
	r.GET("/borrow_equipments", controller.ListBorrowEquipments)
	r.GET("/borrow_equipments/:id", controller.GetBorrowEquipment)
	r.POST("/borrow_equipments", controller.CreateBorrowEquipment)
	r.PATCH("/borrow_equipments", controller.UpdateBorrowEquipment)
	r.DELETE("/borrow_equipments/:id", controller.DeleteBorrowEquipment)

	// equipment status
	r.GET("/equipment_statuses", controller.ListEquipmentStatuses)
	r.GET("/equipment_status/:id", controller.GetEquipmentStatus)
	r.POST("/equipment_statuses", controller.CreateEquipmentStatus)
	r.PATCH("/equipment_statuses", controller.UpdateEquipmentStatus)
	r.DELETE("/equipment_statuses/:id", controller.DeleteEquipmentStatus)

	// ReturnEquipment
	r.GET("/return_equipments", controller.ListReturnEquipments)
	r.GET("/return_equipments/:id", controller.GetReturnEquipment)
	r.POST("/return_equipments", controller.CreateReturnEquipment)
	r.PATCH("/return_equipments", controller.UpdateReturnEquipment)
	r.DELETE("/return_equipments/:id", controller.DeleteReturnEquipment)
	//
	// Run the server
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

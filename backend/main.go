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
	//publisher
	r.GET("/publisher", controller.GetAllPublisher)
	r.GET("/publisher/:id", controller.GetPublisherByID)
	r.POST("/publisher", controller.CreatePublisher)
	r.PATCH("/publisher", controller.UpdatePublisher)
	r.DELETE("/publisher/:id", controller.DeletePublisher)
	//bookPurchasing
	r.GET("/bookPurchasing", controller.GetAllBookPurchasing)
	r.GET("/bookPurchasing/:id", controller.GetBookPurchasingByID)
	r.POST("/bookPurchasing", controller.CreateBookPurchasing)
	r.PATCH("/bookPurchasing", controller.UpdateBookPurchasing)
	r.DELETE("/bookPurchasing/:id", controller.DeleteBookPurchasing)

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

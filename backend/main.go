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
	//EquipmentPurchasing
	r.GET("/equipmentPurchasing", controller.GetAllEquipmentPurchasing)
	r.GET("/equipmentPurchasing/:id", controller.GetEquipmentPurchasingByID)
	r.POST("/equipmentPurchasing", controller.CreateEquipmentPurchasing)
	r.PATCH("/equipmentPurchasing", controller.UpdateEquipmentPurchasing)
	r.DELETE("/equipmentPurchasing/:id", controller.DeleteEquipmentPurchasing)

	//Company
	r.GET("/company", controller.GetAllCompany)
	r.GET("/company/:id", controller.GetcompanyByID)
	r.POST("/company", controller.CreateCompany)
	r.PATCH("/company", controller.UpdateCompany)
	r.DELETE("/company/:id", controller.DeleteCompany)

	//EquipmentCategory
	r.GET("/equipmentCategory", controller.GetAllEquipmentCategory)
	r.GET("/equipmentCategory/:id", controller.GetEquipmentCategoryByID)
	r.POST("/equipmentCategory", controller.CreatEquipmentCategory)
	r.PATCH("/equipmentCategory", controller.UpdateEquipmentCategory)
	r.DELETE("/equipmentCategory/:id", controller.DeleteEquipmentCategory)

	//
	//------ BorrowBook System ------//
	// User
	r.GET("/users", controller.ListUsers)
	r.GET("/users/:id", controller.GetUser)
	r.POST("/users", controller.CreateUser)
	r.PATCH("/users", controller.UpdateUser)
	r.DELETE("/users/:id", controller.DeleteUser)
	// BorrowBook
	r.GET("/borrow_books", controller.GetAllBorrowBook)
	r.GET("/borrow_books/:id", controller.GetBorrowBookByID)
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
	r.GET("/return_books", controller.GetAllReturnBook)
	r.GET("/return_books/:id", controller.GetReturnBookByID)
	r.POST("/return_books", controller.CreateReturnBook)
	r.PATCH("/return_books", controller.UpdateReturnBook)
	r.DELETE("/return_books/:id", controller.DeleteReturnBook)

	//----------Borrow & Return Equipment & equipment status----
	// BorrowEquipment
	r.GET("/borrowEquipment", controller.GetAllBorrowEquipment)
	r.GET("/borrowEquipment/:id", controller.GetBorrowEquipmentByID)
	r.POST("/borrowEquipment", controller.CreateBorrowEquipment)
	r.PATCH("/borrowEquipment", controller.UpdateBorrowEquipment)
	r.DELETE("/borrowEquipment/:id", controller.DeleteBorrowEquipment)

	// equipment status
	r.GET("/equipment_statuses", controller.ListEquipmentStatuses)
	r.GET("/equipment_status/:id", controller.GetEquipmentStatus)
	r.POST("/equipment_statuses", controller.CreateEquipmentStatus)
	r.PATCH("/equipment_statuses", controller.UpdateEquipmentStatus)
	r.DELETE("/equipment_statuses/:id", controller.DeleteEquipmentStatus)

	// ReturnEquipment
	r.GET("/returnEquipment", controller.GetAllReturnEquipment)
	r.GET("/returnEquipment/:id", controller.GetReturnEquipmentByID)
	r.POST("/returnEquipment", controller.CreateReturnEquipment)
	r.PATCH("/returnEquipment", controller.UpdateReturnEquipment)
	r.DELETE("/returnEquipment/:id", controller.DeleteReturnEquipment)

	//BookCategory
	r.GET("/bookCategory", controller.GetAllBookCategory)
	r.GET("/bookCategory/:id", controller.GetBookCategoryByID)
	r.POST("/bookCategory", controller.CreateBookCategory)
	r.PATCH("/bookCategory", controller.UpdateBookCategory)
	r.DELETE("/bookCategory/:id", controller.DeleteBookCategory)

	//--- Receiver ---
	r.GET("/receiver", controller.GetAllReceiver)
	r.GET("/receiver/:id", controller.GetReceiverByID)
	r.POST("/receiver", controller.CreateReceiver)
	r.PATCH("/receiver", controller.UpdateReceiver)
	r.DELETE("/receiver/:id", controller.DeleteReceiver)

	//--- มะปราง ----
	//--- Confirmation ---
	r.GET("/confirmation", controller.ListConfirmations)
	r.GET("/confirmation/:id", controller.GetConfirmation)
	r.POST("/confirmation", controller.CreateConfirmation)
	r.PATCH("/confirmation", controller.UpdateConfirmation)
	r.DELETE("/confirmation/:id", controller.DeleteConfirmation)
	//--- Preorder ---
	r.GET("/preorder", controller.ListPreorders)
	r.GET("/preorder/:id", controller.GetPreorder)
	r.POST("/preorder", controller.CreatePreorder)
	r.PATCH("/preorder", controller.UpdatePreorder)
	r.DELETE("/preorder/:id", controller.DeletePreorder)

	//------ Forfeit ------//
	// Payment
	r.GET("/payment", controller.GetAllPayment)
	r.GET("/payment/:id", controller.GetPaymentByID)
	r.POST("/payment", controller.CreatePayment)
	r.PATCH("/payment", controller.UpdatePayment)
	r.DELETE("/payment/:id", controller.DeletePayment)

	// Forfeit
	r.GET("/forfeit", controller.ListForfeits)
	r.GET("/forfeit/:id", controller.GetForfeit)
	r.POST("/forfeit", controller.CreateForfeit)
	r.PATCH("/forfeit", controller.UpdateForfeit)
	r.DELETE("/forfeit/:id", controller.DeleteForfeit)

	//------ Introduce ------//
	// Objective
	r.GET("/objective", controller.GetAllObjective)
	r.GET("/objective/:id", controller.GetObjectiveByID)
	r.POST("/objective", controller.CreateObjective)
	r.PATCH("/objective", controller.UpdateObjective)
	r.DELETE("/objective/:id", controller.DeleteObjective)

	// BookType
	r.GET("/objective", controller.GetAllBookType)
	r.GET("/objective/:id", controller.GetBookTypeByID)
	r.POST("/objective", controller.CreateBookType)
	r.PATCH("/objective", controller.UpdateBookType)
	r.DELETE("/objective/:id", controller.DeleteBookType)

	// Introduce
	r.GET("/introduce", controller.ListIntroduces)
	r.GET("/introduce/:id", controller.GetIntroduce)
	r.POST("/introduce", controller.CreateIntroduce)
	r.PATCH("/introduce", controller.UpdateIntroduce)
	r.DELETE("/introduce/:id", controller.DeleteIntroduce)

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

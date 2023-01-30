package main

import (
	"github.com/gin-gonic/gin"
	"github.com/team04/controller"
	"github.com/team04/entity"
	"github.com/team04/middlewares"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes()) //บล็อคการดึงข้อมูล
		{

			//------ BookPurchasing System ------//
			//bookPurchasing
			protected.GET("/bookPurchasing", controller.GetAllBookPurchasing)
			protected.GET("/bookPurchasing/:id", controller.GetBookPurchasingByID)
			protected.POST("/bookPurchasingCreate", controller.CreateBookPurchasing)
			protected.PATCH("/bookPurchasing", controller.UpdateBookPurchasing)
			protected.DELETE("/bookPurchasing/:id", controller.DeleteBookPurchasing)
			//publisher
			protected.GET("/publisher", controller.GetAllPublisher)
			protected.GET("/publisher/:id", controller.GetPublisherByID)
			protected.POST("/publisher", controller.CreatePublisher)
			protected.PATCH("/publisher", controller.UpdatePublisher)
			protected.DELETE("/publisher/:id", controller.DeletePublisher)
			//Librarian
			protected.GET("/librarian", controller.GetAllLibrarian)
			protected.GET("/librarian/:id", controller.GetLibrarianByID)
			protected.POST("/librarian", controller.CreateLibrarian)
			protected.PATCH("/librarian", controller.UpdateLibrarian)
			protected.DELETE("/librarian/:id", controller.DeleteLibrarian)

			// //------ EquipmentPurchasing System ------//
			//EquipmentPurchasing
			protected.GET("/equipmentPurchasing", controller.GetAllEquipmentPurchasing)
			protected.GET("/equipmentPurchasing/:id", controller.GetEquipmentPurchasingByID)
			protected.POST("/equipmentPurchasingCreate", controller.CreateEquipmentPurchasing)
			protected.PATCH("/equipmentPurchasing", controller.UpdateEquipmentPurchasing)
			protected.DELETE("/equipmentPurchasing/:id", controller.DeleteEquipmentPurchasing)

			//Company
			protected.GET("/company", controller.GetAllCompany)
			protected.GET("/company/:id", controller.GetcompanyByID)
			protected.POST("/company", controller.CreateCompany)
			protected.PATCH("/company", controller.UpdateCompany)
			protected.DELETE("/company/:id", controller.DeleteCompany)

			//EquipmentCategory
			protected.GET("/equipmentCategory", controller.GetAllEquipmentCategory)
			protected.GET("/equipmentCategory/:id", controller.GetEquipmentCategoryByID)
			protected.POST("/equipmentCategory", controller.CreatEquipmentCategory)
			protected.PATCH("/equipmentCategory", controller.UpdateEquipmentCategory)
			protected.DELETE("/equipmentCategory/:id", controller.DeleteEquipmentCategory)

			//
			//------ BorrowBook System ------//
			// User
			protected.GET("/users", controller.ListUsers)
			protected.GET("/users/:id", controller.GetUser)
			protected.POST("/users", controller.CreateUser)
			protected.PATCH("/users", controller.UpdateUser)
			protected.DELETE("/users/:id", controller.DeleteUser)
			// BorrowBook
			protected.GET("/borrow_books", controller.GetAllBorrowBook)
			protected.GET("/borrow_books/:id", controller.GetBorrowBookByID)
			protected.POST("/borrow_books", controller.CreateBorrowBook)
			protected.PATCH("/borrow_books", controller.UpdateBorrowBook)
			protected.DELETE("/borrow_books/:id", controller.DeleteBorrowBook)
			protected.GET("/BorrowBookForTrackingCheck", controller.ListBorrowBookForTrackingCheck) // เช็คการยืม

			//
			//------ ReturnBook System ------//
			// LostBook
			protected.GET("/lost_books", controller.ListLostBooks)
			protected.GET("/lost_books/:id", controller.GetLostBook)
			protected.POST("/lost_books", controller.CreateLostBook)
			protected.PATCH("/lost_books", controller.UpdateLostBook)
			protected.DELETE("/lost_books/:id", controller.DeleteLostBook)
			// ReturnBook
			protected.GET("/return_books", controller.GetAllReturnBook)
			protected.GET("/return_books/:id", controller.GetReturnBookByID)
			protected.POST("/return_books", controller.CreateReturnBook)
			protected.PATCH("/return_books", controller.UpdateReturnBook)
			protected.DELETE("/return_books/:id", controller.DeleteReturnBook)

			//----------Borrow & Return Equipment & equipment status----
			// BorrowEquipment
			protected.GET("/borrowEquipment", controller.GetAllBorrowEquipment)
			protected.GET("/borrowEquipment/:id", controller.GetBorrowEquipmentByID)
			protected.POST("/borrowEquipment", controller.CreateBorrowEquipment)
			protected.PATCH("/borrowEquipment", controller.UpdateBorrowEquipment)
			protected.DELETE("/borrowEquipment/:id", controller.DeleteBorrowEquipment)

			// equipment status
			protected.GET("/equipment_statuses", controller.ListEquipmentStatuses)
			protected.GET("/equipment_status/:id", controller.GetEquipmentStatus)
			protected.POST("/equipment_statuses", controller.CreateEquipmentStatus)
			protected.PATCH("/equipment_statuses", controller.UpdateEquipmentStatus)
			protected.DELETE("/equipment_statuses/:id", controller.DeleteEquipmentStatus)

			// ReturnEquipment
			protected.GET("/returnEquipment", controller.GetAllReturnEquipment)
			protected.GET("/returnEquipment/:id", controller.GetReturnEquipmentByID)
			protected.POST("/returnEquipment", controller.CreateReturnEquipment)
			protected.PATCH("/returnEquipment", controller.UpdateReturnEquipment)
			protected.DELETE("/returnEquipment/:id", controller.DeleteReturnEquipment)

			//BookCategory
			protected.GET("/bookCategory", controller.GetAllBookCategory)
			protected.GET("/bookCategory/:id", controller.GetBookCategoryByID)
			protected.POST("/bookCategory", controller.CreateBookCategory)
			protected.PATCH("/bookCategory", controller.UpdateBookCategory)
			protected.DELETE("/bookCategory/:id", controller.DeleteBookCategory)

			//--- Receiver ---
			protected.GET("/receiver", controller.GetAllReceiver)
			protected.GET("/receiver/:id", controller.GetReceiverByID)
			protected.POST("/receiver", controller.CreateReceiver)
			protected.PATCH("/receiver", controller.UpdateReceiver)
			protected.DELETE("/receiver/:id", controller.DeleteReceiver)

			//--- มะปราง ----
			//--- Confirmation ---
			protected.GET("/confirmation", controller.ListConfirmations)
			protected.GET("/confirmation/:id", controller.GetConfirmation)
			protected.POST("/confirmation", controller.CreateConfirmation)
			protected.PATCH("/confirmation", controller.UpdateConfirmation)
			protected.DELETE("/confirmation/:id", controller.DeleteConfirmation)
			//--- Preorder ---
			protected.GET("/preorder", controller.ListPreorders)
			protected.GET("/preorder/:id", controller.GetPreorder)
			protected.POST("/preorder", controller.CreatePreorder)
			protected.PATCH("/preorder", controller.UpdatePreorder)
			protected.DELETE("/preorder/:id", controller.DeletePreorder)

			//------ Forfeit ------//
			// Payment
			protected.GET("/payment", controller.GetAllPayment)
			protected.GET("/payment/:id", controller.GetPaymentByID)
			protected.POST("/payment", controller.CreatePayment)
			protected.PATCH("/payment", controller.UpdatePayment)
			protected.DELETE("/payment/:id", controller.DeletePayment)

			// Forfeit
			protected.GET("/forfeit", controller.ListForfeits)
			protected.GET("/forfeit/:id", controller.GetForfeit)
			protected.POST("/forfeit", controller.CreateForfeit)
			protected.PATCH("/forfeit", controller.UpdateForfeit)
			protected.DELETE("/forfeit/:id", controller.DeleteForfeit)

			//------ Introduce ------//
			// Objective
			protected.GET("/objective", controller.GetAllObjective)
			protected.GET("/objective/:id", controller.GetObjectiveByID)
			protected.POST("/objective", controller.CreateObjective)
			protected.PATCH("/objective", controller.UpdateObjective)
			protected.DELETE("/objective/:id", controller.DeleteObjective)

			// BookType
			protected.GET("/bookType", controller.GetAllBookType)
			protected.GET("/bookType/:id", controller.GetBookTypeByID)
			protected.POST("/bookType", controller.CreateBookType)
			protected.PATCH("/bookType", controller.UpdateBookType)
			protected.DELETE("/bookType/:id", controller.DeleteBookType)

			// Introduce
			protected.GET("/introduce", controller.ListIntroduces)
			protected.GET("/introduce/:id", controller.GetIntroduce)
			protected.POST("/introduce", controller.CreateIntroduce)
			protected.PATCH("/introduce", controller.UpdateIntroduce)
			protected.DELETE("/introduce/:id", controller.DeleteIntroduce)

			//--- ขนุน ----
			//--- Level ---
			protected.GET("/level", controller.GetAllLevel)
			protected.GET("/level/:id", controller.GetLevelByID)
			protected.POST("/level", controller.CreateLevel)
			protected.PATCH("/level", controller.UpdateLevel)
			protected.DELETE("/level/:id", controller.DeleteLevel)

			//--- ขนุน ----
			//--- BookRepair ---
			protected.GET("/bookrepair", controller.GetAllBookRepair)
			protected.GET("/bookrepair/:id", controller.GetBookRepairByID)
			protected.POST("/bookrepair", controller.CreateBookRepair)
			protected.PATCH("/bookrepair", controller.UpdateBookRepair)
			protected.DELETE("/bookrepair/:id", controller.DeleteBookRepair)

			//--- ขนุน ----
			//--- EquipmentRepair ---
			protected.GET("/equipmentrepair", controller.GetAllEquipmentRepair)
			protected.GET("/equipmentrepair/:id", controller.GetEquipmentRepairByID)
			protected.POST("/equipmentrepair", controller.CreateEquipmentRepair)
			protected.PATCH("/equipmentrepair", controller.UpdateEquipmentRepair)
			protected.DELETE("/equipmentrepair/:id", controller.DeleteEquipmentRepair)

		}
	}

	// Authentication Routes
	r.POST("/loginUsesr", controller.LoginUser)
	r.POST("/loginLibrarian", controller.LoginLibrarian)
	r.GET("T", controller.ListUsers)

	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT,DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

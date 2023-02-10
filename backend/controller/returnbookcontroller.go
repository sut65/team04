package controller

import (
	"fmt"
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /return_books
func CreateReturnBook(c *gin.Context) { // c รับข้อมูลมาจาก api
	var returnbook entity.ReturnBook //การประกาศตัวแปรให้เป็นไทป์ที่เราสร้างขึ้นเอง
	var lostbook entity.LostBook
	var borrowbook entity.BorrowBook
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 9 จะถูก bind เข้าตัวแปร returnbook
	if err := c.ShouldBindJSON(&returnbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา Lostbook ด้วย id
	if tx := entity.DB().Where("id = ?",
		returnbook.LostBookID).First(&lostbook); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "lostbook not found"})
		return
	}

	// : ค้นหา Borrowbook ด้วย id
	if tx := entity.DB().Where("id = ?",
		returnbook.BorrowBookID).First(&borrowbook); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrowbook not found"})
		return
	}

	// 11: อัพเดทคอลัมน์ TrackingCheck ว่าการคืนหนังสือถูกประเมินแล้ว
	if tx := entity.DB().Model(&borrowbook).Update("TrackingCheck", true); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrowbook not found"})
		return
	}

	// : ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?",
		returnbook.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	localtime := returnbook.Current_Day.Local()
	// : สร้าง ReturnBook
	ps := entity.ReturnBook{
		LostBook:       lostbook,                  // โยงความสัมพันธ์กับ Entity LostBook
		Librarian:      librarian,                 // โยงความสัมพันธ์กับ Entity Librarian
		BorrowBook:     borrowbook,                // โยงความสัมพันธ์กับ Entity BorrowBook
		Current_Day:    localtime,                 // ตั้งค่าฟิลด์ Current_Day
		Late_Number:    returnbook.Late_Number,    // ตั้งค่าฟิลด์ Late_Number
		Book_Condition: returnbook.Book_Condition, // ตั้งค่าฟิลด์ Book_Condition
		ForfeitCheck:   false,
	}
	// Validation
	if _, err := govalidator.ValidateStruct(returnbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ps}) //ส่ง ps กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET /return_books
func GetAllReturnBook(c *gin.Context) {
	var returnbook []entity.ReturnBook
	if err := entity.DB().Model(&entity.ReturnBook{}).Preload("BorrowBook.User").Preload("BorrowBook").Preload("BorrowBook.BookPurchasing").Preload("BorrowBook.BookPurchasing.BookCategory").Preload("LostBook").Preload("Librarian").Find(&returnbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnbook})
}

// GET /return_books/:id
func GetReturnBookByID(c *gin.Context) {
	var returnbook entity.ReturnBook
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /return_books/:id
	if err := entity.DB().Model(&entity.ReturnBook{}).Where("ID = ?", Id).Preload("BorrowBook.User").Preload("BorrowBook").Preload("BorrowBook.BookPurchasing").Preload("BorrowBook.BookPurchasing.BookCategory").Preload("LostBook").Preload("Librarian").Find(&returnbook); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("BookPurchasingID :  Id%s not found.", Id)})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnbook})
}

// PATCH /return_book
func UpdateReturnBook(c *gin.Context) {
	var returnbook entity.ReturnBook
	if err := c.ShouldBindJSON(&returnbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", returnbook.ID).First(&entity.ReturnBook{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "returnbook not found"}) //เช็คว่ามีไอดีอยู่ในดาต้าเบสมั้ย
		return
	}
	// Validation
	if _, err := govalidator.ValidateStruct(returnbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Save(&returnbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnbook})
}

// DELETE /return_books/:id
func DeleteReturnBook(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM return_books WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "returnbook not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

func ListReturnBookNoForfeitCheck(c *gin.Context) {

	var returnBook []entity.ReturnBook
	Id := c.Param("id")
	if err := entity.DB().Model(&entity.ReturnBook{}).Where("ID = ?", Id).Preload("BorrowBook.User").Preload("BorrowBook").Preload("BorrowBook.BookPurchasing").Preload("BorrowBook.BookPurchasing.BookCategory").Preload("LostBook").Preload("Librarian").Raw("SELECT * FROM return_books where forfeit_check = false").Find(&returnBook).Error; err != nil {

		//Preload เหมือนจอยตาราง จอยตารางpatient
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnBook})
}

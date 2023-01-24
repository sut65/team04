package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /return_books
func CreateReturnBook(c *gin.Context) {
	var returnbook entity.ReturnBook
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Lostbook not found"})
		return
	}

	// : ค้นหา Borrowbook ด้วย id
	if tx := entity.DB().Where("id = ?",
		returnbook.BorrowBookID).First(&borrowbook); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Borrowbook not found"})
		return
	}

	// : ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?",
		returnbook.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// : สร้าง ReturnBook
	ps := entity.ReturnBook{
		LostBook:       lostbook,                  // โยงความสัมพันธ์กับ Entity LostBook
		Librarian:      librarian,                 // โยงความสัมพันธ์กับ Entity Librarian
		BorrowBook:     borrowbook,                // โยงความสัมพันธ์กับ Entity BorrowBook
		Current_Day:    returnbook.Current_Day,    // ตั้งค่าฟิลด์ Current_Day
		Late_Number:    returnbook.Late_Number,    // ตั้งค่าฟิลด์ Late_Number
		Book_Condition: returnbook.Book_Condition, // ตั้งค่าฟิลด์ Book_Condition
	}

	// : บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ps})
}

// GET /return_books/:id
func GetReturnBook(c *gin.Context) {
	var returnbook entity.ReturnBook
	id := c.Param("id")
	if err := entity.DB().Preload("BorrowBook.User").Preload("BorrowBook").Preload("LostBook").Preload("Librarian").Raw("SELECT * FROM return_books WHERE id = ?", id).Find(&returnbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnbook})
}

// GET /return_books
func ListReturnBooks(c *gin.Context) {
	var Returnbooks []entity.ReturnBook
	if err := entity.DB().Preload("BorrowBook.User").Preload("BorrowBook").Preload("LostBook").Preload("Librarian").Raw("SELECT * FROM return_books").Find(&Returnbooks).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": Returnbooks})
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

// PATCH /return_book
func UpdateReturnBook(c *gin.Context) {
	var returnbook entity.ReturnBook
	if err := c.ShouldBindJSON(&returnbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", returnbook.ID).First(&returnbook); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Returnbook not found"})
		return
	}
	if err := entity.DB().Save(&returnbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnbook})
}

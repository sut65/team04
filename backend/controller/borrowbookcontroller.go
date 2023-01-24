package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /borrow_books
func CreateBorrowBook(c *gin.Context) {
	var borrowbook entity.BorrowBook
	var user entity.User
	var bookpurchasing entity.BookPurchasing
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 9 จะถูก bind เข้าตัวแปร borrowbook
	if err := c.ShouldBindJSON(&borrowbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// : ค้นหา Bookpurchasing ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.BookPurchasingID).First(&bookpurchasing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bookpurchasing not found"})
		return
	}

	// : ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// : สร้าง BorrowBook
	ps := entity.BorrowBook{
		User:           user,                      // โยงความสัมพันธ์กับ Entity User
		BookPurchasing: bookpurchasing,            // โยงความสัมพันธ์กับ Entity BookPurchasing
		Librarian:      librarian,                 // โยงความสัมพันธ์กับ Entity Librarian
		Borb_Day:       borrowbook.Borb_Day,       // ตั้งค่าฟิลด์ Borb_Day
		Return_Day:     borrowbook.Return_Day,     // ตั้งค่าฟิลด์ Return_Day
		Color_Bar:      borrowbook.Color_Bar,      // ตั้งค่าฟิลด์ Color_Bar
		Borb_Frequency: borrowbook.Borb_Frequency, // ตั้งค่าฟิลด์ Borb_Frequency
	}

	// : บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ps})
}

// GET /borrow_books/:id
func GetBorrowBook(c *gin.Context) {
	var borrowbook entity.BorrowBook
	id := c.Param("id")
	if err := entity.DB().Preload("User").Preload("BookPurchasing").Preload("Librarian").Raw("SELECT * FROM borrow_books WHERE id = ?", id).Find(&borrowbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowbook})
}

// GET /borrow_books
func ListBorrowBooks(c *gin.Context) {
	var Borrowbooks []entity.BorrowBook
	if err := entity.DB().Preload("User").Preload("BookPurchasing").Preload("Librarian").Raw("SELECT * FROM borrow_books").Find(&Borrowbooks).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": Borrowbooks})
}

// DELETE /borrow_books/:id
func DeleteBorrowBook(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM borrow_books WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrowbook not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /borrow_books
func UpdateBorrowBook(c *gin.Context) {
	var borrowbook entity.BorrowBook
	if err := c.ShouldBindJSON(&borrowbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", borrowbook.ID).First(&borrowbook); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Borrowbook not found"})
		return
	}
	if err := entity.DB().Save(&borrowbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowbook})
}

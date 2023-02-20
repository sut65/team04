package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /borrow_books
func CreateBorrowBook(c *gin.Context) {
	var borrowbook entity.BorrowBook
	var user entity.User
	var bookpurchasing entity.BookPurchasing
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร borrowbook
	if err := c.ShouldBindJSON(&borrowbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// 10: ค้นหา Bookpurchasing ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.BookPurchasingID).First(&bookpurchasing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookpurchasing not found"})
		return
	}

	// 11: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// เเก้เวลาให้เป็น UTC +7.00
	localtime1 := borrowbook.Borb_Day.Local()
	localtime2 := borrowbook.Return_Day.Local()

	// 12: สร้าง BorrowBook
	ps := entity.BorrowBook{
		User:           user,                      // โยงความสัมพันธ์กับ Entity User
		BookPurchasing: bookpurchasing,            // โยงความสัมพันธ์กับ Entity BookPurchasing
		Librarian:      librarian,                 // โยงความสัมพันธ์กับ Entity Librarian
		Borb_Day:       localtime1,                // ตั้งค่าฟิลด์ Borb_Day
		Return_Day:     localtime2,                // ตั้งค่าฟิลด์ Return_Day
		Color_Bar:      borrowbook.Color_Bar,      // ตั้งค่าฟิลด์ Color_Bar
		Borb_Frequency: borrowbook.Borb_Frequency, // ตั้งค่าฟิลด์ Borb_Frequency
		TrackingCheck:  false,                     // สำหรับ returnbook system
	}

	// Validation
	if _, err := govalidator.ValidateStruct(borrowbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ps}) //ส่ง ps กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET /borrow_books
func GetAllBorrowBook(c *gin.Context) {
	var borrowbook []entity.BorrowBook
	if err := entity.DB().Model(&entity.BorrowBook{}).Preload("User").Preload("BookPurchasing").Preload("BookPurchasing.BookCategory").Preload("Librarian").Find(&borrowbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowbook})
}

// GET /borrow_books/:id
func GetBorrowBookByID(c *gin.Context) {
	var borrowbook []entity.BorrowBook
	if err := entity.DB().Model(&entity.BorrowBook{}).Preload("User").Preload("BookPurchasing").Preload("BookPurchasing.BookCategory").Preload("Librarian").Find(&borrowbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowbook})
}

// PATCH /borrow_books
func UpdateBorrowBook(c *gin.Context) {
	var borrowbook entity.BorrowBook
	var user entity.User
	var bookpurchasing entity.BookPurchasing
	var librarian entity.Librarian

	if err := c.ShouldBindJSON(&borrowbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", borrowbook.ID).First(&entity.BorrowBook{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrowbook not found"}) //เช็คว่ามีไอดีอยู่ในดาต้าเบสมั้ย
		return
	}
	// 9: ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	// 10: ค้นหา Bookpurchasing ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.BookPurchasingID).First(&bookpurchasing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookpurchasing not found"})
		return
	}
	// 11: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?",
		borrowbook.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}
	// Validation
	if _, err := govalidator.ValidateStruct(borrowbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เเก้เวลาให้เป็น UTC +7.00
	borrowbook.Borb_Day = borrowbook.Borb_Day.Local()
	borrowbook.Return_Day = borrowbook.Return_Day.Local()

	// อัพเดต
	if err := entity.DB().Save(&borrowbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowbook})
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

func ListBorrowBookForTrackingCheck(c *gin.Context) {
	var borrowbook []entity.BorrowBook
	if err := entity.DB().Model(&entity.BorrowBook{}).Preload("User").Preload("BookPurchasing").Preload("BookPurchasing.BookCategory").Preload("Librarian").Raw("SELECT * FROM borrow_books where tracking_check = false").Find(&borrowbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowbook})
}

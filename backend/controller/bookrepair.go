package controller

import (
	"fmt"
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

func CreateBookRepair(c *gin.Context) { // c รับข้อมูลมาจาก api

	var bookrepair entity.BookRepair
	var bookpurchasing entity.BookPurchasing
	var level entity.Level
	var librarian entity.Librarian

	//ผลลัพทธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปล bookrepair
	if err := c.ShouldBindJSON(&bookrepair); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} //การบาย

	//9: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", bookrepair.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	//10: ค้นหา bookpurchasing ด้วย id
	if tx := entity.DB().Where("id = ?", bookrepair.BookPurchasingID).First(&bookpurchasing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookpurchasing not found"})
		return
	}

	//11: ค้นหา level ด้วย id
	if tx := entity.DB().Where("id = ?", bookrepair.LevelID).First(&level); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "level not found"})
		return
	}
	
	//12: สร้าง bookrepair
	br := entity.BookRepair{
		BookPurchasingID: bookrepair.BookPurchasingID,
		LevelID:          bookrepair.LevelID,
		Date:             bookrepair.Date.Local(),
		Note:             bookrepair.Note,
		LibrarianID:      bookrepair.LibrarianID,
	}

	//Validate
	if _, err := govalidator.ValidateStruct(bookrepair); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//13: บันทึก
	if err := entity.DB().Create(&br).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": br}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET bookRepair
func GetAllBookRepair(c *gin.Context) {

	var bookrepair []entity.BookRepair

	if err := entity.DB().Model(&entity.BookRepair{}).Preload("BookPurchasing").Preload("Level").Preload("Librarian").Find(&bookrepair).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookrepair})
}

// GET bookRepair By ID
func GetBookRepairByID(c *gin.Context) {

	var bookrepair entity.BookRepair

	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /bookRepair/:id
	if err := entity.DB().Model(&entity.BookRepair{}).Where("ID = ?", Id).Preload("BookPurchasing").Preload("Level").Preload("Librarian").Find(&bookrepair); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("BookRepairID :  Id%s not found.", Id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookrepair})
}

// PATCH /bookrepair
func UpdateBookRepair(c *gin.Context) {
	var bookrepair entity.BookRepair

	if err := c.ShouldBindJSON(&bookrepair); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", bookrepair.ID).First(&entity.BookRepair{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookrepair not found"}) //เช็คว่ามีไอดีอยู่ในดาต้าเบสมั้ย
		return
	}
	if _, err := govalidator.ValidateStruct(bookrepair); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bookrepair.Date = bookrepair.Date.Local()

	if err := entity.DB().Save(&bookrepair).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookrepair})
}

// DELETE bookRepair By id
func DeleteBookRepair(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.BookRepair{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookrepair ID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("BookRepairID :  Id%s deleted.", Id)})
}

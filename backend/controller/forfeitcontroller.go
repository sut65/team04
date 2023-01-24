package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /forfeit
func CreateForfeit(c *gin.Context) {

	var forfeit entity.Forfeit

	var returnBook entity.ReturnBook
	var payment entity.Payment
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 9 จะถูก bind เข้าตัวแปร forfeit
	if err := c.ShouldBindJSON(&forfeit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 10: ค้นหา returnBook ด้วย id
	if tx := entity.DB().Where("id = ?", forfeit.ReturnBookID).First(&returnBook); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "returnBook not found"})
		return
	}

	// 11: ค้นหา payment ด้วย id
	if tx := entity.DB().Where("id = ?", forfeit.PaymentID).First(&payment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment not found"})
		return
	}

	// 12: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", forfeit.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// 13: สร้าง Forfeit
	ff := entity.Forfeit{

		Pay:        forfeit.Pay,      // ตั้งค่าฟิลด์ Pay
		Pay_Date:   forfeit.Pay_Date, // ตั้งค่าฟิลด์ PnDate
		Note:       forfeit.Note,     // ตั้งค่าฟิลด์ Note
		ReturnBook: returnBook,       // โยงความสัมพันธ์กับ Entity ReturnBook
		Payment:    payment,          // โยงความสัมพันธ์กับ Entity Payment
		Librarian:  librarian,        // โยงความสัมพันธ์กับ Entity Librarian

	}

	// 14: บันทึก
	if err := entity.DB().Create(&ff).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ff})
}

// GET /forfeit/:id
func GetForfeit(c *gin.Context) {
	var forfeit entity.Forfeit
	id := c.Param("id")
	if err := entity.DB().Preload("ReturnBook.User").Preload("ReturnBook.LostBook").Preload("ReturnBook.Late_Number").Preload("ReturnBook").Preload("Payment").Preload("Librarian").Raw("SELECT * FROM forfeits WHERE id = ?", id).Find(&forfeit).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": forfeit})
}

// DELETE /forfeits/:id
func DeleteForfeit(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM forfeits WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "forfeit not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /forfeits
func UpdateForfeit(c *gin.Context) {
	var forfeit entity.Forfeit
	if err := c.ShouldBindJSON(&forfeit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", forfeit.ID).First(&forfeit); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "forfeit not found"})
		return
	}

	if err := entity.DB().Save(&forfeit).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": forfeit})
}

// GET /forfeits

func ListForfeits(c *gin.Context) {

	var forfeit []entity.Forfeit

	if err := entity.DB().Preload("ReturnBook.User").Preload("ReturnBook.LostBook").Preload("ReturnBook.Late_Number").Preload("ReturnBook").Preload("Payment").Preload("Librarian").Raw("SELECT * FROM forfeits").Find(&forfeit).Error; err != nil {

		//Preload เหมือนจอยตาราง
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": forfeit})

}

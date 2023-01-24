package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET bookPurchasing
func GetAllBookPurchasing(c *gin.Context) {

	var bookPurchasing []entity.BookPurchasing

	if err := entity.DB().Model(&entity.BookPurchasing{}).Scan(&bookPurchasing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookPurchasing})

}

// GET bookPurchasing By ID
func GetBookPurchasingByID(c *gin.Context) {

	var bookPurchasing entity.BookPurchasing
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /bookPurchasing/:id
	if err := entity.DB().Model(&entity.BookPurchasing{}).Where("ID = ?", Id).Scan(&bookPurchasing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookPurchasing})

}

// POST bookPurchasing
func CreateBookPurchasing(c *gin.Context) {
	var bookPurchasing entity.BookPurchasing

	if err := c.ShouldBindJSON(&bookPurchasing); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&bookPurchasing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bookPurchasing})
}

// PATCH /bookPurchasing
func UpdateBookPurchasing(c *gin.Context) {
	var bookPurchasing entity.BookPurchasing
	if err := c.ShouldBindJSON(&bookPurchasing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", bookPurchasing.ID).First(&entity.BookPurchasing{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
		return
	}

	if err := entity.DB().Model(&bookPurchasing).Update("Name", bookPurchasing.BookName).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookPurchasing})
}

// DELETE bookPurchasing By id
func DeleteBookPurchasing(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.BookPurchasing{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookPurchasing ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("BookPurchasingID :  %s deleted.", Id))
}

package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Receiver
func GetAllReceiver(c *gin.Context) {

	var receiver []entity.Receiver

	if err := entity.DB().Model(&entity.Receiver{}).Scan(&receiver).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": receiver})

}

// GET Receiver By ID
func GetReceiverByID(c *gin.Context) {

	var receiver entity.Receiver
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /payment/:id
	if err := entity.DB().Model(&entity.Receiver{}).Where("ID = ?", Id).Scan(&receiver).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": receiver})

}

// POST Receiver
func CreateReceiver(c *gin.Context) {
	var receiver entity.Receiver

	if err := c.ShouldBindJSON(&receiver); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&receiver).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": receiver})
}

// PATCH /Receiver
func UpdateReceiver(c *gin.Context) {
	var receiver entity.Receiver
	if err := c.ShouldBindJSON(&receiver); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", receiver.ID).First(&entity.Receiver{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Receiver not found"})
		return
	}

	if err := entity.DB().Model(&receiver).Update("Type", receiver.Type).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": receiver})
}

// DELETE Receiver By id
func DeleteReceiver(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Receiver{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Receiver ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("ReceiverID :  %s deleted.", Id))
}

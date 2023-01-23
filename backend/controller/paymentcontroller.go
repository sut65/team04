package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Payment
func GetAllPayment(c *gin.Context) {

	var payment []entity.Payment

	if err := entity.DB().Model(&entity.Payment{}).Scan(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment})

}

// GET Payment By ID
func GetPaymentByID(c *gin.Context) {

	var payment entity.Payment
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /payment/:id
	if err := entity.DB().Model(&entity.Payment{}).Where("ID = ?", Id).Scan(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment})

}

// POST Payment
func CreatePayment(c *gin.Context) {
	var payment entity.Payment

	if err := c.ShouldBindJSON(&payment); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": payment})
}

// PATCH /Payment
func UpdatePayment(c *gin.Context) {
	var payment entity.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", payment.ID).First(&entity.Payment{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment not found"})
		return
	}

	if err := entity.DB().Model(&payment).Update("Name", payment.Name).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment})
}

// DELETE Payment By id
func DeletePayment(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Payment{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payment ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("PaymentID :  %s deleted.", Id))
}

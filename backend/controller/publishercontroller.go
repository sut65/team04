package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Publisher
func GetAllPublisher(c *gin.Context) {

	var publisher []entity.Publisher

	if err := entity.DB().Model(&entity.Publisher{}).Scan(&publisher).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": publisher})

}

// GET Publisher By ID
func GetPublisherByID(c *gin.Context) {

	var publisher entity.Publisher
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /publisher/:id
	if err := entity.DB().Model(&entity.Publisher{}).Where("ID = ?", Id).Scan(&publisher).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": publisher})

}

// POST Publisher
func CreatePublisher(c *gin.Context) {
	var publisher entity.Publisher

	if err := c.ShouldBindJSON(&publisher); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&publisher).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": publisher})
}

// PATCH /Publisher
func UpdatePublisher(c *gin.Context) {
	var publisher entity.Publisher
	if err := c.ShouldBindJSON(&publisher); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", publisher.ID).First(&entity.Publisher{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
		return
	}

	if err := entity.DB().Model(&publisher).Update("Name", publisher.Name).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": publisher})
}

// DELETE Publisher By id
func DeletePublisher(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Publisher{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Publisher ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("PublisherID :  %s deleted.", Id))
}

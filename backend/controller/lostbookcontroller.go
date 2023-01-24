package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Lostbook
func GetAllLostbook(c *gin.Context) {

	var lostbook []entity.LostBook

	if err := entity.DB().Model(&entity.LostBook{}).Scan(&lostbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": lostbook})

}

// GET Lostbook By ID
func GetLostBookByID(c *gin.Context) {

	var lostbook entity.LostBook
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /lostbook/:id
	if err := entity.DB().Model(&entity.LostBook{}).Where("ID = ?", Id).Scan(&lostbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": lostbook})

}

// POST LostBook
func CreateLostBook(c *gin.Context) {
	var lostbook entity.LostBook

	if err := c.ShouldBindJSON(&lostbook); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&lostbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lostbook})
}

// PATCH /Lostbook
func UpdateLostBook(c *gin.Context) {
	var lostbook entity.LostBook
	if err := c.ShouldBindJSON(&lostbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", lostbook.ID).First(&entity.LostBook{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "lostbook not found"})
		return
	}

	if err := entity.DB().Model(&lostbook).Update("Name", lostbook.Name).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": lostbook})
}

// DELETE Lostbook By id
func DeleteLostBook(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.LostBook{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "lostbook ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("LostBookID :  %s deleted.", Id))
}

package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Level
func GetAllLevel(c *gin.Context) {
	var levels []entity.Level

	if err := entity.DB().Model(&entity.Level{}).Scan(&levels).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": levels})
}

// GET Level By ID
func GetLevelByID(c *gin.Context) {

	var level entity.Level

	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /level/:id
	if err := entity.DB().Model(&entity.Level{}).Where("ID = ?", Id).Scan(&level).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": level})
}

// POST Level
func CreateLevel(c *gin.Context) {
	var level entity.Level

	if err := c.ShouldBindJSON(&level); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&level).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": level})
}

// PATCH /Level
func UpdateLevel(c *gin.Context) {
	var level entity.Level
	if err := c.ShouldBindJSON(&level); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", level.ID).First(&level); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "company not found"})
		return
	}
	if err := entity.DB().Save(&level).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// if err := c.ShouldBindJSON(&level); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// if tx := entity.DB().Where("id = ?", level.ID).First(&entity.Level{}); tx.RowsAffected == 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "equipment status not found"})
	// 	return
	// }

	// if err := entity.DB().Model(&level).Update("Name", level.Name).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"data": level})
}

// DELETE Level By id
func DeleteLevel(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Level{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "level status ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("levelID :  %s deleted.", Id))
}
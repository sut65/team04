package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /objective
func CreateObjective(c *gin.Context) {
	var objective entity.Objective
	if err := c.ShouldBindJSON(&objective); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&objective).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": objective})
}

// GET /objective/:id
func GetObjectiveByID(c *gin.Context) {
	var objective entity.Objective

	id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /objective/:id
	if err := entity.DB().Model(&entity.Objective{}).Where("ID = ?", id).Scan(&objective).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": objective})
}

// GET /objective
func GetAllObjective(c *gin.Context) {
	var objective []entity.Objective
	if err := entity.DB().Model(&entity.Objective{}).Scan(&objective).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": objective})
}

// DELETE /objective/:id
func DeleteObjective(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Objective{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "objective ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("objectiveID :  %s deleted.", id))
}

// PATCH /objectives
func UpdateObjective(c *gin.Context) {
	var objective entity.BookType
	if err := c.ShouldBindJSON(&objective); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", objective.ID).First(&objective); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "objective not found"})
		return
	}

	if err := entity.DB().Save(&objective).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": objective})
}

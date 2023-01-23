package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Objective
func GetAllObjective(c *gin.Context) {

	var objective []entity.Objective

	if err := entity.DB().Model(&entity.Objective{}).Scan(&objective).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": objective})

}

// GET Objective By ID
func GetObjectiveByID(c *gin.Context) {

	var objective entity.Objective
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /objective/:id
	if err := entity.DB().Model(&entity.Objective{}).Where("ID = ?", Id).Scan(&objective).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": objective})

}

// POST Objective
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

// PATCH /Objective
func UpdateObjective(c *gin.Context) {
	var objective entity.Objective
	if err := c.ShouldBindJSON(&objective); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", objective.ID).First(&entity.Objective{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "objective not found"})
		return
	}

	if err := entity.DB().Model(&objective).Update("Name", objective.Name).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": objective})
}

// DELETE Objective By id
func DeleteObjective(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Objective{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Objective ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("ObjectiveID :  %s deleted.", Id))
}

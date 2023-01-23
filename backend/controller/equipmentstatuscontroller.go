package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET EquipmentStatus
func GetAllEquipmentStatus(c *gin.Context) {

	var equipmentstatus []entity.EquipmentStatus

	if err := entity.DB().Model(&entity.EquipmentStatus{}).Scan(&equipmentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentstatus})

}

// GET EquipmentStatus By ID
func GetEquipmentStatusID(c *gin.Context) {

	var equipmentstatus entity.EquipmentStatus
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /equipmentstatus/:id
	if err := entity.DB().Model(&entity.EquipmentStatus{}).Where("ID = ?", Id).Scan(&equipmentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentstatus})

}

// POST EquipmentStatus
func CreateEquipmentStatus(c *gin.Context) {
	var equipmentstatus entity.EquipmentStatus

	if err := c.ShouldBindJSON(&equipmentstatus); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&equipmentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": equipmentstatus})
}

// PATCH /EquipmentStatus
func UpdateEquipmentStatus(c *gin.Context) {
	var equipmentstatus entity.EquipmentStatus
	if err := c.ShouldBindJSON(&equipmentstatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", equipmentstatus.ID).First(&entity.EquipmentStatus{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipment status not found"})
		return
	}

	if err := entity.DB().Model(&equipmentstatus).Update("Name", equipmentstatus.Name).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentstatus})
}

// DELETE EquipmentStatus By id
func DeleteEquipmentStatus(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.EquipmentStatus{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipment status ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("equipmentstatusID :  %s deleted.", Id))
}

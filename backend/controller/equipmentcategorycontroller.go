package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Publisher
func GetAllEquipmentCategory(c *gin.Context) {

	var equipmentCategory []entity.EquipmentCategory

	if err := entity.DB().Model(&entity.EquipmentCategory{}).Scan(&equipmentCategory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentCategory})

}

// GET librarian By ID
func GetEquipmentCategoryByID(c *gin.Context) {

	var equipmentCategory entity.EquipmentCategory
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /equipmentCategory/:id
	if err := entity.DB().Model(&entity.EquipmentCategory{}).Where("ID = ?", Id).Scan(&equipmentCategory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentCategory})

}

// POST Publisher
func CreatEquipmentCategory(c *gin.Context) {
	var equipmentCategory entity.EquipmentCategory

	if err := c.ShouldBindJSON(&equipmentCategory); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&equipmentCategory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": equipmentCategory})
}

// PATCH /equipmentCategory
func UpdateEquipmentCategory(c *gin.Context) {
	var equipmentCategory entity.EquipmentCategory
	if err := c.ShouldBindJSON(&equipmentCategory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", equipmentCategory.ID).First(&equipmentCategory); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentCategory not found"})
		return
	}
	if err := entity.DB().Save(&equipmentCategory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentCategory})
}

// DELETE Librarian By id
func DeleteEquipmentCategory(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.EquipmentCategory{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentCategory ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("equipmentCategoryID :  %s deleted.", Id))
}

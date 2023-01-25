package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /equipment status
func CreateEquipmentStatus(c *gin.Context) {
	var equipmentstatus entity.EquipmentRepair

	if err := c.ShouldBindJSON(&equipmentstatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&equipmentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentstatus})
}

// GET /equipment status/:id
func GetEquipmentStatus(c *gin.Context) {
	var equipmentstatus entity.EquipmentStatus
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM equipment_statuses WHERE id = ?", id).Scan(&equipmentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentstatus})
}

// GET /equipment status
func ListEquipmentStatuses(c *gin.Context) {
	var equipmentstatuses []entity.EquipmentStatus

	if err := entity.DB().Raw("SELECT * FROM equipment_statuses").Scan(&equipmentstatuses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentstatuses})
}

// DELETE /equipment status/:id
func DeleteEquipmentStatus(c *gin.Context) {
	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM equipment_statuses WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipment statuses not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /equipment status
func UpdateEquipmentStatus(c *gin.Context) {
	var equipmentstatus entity.EquipmentStatus

	if err := c.ShouldBindJSON(&equipmentstatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", equipmentstatus.ID).First(&equipmentstatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipment statuses not found"})
		return
	}

	if err := entity.DB().Save(&equipmentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentstatus})
}

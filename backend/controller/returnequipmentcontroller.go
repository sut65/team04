package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /return_equipments
func CreateReturnEquipment(c *gin.Context) {
	var returnequipment entity.ReturnEquipment
	var equipmentstatus entity.EquipmentStatus
	var borrowequipment entity.BorrowEquipment
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 9 จะถูก bind เข้าตัวแปร returnequipment
	if err := c.ShouldBindJSON(&returnequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา equipmentstatus ด้วย id
	if tx := entity.DB().Where("id = ?",
		returnequipment.EquipmentStatusID).First(&equipmentstatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipment status not found"})
		return
	}

	// : ค้นหา borrow equipment ด้วย id
	if tx := entity.DB().Where("id = ?",
		returnequipment.BorrowEquipmentID).First(&borrowequipment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrow equipment not found"})
		return
	}

	// : ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?",
		returnequipment.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// : สร้าง return equipment
	ps := entity.ReturnEquipment{
		EquipmentStatus: equipmentstatus,               // โยงความสัมพันธ์กับ Entity EquipmentStatus
		Librarian:       librarian,                     // โยงความสัมพันธ์กับ Entity Librarian
		BorrowEquipment: borrowequipment,               // โยงความสัมพันธ์กับ Entity BorrowEquipment
		Return_Day:      returnequipment.Return_Day,    //ตั้งค่าฟิลด์ Return_Day
		Return_Detail:   returnequipment.Return_Detail, //ตั้งค่าฟิลด์ Return_Detail

	}

	// : บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ps})
}

// GET /return_equipments/:id
func GetReturnEquipment(c *gin.Context) {
	var returnequipment entity.ReturnEquipment
	id := c.Param("id")
	if err := entity.DB().Preload("BorrowEquipment.User").Preload("BorrowEquipment").Preload("EquipmentStatus").Preload("Librarian").Raw("SELECT * FROM return_equipments WHERE id = ?", id).Find(&returnequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnequipment})
}

// GET /return_equipments
func ListReturnEquipments(c *gin.Context) {
	var returnequipments []entity.ReturnEquipment
	if err := entity.DB().Preload("BorrowEquipment.User").Preload("BorrowEquipment").Preload("EquipmentStatus").Preload("Librarian").Raw("SELECT * FROM return_equipments").Find(&returnequipments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnequipments})
}

// DELETE /return_equipments/:id
func DeleteReturnEquipment(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM return_equipments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "returnequipment not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /return_equipments
func UpdateReturnEquipment(c *gin.Context) {
	var returnequipment entity.ReturnEquipment
	if err := c.ShouldBindJSON(&returnequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", returnequipment.ID).First(&returnequipment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "return equipment not found"})
		return
	}
	if err := entity.DB().Save(&returnequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": returnequipment})
}

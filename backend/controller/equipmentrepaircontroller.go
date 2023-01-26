package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

func CreateEquipmentRepair(c *gin.Context) { // c รับข้อมูลมาจาก api

	var equipmentrepair entity.EquipmentRepair
	var equipmentpurchasing entity.EquipmentPurchasing
	var level entity.Level
	var librarian entity.Librarian

	//ผลลัพทธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปล bookrepair
	if err := c.ShouldBindJSON(&equipmentrepair); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} //การบาย

	//9: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", equipmentrepair.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	//10: ค้นหา equipmentpurchasing ด้วย id
	if tx := entity.DB().Where("id = ?", equipmentrepair.EquipmentPurchasingID).First(&equipmentpurchasing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentpurchasing not found"})
		return
	}

	//11: ค้นหา level ด้วย id
	if tx := entity.DB().Where("id = ?", equipmentrepair.LevelID).First(&level); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "level not found"})
		return
	}

	//12: สร้าง equimentrepair
	er := entity.EquipmentRepair{
		EquipmentPurchasing:		equipmentpurchasing,
		Level: 						level,
		Date: 						equipmentrepair.Date,
		Librarian: 					librarian,
	}

	//13: บันทึก
	if err := entity.DB().Create(&er).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": er}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET bookRepair
func GetAllEquipmentRepair(c *gin.Context) {

	var equipmentRepair []entity.BookRepair

	if err := entity.DB().Model(&entity.EquipmentRepair{}).Preload("EquipmentPurchasing").Preload("Level").Preload("Librarian").Find(&equipmentRepair).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentRepair})
}

// GET equipmentRepair By ID
func GetEquipmentRepairByID(c *gin.Context) {

	var equipmentRepair entity.BookRepair

	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /equipmentRepair/:id
	if err := entity.DB().Model(&entity.EquipmentRepair{}).Where("ID = ?", Id).Preload("EquipmentPurchasing").Preload("Level").Preload("Librarian").Find(&equipmentRepair); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("EquipmentRepairID :  Id%s not found.", Id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentRepair})
}

// PATCH /equipmentPurchasing
func UpdateEquipmentRepair(c *gin.Context) {
	var equipmentRepair entity.EquipmentRepair

	if err := c.ShouldBindJSON(&equipmentRepair); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", equipmentRepair.ID).First(&entity.EquipmentRepair{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentRepair not found"}) //เช็คว่ามีไอดีอยู่ในดาต้าเบสมั้ย
		return
	}
	if err := entity.DB().Save(&equipmentRepair).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentRepair})
}

// DELETE bookRepair By id
func DeleteEquipmentRepair(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.EquipmentRepair{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentRepair ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("EquipmentRepairID :  Id%s deleted.", Id))
}
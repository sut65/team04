package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// return_equipments
func CreateReturnEquipment(c *gin.Context) { // c รับข้อมูลมาจาก api

	var returnequipment entity.ReturnEquipment //การประกาศตัวแปรให้เป็นไทป์ที่เราสร้างขึ้นเอง
	var equipmentstatus entity.EquipmentStatus
	var borrowequipment entity.BorrowEquipment
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 10 จะถูก bind เข้าตัวแปร returnequipment
	if err := c.ShouldBindJSON(&returnequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} //การบาย

	// 11: ค้นหา equipmentstatus ด้วย id
	if tx := entity.DB().Where("id = ?", returnequipment.EquipmentStatusID).First(&equipmentstatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipment status not found"})
		return
	}

	// 13: ค้นหา borrowequipment ด้วย id
	if tx := entity.DB().Where("id = ?", returnequipment.BorrowEquipmentID).First(&borrowequipment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrow equipment not found"})
		return
	}

	// 15: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", returnequipment.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// 17: สร้าง borrowequipment
	BP := entity.ReturnEquipment{
		EquipmentStatus: equipmentstatus,               // โยงความสัมพันธ์กับ Entity EquipmentStatus
		Librarian:       librarian,                     // โยงความสัมพันธ์กับ Entity Librarian
		BorrowEquipment: borrowequipment,               // โยงความสัมพันธ์กับ Entity BorrowEquipment
		Return_Day:      returnequipment.Return_Day,    //ตั้งค่าฟิลด์ Return_Day
		Return_Detail:   returnequipment.Return_Detail, //ตั้งค่าฟิลด์ Return_Detail

	}

	// 18: บันทึก
	if err := entity.DB().Create(&BP).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": BP}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET return_equipments
func GetAllReturnEquipment(c *gin.Context) {

	var returnequipment []entity.ReturnEquipment

	if err := entity.DB().Model(&entity.ReturnEquipment{}).Preload("BorrowEquipment.User").Preload("BorrowEquipment.EquipmentPurchasing").Preload("BorrowEquipment").Preload("EquipmentStatus").Preload("Librarian").Find(&returnequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": returnequipment})

}

// GET return_equipments By ID
func GetReturnEquipmentByID(c *gin.Context) {

	var returnequipment entity.ReturnEquipment
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /returnequipment/:id
	if err := entity.DB().Model(&entity.ReturnEquipment{}).Where("ID = ?", Id).Preload("BorrowEquipment.User").Preload("BorrowEquipment.EquipmentPurchasing").Preload("BorrowEquipment").Preload("EquipmentStatus").Preload("Librarian").Find(&returnequipment); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("ReturnEquipmentID :  Id%s not found.", Id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": returnequipment})

}

// PATCH /return_equipments
func UpdateReturnEquipment(c *gin.Context) {
	var returnequipment entity.ReturnEquipment

	if err := c.ShouldBindJSON(&returnequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", returnequipment.ID).First(&entity.ReturnEquipment{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "return equipment not found"}) //เช็คว่ามีไอดีอยู่ในดาต้าเบสมั้ย
		return
	}
	if err := entity.DB().Save(&returnequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": returnequipment})
}

// DELETE return_equipments By id
func DeleteReturnEquipment(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.ReturnEquipment{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "return equipment ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("ReturnEquipmentID :  %s deleted.", Id))
}

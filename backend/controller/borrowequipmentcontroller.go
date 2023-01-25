package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

func CreateBorrowEquipment(c *gin.Context) { // c รับข้อมูลมาจาก api

	var borrowequipment entity.BorrowEquipment //การประกาศตัวแปรให้เป็นไทป์ที่เราสร้างขึ้นเอง
	var librarian entity.Librarian
	var user entity.User
	var equipmentpurchasing entity.EquipmentPurchasing

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 10 จะถูก bind เข้าตัวแปร borrowequipment
	if err := c.ShouldBindJSON(&borrowequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} //การบาย

	// 11: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", borrowequipment.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// 13: ค้นหา equipmentpurchasing ด้วย id
	if tx := entity.DB().Where("id = ?", borrowequipment.EquipmentPurchasingID).First(&equipmentpurchasing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentpurchasing not found"})
		return
	}

	// 15: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", borrowequipment.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// 17: สร้าง borrowequipment
	BP := entity.BorrowEquipment{

		User:                   user,                                   // โยงความสัมพันธ์กับ Entity User
		EquipmentPurchasing:    equipmentpurchasing,                    // โยงความสัมพันธ์กับ Entity EquipmentPurchasing
		Amount_BorrowEquipment: borrowequipment.Amount_BorrowEquipment, // โยงความสัมพันธ์กับ Entity จำนวน
		BorrowEquipment_Day:    borrowequipment.BorrowEquipment_Day,    // โยงความสัมพันธ์กับ Entity วันเวลา
		Librarian:              librarian,                              // โยงความสัมพันธ์กับ Entity Librarian

	}

	// 18: บันทึก
	if err := entity.DB().Create(&BP).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": BP}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET borrowequipment
func GetAllBorrowEquipment(c *gin.Context) {

	var borrowequipment []entity.BorrowEquipment

	if err := entity.DB().Model(&entity.BorrowEquipment{}).Preload("Librarian").Find(&borrowequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": borrowequipment})

}

// GET borrowequipment By ID
func GetBorrowEquipmentByID(c *gin.Context) {

	var borrowequipment entity.BorrowEquipment
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /borrowequipment/:id
	if err := entity.DB().Model(&entity.BorrowEquipment{}).Where("ID = ?", Id).Preload("Librarian").Find(&borrowequipment); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("BorrowEquipmentID :  Id%s not found.", Id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": borrowequipment})

}

// PATCH /borrowequipment
func UpdateBorrowEquipment(c *gin.Context) {
	var borrowequipment entity.BorrowEquipment

	if err := c.ShouldBindJSON(&borrowequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", borrowequipment.ID).First(&entity.BorrowEquipment{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrow equipment not found"}) //เช็คว่ามีไอดีอยู่ในดาต้าเบสมั้ย
		return
	}
	if err := entity.DB().Save(&borrowequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": borrowequipment})
}

// DELETE borrowequipment By id
func DeleteBorrowEquipment(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.BorrowEquipment{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrow equipment ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("BorrowEquipmentID :  %s deleted.", Id))
}

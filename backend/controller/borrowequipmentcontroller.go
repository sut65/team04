package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /borrow_equipment
func CreateBorrowEquipment(c *gin.Context) {
	var borrowequipment entity.BorrowEquipment
	var equipment entity.EquipmentPurchasing
	var user entity.User
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร borrowequipment
	if err := c.ShouldBindJSON(&borrowequipment); err != nil { //เอาข้อมูลฝั่ง frontend มาเก็บไว้ที่ตัวแปรใน backend
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//  : ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", borrowequipment.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	//  : ค้นหา equipment ด้วย id เช็คว่ามี id ที่เราส่งมามีในตารางมั้ย

	if tx := entity.DB().Where("id = ?", borrowequipment.EquipmentPurchasingID).First(&equipment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipment not found"})
		return
	}

	//  : ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", borrowequipment.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// : สร้าง borrowequipment
	ps := entity.BorrowEquipment{ //object mี่จะเก็บข้อมูลของเรา
		User:                   user,                                   // โยงความสัมพันธ์กับ Entity user
		EquipmentPurchasing:    equipment,                              // โยงความสัมพันธ์กับ Entity EquipmentPurchasing
		BorrowEquipment_Day:    borrowequipment.BorrowEquipment_Day,    // ตั้งค่าฟิลด์ BorrowEquipment_Day
		Amount_BorrowEquipment: borrowequipment.Amount_BorrowEquipment, // ตั้งค่าฟิลด์ Amount_BorrowEquipment
		Librarian:              librarian,                              // โยงความสัมพันธ์กับ Entity librarian
	}

	//  : บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ps})

}

// GET /borrow_equipment/:id
func GetBorrowEquipment(c *gin.Context) { //get โดนส่งพารามิเตอร์
	var borrowequipment entity.BorrowEquipment
	id := c.Param("id") //เรียกค่าจากตัวแปรที่อยู่แบบ object ซ้อน object ที่เป็น FK กัน
	
	if err := entity.DB().Preload("EquipmentPurchasing").Preload("User").Preload("Librarian").Raw("SELECT * FROM borrow_equipments WHERE id = ?", id).Find(&borrowequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowequipment})
}

// GET /borrow_equipment ไม่มีเงื่อนไข ส่งไปทุก object
func ListBorrowEquipments(c *gin.Context) { //เอา object ไปเชื่อมกัน Preload คือ ดึง object ของ object
	var borrowequipments []entity.BorrowEquipment //ดึงมาทั้งหมด
	if err := entity.DB().Preload("EquipmentPurchasing").Preload("User").Preload("Librarian").Raw("SELECT * FROM borrow_equipments").Find(&borrowequipments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowequipments})
}

// DELETE /borrow_equipment/:id
func DeleteBorrowEquipment(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM borrow_equipments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrow equipments not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /borrow_equipment
func UpdateBorrowEquipment(c *gin.Context) {
	var borrowequipment entity.BorrowEquipment
	if err := c.ShouldBindJSON(&borrowequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", borrowequipment.ID).First(&borrowequipment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrow equipment not found"})
		return
	}
	if err := entity.DB().Save(&borrowequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowequipment})
}

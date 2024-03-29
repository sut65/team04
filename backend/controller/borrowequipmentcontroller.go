package controller

import (
	"fmt"
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

func CreateBorrowEquipment(c *gin.Context) { // c รับข้อมูลมาจาก api

	var borrowequipment entity.BorrowEquipment //การประกาศตัวแปรให้เป็นไทป์ที่เราสร้างขึ้นเอง
	var librarian entity.Librarian
	var user entity.User
	var equipmentpurchasing entity.EquipmentPurchasing

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร borrowequipment
	if err := c.ShouldBindJSON(&borrowequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} //การบาย

	// 9: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", borrowequipment.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// 10: ค้นหา equipmentpurchasing ด้วย id
	if tx := entity.DB().Where("id = ?", borrowequipment.EquipmentPurchasingID).First(&equipmentpurchasing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentpurchasing not found"})
		return
	}

	// 11: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", borrowequipment.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// localtime := borrowequipment.BorrowEquipment_Day.Local()
	// 12: สร้าง borrowequipment
	BP := entity.BorrowEquipment{

		User:                   user,                                        // โยงความสัมพันธ์กับ Entity User
		EquipmentPurchasing:    equipmentpurchasing,                         // โยงความสัมพันธ์กับ Entity EquipmentPurchasing
		Amount_BorrowEquipment: borrowequipment.Amount_BorrowEquipment,      // โยงความสัมพันธ์กับ Entity จำนวน
		BorrowEquipment_Day:    borrowequipment.BorrowEquipment_Day.Local(), // โยงความสัมพันธ์กับ Entity วันเวลา
		Librarian:              librarian,                                   // โยงความสัมพันธ์กับ Entity Librarian

		TrackingCheck: false, //เอาไว้เช็คสำหรับว่ารายการนี้ถูกคืนไปรึยัง
	}

	//สำหรับเช็ค validate
	if _, err := govalidator.ValidateStruct(borrowequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&BP).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": BP}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET borrowequipment
func GetAllBorrowEquipment(c *gin.Context) {

	var borrowequipment []entity.BorrowEquipment

	if err := entity.DB().Model(&entity.BorrowEquipment{}).Preload("User").Preload("EquipmentPurchasing").Preload("Librarian").Find(&borrowequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": borrowequipment})

}

func GetBorrowEquipmentByID(c *gin.Context) {
	var borrowequipment entity.BorrowEquipment
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /borrow_books/:id
	if err := entity.DB().Model(&entity.BorrowEquipment{}).Where("ID = ?", Id).Preload("User").Preload("EquipmentPurchasing").Preload("Librarian").Find(&borrowequipment); err.RowsAffected == 0 {
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

	//Validate
	if _, err := govalidator.ValidateStruct(borrowequipment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	borrowequipment.BorrowEquipment_Day = borrowequipment.BorrowEquipment_Day.Local()

	if err := entity.DB().Save(&borrowequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": borrowequipment})
}

// DELETE borrowequipment By id
func DeleteBorrowEquipment(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM borrow_equipments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "borrow equipment not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// func สำหรับดึงไปเช็คในระบบคืนว่าทำรายการไปรึยัง
func ListBorrowEquipmentForTrackingCheck(c *gin.Context) {
	var borrowequipment []entity.BorrowEquipment
	if err := entity.DB().Model(&entity.BorrowEquipment{}).Preload("User").Preload("EquipmentPurchasing").Preload("Librarian").Raw("SELECT * FROM borrow_equipments where tracking_check = false").Find(&borrowequipment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": borrowequipment})
}

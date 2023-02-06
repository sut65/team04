package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /confirmation
func CreateConfirmation(c *gin.Context) {
	var confirmation entity.Confirmation
	var receiver entity.Receiver
	var preorder entity.Preorder
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 7 จะถูก bind เข้าตัวแปร confirmation
	if err := c.ShouldBindJSON(&confirmation); err != nil { //เอาข้อมูลฝั่ง frontend มาเก็บไว้ที่ตัวแปรใน backend
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//  8: ค้นหา receiver ด้วย id เช็คว่ามี id ที่เราส่งมามีในตารางมั้ย
	if tx := entity.DB().Where("id = ?", confirmation.ReceiverID).First(&receiver); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "receiver not found"})
		return
	}

	// 9: ค้นหา preorder ด้วย id
	if tx := entity.DB().Where("id = ?", confirmation.PreorderID).First(&preorder); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "preorder not found"})
		return
	}

	// 9.5: อัพเดทคอลัมน์ ConfirmationCheck ว่า preorder ถูกประเมินแล้ว
	if tx := entity.DB().Model(&preorder).Update("ConfirmationCheck", true); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "preorder not found"})
		return
	}

	//  10: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", confirmation.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// 11: สร้าง confirmation
	ps := entity.Confirmation{ //object ที่จะเก็บข้อมูลของเรา

		Preorder:  preorder,              //โยงความสัมพันธ์กับ Entity preorder
		Receiver:  receiver,              //โยงความสัมพันธ์กับ Entity receiver
		NoteName:  confirmation.NoteName, //ตั้งค่าฟิลด์ note_name
		NoteTel:   confirmation.NoteTel,  //ตั้งค่าฟิลด์ note_tel
		Datetime:  confirmation.Datetime, //ตั้งค่าฟิลด์ datetime
		Librarian: librarian,             // โยงความสัมพันธ์กับ Entity librarian

	}

	if _, err := govalidator.ValidateStruct(confirmation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//  12: บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ps})

}

// GET /confirmation/:id
func GetConfirmation(c *gin.Context) { //get โดนส่งพารามิเตอร์
	var confirmation entity.Confirmation
	id := c.Param("id") //เรียกค่าจากตัวแปรที่อยู่แบบ object ซ้อน object ที่เป็น FK กัน
	if err := entity.DB().Preload("Preorder").Preload("Receiver").Preload("Librarian").Raw("SELECT * FROM confirmations WHERE id = ?", id).Find(&confirmation).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": confirmation})
}

// GET /confirmation ไม่มีเงื่อนไข ส่งไปทุก object
func ListConfirmations(c *gin.Context) { //เอา object ไปเชื่อมกัน Preload คือ ดึง object ของ object
	var confirmations []entity.Confirmation //ดึงมาทั้งหมด
	if err := entity.DB().Preload("Preorder").Preload("Receiver").Preload("Librarian").Raw("SELECT * FROM confirmations").Find(&confirmations).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": confirmations})
}

// DELETE /confirmation/:id
func DeleteConfirmation(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM confirmations WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "confirmation not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /confirmation
func UpdateConfirmation(c *gin.Context) {
	var confirmation entity.Confirmation
	if err := c.ShouldBindJSON(&confirmation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", confirmation.ID).First(&confirmation); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "confirmation not found"})
		return
	}
	if err := entity.DB().Save(&confirmation).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": confirmation})
}

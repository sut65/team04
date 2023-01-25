package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /Preorder
func CreatePreorder(c *gin.Context) {
	var preorder entity.Preorder
	var payment entity.Payment
	var user entity.User
	var librarian entity.Librarian

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 7 จะถูก bind เข้าตัวแปร preorder
	if err := c.ShouldBindJSON(&preorder); err != nil { //เอาข้อมูลฝั่ง frontend มาเก็บไว้ที่ตัวแปรใน backend
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//  10: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", preorder.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	//  9: ค้นหา payment ด้วย id เช็คว่ามี id ที่เราส่งมามีในตารางมั้ย
	if tx := entity.DB().Where("id = ?", preorder.PaymentID).First(&payment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment not found"})
		return
	}

	//  8: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", preorder.OwnerID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ownwer not found"})
		return
	}

	// 11: สร้าง preorder
	ps := entity.Preorder{ //object ที่จะเก็บข้อมูลของเรา
		Owner:      user,                //โยงความสัมพันธ์กับ Entity user
		Name:       preorder.Name,       //ตั้งค่าฟิลด์ name
		Price:      preorder.Price,      //ตั้งค่าฟิลด์ price
		Author:     preorder.Author,     //ตั้งค่าฟิลด์ author
		Edition:    preorder.Edition,    //ตั้งค่าฟิลด์ edition
		Year:       preorder.Year,       //ตั้งค่าฟิลด์ year
		Quantity:   preorder.Quantity,   //ตั้งค่าฟิลด์ quantity
		Totalprice: preorder.Totalprice, //ตั้งค่าฟิลด์ totalprice
		Payment:    payment,             //โยงความสัมพันธ์กับ Entity payment
		Datetime:   preorder.Datetime,   //ตั้งค่าฟิลด์ datetime
		Librarian:  librarian,           // โยงความสัมพันธ์กับ Entity librarian
	}

	//  12: บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ps})

}

// GET /preorder/:id
func GetPreorder(c *gin.Context) { //get โดนส่งพารามิเตอร์
	var preorder entity.Preorder
	id := c.Param("id") //เรียกค่าจากตัวแปรที่อยู่แบบ object ซ้อน object ที่เป็น FK กัน
	if err := entity.DB().Preload("Payment").Preload("User").Preload("Librarian").Raw("SELECT * FROM preorders WHERE id = ?", id).Find(&preorder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": preorder})
}

// GET /preorder ไม่มีเงื่อนไข ส่งไปทุก object
func ListPreorders(c *gin.Context) { //เอา object ไปเชื่อมกัน Preload คือ ดึง object ของ object
	var preorders []entity.Preorder //ดึงมาทั้งหมด
	if err := entity.DB().Preload("Payment").Preload("User").Preload("Librarian").Raw("SELECT * FROM preorders").Find(&preorders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": preorders})
}

// DELETE /preorder/:id
func DeletePreorder(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM preorder WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "preorder not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /preorder
func UpdatePreorder(c *gin.Context) {
	var preorder entity.Preorder
	if err := c.ShouldBindJSON(&preorder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", preorder.ID).First(&preorder); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "preorder not found"})
		return
	}
	if err := entity.DB().Save(&preorder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": preorder})
}

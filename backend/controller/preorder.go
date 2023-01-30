package controller

import (
	"fmt"
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
	if tx := entity.DB().Where("id = ?", preorder.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// 11: สร้าง preorder
	ps := entity.Preorder{ //object ที่จะเก็บข้อมูลของเรา
		User:              user,                //โยงความสัมพันธ์กับ Entity user
		Name:              preorder.Name,       //ตั้งค่าฟิลด์ name
		Price:             preorder.Price,      //ตั้งค่าฟิลด์ price
		Author:            preorder.Author,     //ตั้งค่าฟิลด์ author
		Edition:           preorder.Edition,    //ตั้งค่าฟิลด์ edition
		Year:              preorder.Year,       //ตั้งค่าฟิลด์ year
		Quantity:          preorder.Quantity,   //ตั้งค่าฟิลด์ quantity
		Totalprice:        preorder.Totalprice, //ตั้งค่าฟิลด์ totalprice
		Payment:           payment,             //โยงความสัมพันธ์กับ Entity payment
		Datetime:          preorder.Datetime,   //ตั้งค่าฟิลด์ datetime
		Librarian:         librarian,           // โยงความสัมพันธ์กับ Entity librarian
		ConfirmationCheck: false,
	}

	//  12: บันทึก
	if err := entity.DB().Create(&ps).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ps})

}

// GET /preorder
func ListPreorders(c *gin.Context) {
	var preorder []entity.Preorder
	if err := entity.DB().Model(&entity.Preorder{}).Preload("User").Preload("Payment").Preload("Librarian").Find(&preorder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": preorder})
}

// GET /preorder/:id
func GetPreorder(c *gin.Context) {
	var preorder entity.Preorder
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /preorder/:id
	if err := entity.DB().Model(&entity.Preorder{}).Where("ID = ?", Id).Preload("User").Preload("Payment").Preload("Librarian").Find(&preorder); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("PreorderID :  Id%s not found.", Id)})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": preorder})
}

// DELETE /preorder/:id
func DeletePreorder(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM preorders WHERE id = ?", id); tx.RowsAffected == 0 {
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

func ListPreordersNoConfirmationCheck(c *gin.Context) {

	var preorder []entity.Preorder
	Id := c.Param("id")

	if err := entity.DB().Model(&entity.Preorder{}).Where("ID = ?", Id).Preload("User").Preload("Payment").Preload("Librarian").Raw("SELECT * FROM preorders where confirmation_check = false").Find(&preorder).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": preorder})

}

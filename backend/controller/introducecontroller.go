package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /introduce
func CreateIntroduce(c *gin.Context) {

	var introduce entity.Introduce

	var bookType entity.BookType
	var objective entity.Objective
	var user entity.User

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 10 จะถูก bind เข้าตัวแปร introduce
	if err := c.ShouldBindJSON(&introduce); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา bookType ด้วย id
	if tx := entity.DB().Where("id = ?", introduce.BookTypeID).First(&bookType); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookType not found"})
		return
	}

	// 10: ค้นหา objective ด้วย id
	if tx := entity.DB().Where("id = ?", introduce.ObjectiveID).First(&objective); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "objective not found"})
		return
	}

	// 11: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", introduce.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// 12: สร้าง Introduce
	in := entity.Introduce{

		Title:     introduce.Title,    // ตั้งค่าฟิลด์ I_Date
		Author:    introduce.Author,   // ตั้งค่าฟิลด์ I_Date
		ISBN:      introduce.ISBN,     // ตั้งค่าฟิลด์ ISBN
		Edition:   introduce.Edition,  // ตั้งค่าฟิลด์ Edition
		Pub_Name:  introduce.Pub_Name, // ตั้งค่าฟิลด์ Pub_Name
		Pub_Year:  introduce.Pub_Year, // ตั้งค่าฟิลด์ Pub_Year
		I_Date:    introduce.I_Date,   // ตั้งค่าฟิลด์ I_Date
		BookType:  bookType,           // โยงความสัมพันธ์กับ Entity BookType
		Objective: objective,          // โยงความสัมพันธ์กับ Entity Objective
		User:      user,               // โยงความสัมพันธ์กับ Entity User

	}

	// 13: บันทึก
	if err := entity.DB().Create(&in).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": in})
}

// GET /introduce/:id
func GetIntroduce(c *gin.Context) {
	var introduce entity.Introduce
	id := c.Param("id")
	if err := entity.DB().Preload("BookType").Preload("Objective").Preload("User").Raw("SELECT * FROM introduces WHERE id = ?", id).Find(&introduce).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": introduce})
}

// DELETE /introduces/:id
func DeleteIntroduce(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM introduces WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "introduce not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /introduces
func UpdateIntroduce(c *gin.Context) {
	var introduce entity.Introduce
	if err := c.ShouldBindJSON(&introduce); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", introduce.ID).First(&introduce); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "introduce not found"})
		return
	}

	if err := entity.DB().Save(&introduce).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": introduce})
}

// GET /introduces

func ListIntroduces(c *gin.Context) {

	var introduce []entity.Introduce

	if err := entity.DB().Preload("BookType").Preload("Objective").Preload("User").Raw("SELECT * FROM introduces").Find(&introduce).Error; err != nil {

		//Preload เหมือนจอยตาราง
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": introduce})

}

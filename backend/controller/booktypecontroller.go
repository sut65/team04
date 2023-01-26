package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

func CreateBookType(c *gin.Context) {
	var bookType entity.BookType

	if err := c.ShouldBindJSON(&bookType); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&bookType).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bookType})
}

// GET /bookType/:id
func GetBookTypeByID(c *gin.Context) {
	var bookType entity.BookType

	id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /bookType/:id
	if err := entity.DB().Model(&entity.BookType{}).Where("ID = ?", id).Scan(&bookType).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookType})
}

// GET /bookType
func GetAllBookType(c *gin.Context) {
	var bookType []entity.BookType
	if err := entity.DB().Model(&entity.BookType{}).Scan(&bookType).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookType})
}

// DELETE /bookType/:id
func DeleteBookType(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Delete(&entity.BookType{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookType ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("bookTypeID :  %s deleted.", id))
}

// PATCH /bookType
func UpdateBookType(c *gin.Context) {
	var bookType entity.BookType
	if err := c.ShouldBindJSON(&bookType); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", bookType.ID).First(&bookType); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookType not found"})
		return
	}

	if err := entity.DB().Save(&bookType).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookType})
}

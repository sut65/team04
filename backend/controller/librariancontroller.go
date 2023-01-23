package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Publisher
func GetAllLibrarian(c *gin.Context) {

	var librarian []entity.Librarian

	if err := entity.DB().Model(&entity.Librarian{}).Scan(&librarian).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": librarian})

}

// GET librarian By ID
func GetLibrarianByID(c *gin.Context) {

	var librarian entity.Librarian
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /librarian/:id
	if err := entity.DB().Model(&entity.Librarian{}).Where("ID = ?", Id).Scan(&librarian).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": librarian})

}

// POST Publisher
func CreateLibrarian(c *gin.Context) {
	var librarian entity.Librarian

	if err := c.ShouldBindJSON(&librarian); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&librarian).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": librarian})
}

// PATCH /librarian
func UpdateLibrarian(c *gin.Context) {
	var librarian entity.Librarian
	if err := c.ShouldBindJSON(&librarian); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", librarian.ID).First(&entity.Librarian{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
		return
	}

	if err := entity.DB().Model(&librarian).Update("Name", librarian.Name).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": librarian})
}

// DELETE Librarian By id
func DeleteLibrarian(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Librarian{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("librarianID :  %s deleted.", Id))
}

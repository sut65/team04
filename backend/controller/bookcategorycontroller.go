package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET Publisher
func GetAllBookCategory(c *gin.Context) {

	var bookCategory []entity.BookCategory

	if err := entity.DB().Model(&entity.BookCategory{}).Scan(&bookCategory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookCategory})

}

// GET librarian By ID
func GetBookCategoryByID(c *gin.Context) {

	var bookCategory entity.BookCategory
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /bookCategory/:id
	if err := entity.DB().Model(&entity.BookCategory{}).Where("ID = ?", Id).Scan(&bookCategory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookCategory})

}

// POST Publisher
func CreateBookCategory(c *gin.Context) {
	var bookCategory entity.BookCategory

	if err := c.ShouldBindJSON(&bookCategory); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&bookCategory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bookCategory})
}

// PATCH /bookCategory
func UpdateBookCategory(c *gin.Context) {
	var bookCategory entity.BookCategory
	if err := c.ShouldBindJSON(&bookCategory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", bookCategory.ID).First(&bookCategory); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookCategory not found"})
		return
	}
	if err := entity.DB().Save(&bookCategory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// if err := c.ShouldBindJSON(&bookCategory); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// if tx := entity.DB().Where("id = ?", bookCategory.ID).First(&entity.BookCategory{}); tx.RowsAffected == 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
	// 	return
	// }

	// if err := entity.DB().Model(&bookCategory).Update("Name", bookCategory.Name).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"data": bookCategory})
}

// DELETE Librarian By id
func DeleteBookCategory(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.BookCategory{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookCategory ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("BookCategoryID :  %s deleted.", Id))
}

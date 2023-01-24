package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /bookType
func CreateBookType(c *gin.Context) {
	var bookType entity.BookType
	if err := c.ShouldBindJSON(&bookType); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&bookType).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bookType})
}

// GET /BookType/:id
func GetBookType(c *gin.Context) {
	var bookType entity.BookType

	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM bookTypes WHERE id = ?", id).Find(&bookType).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookType})
}

// GET /bookTypes
func ListBookTypes(c *gin.Context) {
	var bookTypes []entity.BookType
	if err := entity.DB().Raw("SELECT * FROM bookTypes").Find(&bookTypes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookTypes})
}

// DELETE /bookType/:id
func DeleteBookType(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM bookTypes WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookType not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /bookTypes
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

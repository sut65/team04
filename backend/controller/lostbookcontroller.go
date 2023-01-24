package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// POST /lost_books
func CreateLostBook(c *gin.Context) {
	var lostbook entity.LostBook
	if err := c.ShouldBindJSON(&lostbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&lostbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lostbook})
}

// GET /lost_books/:id
func GetLostBook(c *gin.Context) {
	var lostbook entity.LostBook
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM lost_books WHERE id = ?", id).Find(&lostbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lostbook})
}

// GET /lost_books
func ListLostBooks(c *gin.Context) {
	var lostbooks []entity.User
	if err := entity.DB().Raw("SELECT * FROM lost_books").Find(&lostbooks).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lostbooks})
}

// DELETE /lost_books/:id
func DeleteLostBook(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM lost_books WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "lost_book not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /lost_books
func UpdateLostBook(c *gin.Context) {
	var lostbook entity.LostBook
	if err := c.ShouldBindJSON(&lostbook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", lostbook.ID).First(&lostbook); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "lost_book not found"})
		return
	}
	if err := entity.DB().Save(&lostbook).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lostbook})
}

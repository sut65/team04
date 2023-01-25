package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

// GET company
func GetAllCompany(c *gin.Context) {

	var company []entity.Company

	if err := entity.DB().Model(&entity.Company{}).Scan(&company).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": company})

}

// GET company By ID
func GetcompanyByID(c *gin.Context) {

	var company entity.Company
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /company/:id
	if err := entity.DB().Model(&entity.Company{}).Where("ID = ?", Id).Scan(&company).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": company})

}

// POST company
func CreateCompany(c *gin.Context) {
	var company entity.Company

	if err := c.ShouldBindJSON(&company); err != nil { //การแปลงข้อมูลที่อยู่ในคอนเทคมาอยู่ในรูปแบบภาษาโก
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&company).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": company})
}

// PATCH /company
func UpdateCompany(c *gin.Context) {
	var company entity.Company
	if err := c.ShouldBindJSON(&company); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", company.ID).First(&company); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "company not found"})
		return
	}
	if err := entity.DB().Save(&company).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// if err := c.ShouldBindJSON(&company); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// if tx := entity.DB().Where("id = ?", company.ID).First(&entity.Company{}); tx.RowsAffected == 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
	// 	return
	// }

	// if err := entity.DB().Model(&company).Update("Name", company.Name).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"data": company})
}

// DELETE company By id
func DeleteCompany(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Company{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "company ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("companyID :  %s deleted.", Id))
}

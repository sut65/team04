package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

func CreateEquipmentPurchasing(c *gin.Context) { // c รับข้อมูลมาจาก api

	var equipmentpurchasing entity.EquipmentPurchasing //การประกาศตัวแปรให้เป็นไทป์ที่เราสร้างขึ้นเอง
	var librarian entity.Librarian
	var equipmentcategory entity.EquipmentCategory
	var company entity.Company

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 10 จะถูก bind เข้าตัวแปร EquipmentPurchasing
	if err := c.ShouldBindJSON(&equipmentpurchasing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} //การบาย

	// 11: ค้นหา equipmentcategory ด้วย id
	if tx := entity.DB().Where("id = ?", equipmentpurchasing.EquipmentCategoryID).First(&equipmentcategory); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentcategory not found"})
		return
	}

	// 13: ค้นหา company ด้วย id
	if tx := entity.DB().Where("id = ?", equipmentpurchasing.CompanyID).First(&company); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "company not found"})
		return
	}

	// 15: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", equipmentpurchasing.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	// 17: สร้าง EquipmentPurchasing
	EP := entity.EquipmentPurchasing{

		EquipmentName:     equipmentpurchasing.EquipmentName, //ตั้งค่าฟิลด์ใส่ symtom, ใส่ข้อมูลให้เข้าไปในคอลัมน์ symtom
		Date:              equipmentpurchasing.Date,          //ตั้งค่าฟิลด์ Date
		Librarian:         librarian,                         // โยงความสัมพันธ์กับ Entity Librarian
		Company:           company,                           // โยงความสัมพันธ์กับ Entity Company
		EquipmentCategory: equipmentcategory,                 // โยงความสัมพันธ์กับ Entity EquipmentCategory
		Amount:            equipmentpurchasing.Amount,
	}

	// 18: บันทึก
	if err := entity.DB().Create(&EP).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": EP}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET EquipmentPurchasing
func GetAllEquipmentPurchasing(c *gin.Context) {

	var equipmentpurchasing []entity.EquipmentPurchasing

	if err := entity.DB().Model(&entity.EquipmentPurchasing{}).Preload("Librarian").Preload("Company").Preload("EquipmentCategory").Find(&equipmentpurchasing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentpurchasing})

}

// GET EquipmentPurchasing By ID
func GetEquipmentPurchasingByID(c *gin.Context) {

	var equipmentpurchasing entity.EquipmentPurchasing
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /equipmentpurchasing/:id
	if err := entity.DB().Model(&entity.EquipmentPurchasing{}).Where("ID = ?", Id).Preload("Librarian").Preload("Company").Preload("EquipmentCategory").Find(&equipmentpurchasing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("EquipmentPurchasingID :  Id%s not found.", Id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": equipmentpurchasing})

}

// PATCH /EquipmentPurchasing
func UpdateEquipmentPurchasing(c *gin.Context) {
	var equipmentpurchasing entity.EquipmentPurchasing

	if err := c.ShouldBindJSON(&equipmentpurchasing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", equipmentpurchasing.ID).First(&entity.EquipmentPurchasing{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentpurchasing not found"}) //เช็คว่ามีไอดีอยู่ในดาต้าเบสมั้ย
		return
	}
	if err := entity.DB().Save(&equipmentpurchasing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": equipmentpurchasing})
}

// DELETE equipmentpurchasing By id
func DeleteEquipmentPurchasing(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.EquipmentPurchasing{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "equipmentpurchasing ID not found"})
		return
	}

	c.JSON(http.StatusOK, fmt.Sprintf("equipmentpurchasingID :  Id%s deleted.", Id))
}

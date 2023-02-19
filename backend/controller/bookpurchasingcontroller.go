package controller

import (
	"fmt"
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
)

func CreateBookPurchasing(c *gin.Context) { // c รับข้อมูลมาจาก api

	var bookpurchasing entity.BookPurchasing //การประกาศตัวแปรให้เป็นไทป์ที่เราสร้างขึ้นเอง
	var librarian entity.Librarian
	var bookcategory entity.BookCategory
	var publisher entity.Publisher

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร bookpurchasing
	if err := c.ShouldBindJSON(&bookpurchasing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} //การบาย

	// 9: ค้นหา bookcategory ด้วย id
	if tx := entity.DB().Where("id = ?", bookpurchasing.BookCategoryID).First(&bookcategory); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookcategory not found"})
		return
	}

	// 10: ค้นหา publisher ด้วย id
	if tx := entity.DB().Where("id = ?", bookpurchasing.PublisherID).First(&publisher); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publisher not found"})
		return
	}

	// 11: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", bookpurchasing.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}

	localtime := bookpurchasing.Date.Local()
	// 12: สร้าง bookpurchasing
	BP := entity.BookPurchasing{

		BookName:     bookpurchasing.BookName, //ตั้งค่าฟิลด์ใส่ symtom, ใส่ข้อมูลให้เข้าไปในคอลัมน์ symtom
		Date:         localtime,               //ตั้งค่าฟิลด์ Date
		Librarian:    librarian,               // โยงความสัมพันธ์กับ Entity Librarian
		Publisher:    publisher,               // โยงความสัมพันธ์กับ Entity Publisher
		BookCategory: bookcategory,            // โยงความสัมพันธ์กับ Entity BookCategory
		AuthorName:   bookpurchasing.AuthorName,
		Amount:       bookpurchasing.Amount,
	}
	if _, err := govalidator.ValidateStruct(bookpurchasing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 13: บันทึก
	if err := entity.DB().Create(&BP).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": BP}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
}

// GET bookPurchasing
func GetAllBookPurchasing(c *gin.Context) {

	var bookPurchasing []entity.BookPurchasing

	if err := entity.DB().Model(&entity.BookPurchasing{}).Preload("Librarian").Preload("BookCategory").Preload("Publisher").Find(&bookPurchasing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookPurchasing})

}

// GET bookPurchasing By ID
func GetBookPurchasingByID(c *gin.Context) {

	var bookPurchasing entity.BookPurchasing
	Id := c.Param("id") //id ที่เราตั้งไว้ใน main.go ที่อยู่หลัง : ตัวอย่าง >> /bookPurchasing/:id
	if err := entity.DB().Model(&entity.BookPurchasing{}).Where("ID = ?", Id).Preload("Librarian").Preload("BookCategory").Preload("Publisher").Find(&bookPurchasing); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("BookPurchasingID :  Id%s not found.", Id)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookPurchasing})

}

// PATCH /bookPurchasing
func UpdateBookPurchasing(c *gin.Context) {
	var bookPurchasing entity.BookPurchasing
	var librarian entity.Librarian
	var bookcategory entity.BookCategory
	var publisher entity.Publisher

	if err := c.ShouldBindJSON(&bookPurchasing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", bookPurchasing.ID).First(&entity.BookPurchasing{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookPurchasing not found"}) //เช็คว่ามีไอดีอยู่ในดาต้าเบสมั้ย
		return
	}
	// 9: ค้นหา bookcategory ด้วย id
	if tx := entity.DB().Where("id = ?", bookPurchasing.BookCategoryID).First(&bookcategory); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookcategory not found"})
		return
	}

	// 10: ค้นหา publisher ด้วย id
	if tx := entity.DB().Where("id = ?", bookPurchasing.PublisherID).First(&publisher); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publisher not found"})
		return
	}

	// 11: ค้นหา librarian ด้วย id
	if tx := entity.DB().Where("id = ?", bookPurchasing.LibrarianID).First(&librarian); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "librarian not found"})
		return
	}
	if _, err := govalidator.ValidateStruct(bookPurchasing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Save(&bookPurchasing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookPurchasing})
}

// DELETE bookPurchasing By id
func DeleteBookPurchasing(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.BookPurchasing{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookPurchasing ID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fmt.Sprintf("BookPurchasingID :  Id%s deleted.", Id)})
}

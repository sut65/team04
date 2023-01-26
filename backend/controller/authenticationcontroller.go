package controller

import (
	// "fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/team04/entity"
	"github.com/team04/service"
	"golang.org/x/crypto/bcrypt"
)

// LoginPayload login body
type LoginPayload struct { //json มาจาก frontend
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse token response
type LoginResponse struct { //จะส่งอะไรกลับไปให้
	Token string `json:"token"`
	ID    uint   `json:"id"` //ต้องการแค่ไอดี
}

// POST /login
func LoginUser(c *gin.Context) { //c คือ พารามิเตอร์จาก front
	var payload LoginPayload
	var users entity.User

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา nutritionist ด้วย email ที่ผู้ใช้กรอกเข้ามา
	if err := entity.DB().Raw("SELECT * FROM users WHERE email = ?", payload.Email).Scan(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(users.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid nutritionist credentials"})
		return
	}

	// กำหนดค่า SecretKey, Issuer และระยะเวลาหมดอายุของ Token สามารถกำหนดเองได้
	// SecretKey ใช้สำหรับการ sign ข้อความเพื่อบอกว่าข้อความมาจากตัวเราแน่นอน
	// Issuer เป็น unique id ที่เอาไว้ระบุตัว client
	// ExpirationHours เป็นเวลาหมดอายุของ token

	jwtWrapper := service.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(users.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	tokenResponse := LoginResponse{
		Token: signedToken,
		ID:    users.ID,
	}

	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
}

func LoginLibrarian(c *gin.Context) {
	var payload LoginPayload
	var librarian entity.Librarian

	if err := c.ShouldBindJSON(&payload); err != nil { //เช็คว่าข้อมูลฝั่ง frontend และ backend ตรงกันมั้ย
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา librarian ด้วย email ที่ผู้ใช้กรอกเข้ามา scan คือเช็คทุกแถวของตรง
	if err := entity.DB().Raw("SELECT * FROM librarians WHERE email = ?", payload.Email).Scan(&librarian).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบรหัสผ่าน encode password
	err := bcrypt.CompareHashAndPassword([]byte(librarian.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid librarian credentials"})
		return
	}

	// กำหนดค่า SecretKey, Issuer และระยะเวลาหมดอายุของ Token สามารถกำหนดเองได้
	// SecretKey ใช้สำหรับการ sign ข้อความเพื่อบอกว่าข้อความมาจากตัวเราแน่นอน
	// Issuer เป็น unique id ที่เอาไว้ระบุตัว client
	// ExpirationHours เป็นเวลาหมดอายุของ token

	jwtWrapper := service.JwtWrapper{ //generate token
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx", //สร้าง key แล้วเอาไปใช้ในเวลาที่กำหนดไว้
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	//ไปเช็คต่อใน service GenerateToken
	signedToken, err := jwtWrapper.GenerateToken(librarian.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	tokenResponse := LoginResponse{ //ส่งข้อมูลไปให้ฝั่ง frontend
		Token: signedToken,
		ID:    librarian.ID, //เอาไป get อีกรอบ
	}

	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
}

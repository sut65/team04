package entity

import (
	"time"

	"gorm.io/gorm"
)

// ระบบสั่งซื้อสินค้า pre order

type Preorder struct {
	gorm.Model

	UserID *uint
	User   User `gorm:"references:id;"`

	Name       string `valid:"required~กรุณากรอกชื่อหนังสือ"`
	Price      int    `valid:"required~ราคาหนังสือไม่ถูกต้อง, range(1|9999)~ราคาหนังสือไม่ถูกต้อง,"`
	Author     string `valid:"required~กรุณากรอกชื่อผู้แต่งหนังสือ"`
	Edition    int    `valid:"required~จำนวนครั้งที่พิมพ์ไม่ถูกต้อง, range(1|9999)~จำนวนครั้งที่พิมพ์ไม่ถูกต้อง,"`
	Year       string `valid:"required~ปีที่พิมพ์ไม่ถูกต้อง, matches(^(-)|(2([5|0])([0-9]{2})$))~ปีที่พิมพ์ไม่ถูกต้อง"`
	Quantity   int    `valid:"required~จำนวนหนังสือควรมีตั้งแต่ 1-5 เท่านั้น, range(1|5)~จำนวนหนังสือควรมีตั้งแต่ 1-5 เท่านั้น"`
	Totalprice int    `valid:"required~ราคารวมทั้งหมดไม่ถูกต้อง, range(1|9999)~ราคารวมทั้งหมดไม่ถูกต้อง,"`

	PaymentID *uint
	Payment   Payment `gorm:"references:id;"`

	Datetime time.Time

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	Confirmation []Confirmation `gorm:"foreignKey:PreorderID"`

	ConfirmationCheck bool
}

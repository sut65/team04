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

	Name       string `valid:"required~Name cannot be blank"`
	Price      int    `valid:"required~Price must greater than zero, range(1|9999)~Price must greater than zero,"`
	Author     string `valid:"required~Author cannot be blank"`
	Edition    int    `valid:"required~Edition must greater than zero, range(1|9999)~Edition must greater than zero,"`
	Year       string `valid:"required~year cannot be blank"`
	Quantity   int    `valid:"required~quantity must be 1-5, range(1|5)~quantity must be 1-5"`
	Totalprice int

	PaymentID *uint
	Payment   Payment `gorm:"references:id;"`

	Datetime time.Time

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	Confirmation []Confirmation `gorm:"foreignKey:PreorderID"`

	ConfirmationCheck bool
}

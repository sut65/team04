package entity

import (
	"time"

	"gorm.io/gorm"
)

// ระบบสั่งซื้อสินค้า pre order

type Preorder struct {
	gorm.Model

	OwnerID *uint
	Owner   User `gorm:"references:id;"`

	Name       string
	Price      int
	Author     string
	Edition    int
	Year       string
	Quantity   int
	Totalprice int

	PaymentID *uint
	Payment   Payment `gorm:"references:id;"`

	Datetime time.Time

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	Confirmation []Confirmation `gorm:"foreignKey:PreorderID"`
}

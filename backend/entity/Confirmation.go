package entity

import (
	"time"

	"gorm.io/gorm"
)

// ระบบสั่งซื้อสินค้า pre order

type Receiver struct {
	gorm.Model
	Type string

	Confirmation []Confirmation `gorm:"foreignKey:ReceiverID"`
}

type Confirmation struct {
	gorm.Model

	UserID *uint
	User   User `gorm:"references:id;"`

	PreorderID *uint
	Preorder   Preorder `gorm:"references:id;"`

	ReceiverID *uint
	Receiver   Receiver `gorm:"references:id;"`

	Note     string
	Datetime time.Time

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`
}

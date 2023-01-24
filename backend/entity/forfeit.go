package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Name string

	Preorder []Preorder `gorm:"foreignKey:PaymentID"`
	Forfeits []Forfeit  `gorm:"foreignKey:PaymentID"`
}

type Forfeit struct {
	gorm.Model
	Pay      uint
	Pay_Date time.Time
	Note     string

	ReturnBookID *uint
	ReturnBook   ReturnBook `gorm:"references:id;"`

	PaymentID *uint
	Payment   Payment `gorm:"references:id;"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`
}

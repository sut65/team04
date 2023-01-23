package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Name string

	Forfeits []Forfeit `gorm:"foreignKey:PaymentID"`
}

type Forfeit struct {
	gorm.Model
	Pay      uint
	Pay_Date time.Time

	PaymentID *uint
	Payment   Payment `gorm:"references:id;"`

	ReturnBookID *uint
	ReturnBook   ReturnBook `gorm:"references:id;"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`
}

package entity

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Idcard   string `gorm:"uniqueIndex"`
	Tel      string
	Email    string `gorm:"uniqueIndex"`
	Password string

	BorrowBooks []BorrowBook `gorm:"foreignKey:UserID"`
}

type BorrowBook struct {
	gorm.Model
	Borb_Day       time.Time
	Return_Day     time.Time
	Color_Bar      string
	Borb_Frequency int

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	UserID *uint
	User   User `gorm:"references:id;"`

	BookPurchasingID *uint
	BookPurchasing   BookPurchasing `gorm:"references:id;"`

	ReturnBooks []ReturnBook `gorm:"foreignKey:BorrowBookID"`
}

package entity

import (
	"time"

	"gorm.io/gorm"
)

type LostBook struct {
	gorm.Model
	Name string

	ReturnBooks []ReturnBook `gorm:"foreignKey:LostBookID"`
}

type ReturnBook struct {
	gorm.Model
	Current_Day    time.Time
	Late_Number    int
	Book_Condition string

	LostBookID *uint
	LostBook   LostBook `gorm:"references:id;"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	BorrowBookID *uint
	BorrowBook   BorrowBook `gorm:"references:id;"`
}

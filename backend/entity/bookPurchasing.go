package entity

import (
	"time"

	"gorm.io/gorm"
)

type Librarian struct {
	gorm.Model
	Name     string
	Tel      string
	Email    string `gorm:"uniqueIndex"`
	Password string

	BookPurchasings []BookPurchasing `gorm:"foreignKey:LibrarianID"`
}

type BookPurchasing struct {
	gorm.Model
	BookName   string
	AuthorName string
	Amount     uint
	Date       time.Time

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`
}

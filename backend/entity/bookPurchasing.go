package entity

import (
	"time"

	"gorm.io/gorm"
)

type BookPurchasing struct {
	gorm.Model
	BookName   string
	AuthorName string
	Amount     uint
	Date       time.Time
}

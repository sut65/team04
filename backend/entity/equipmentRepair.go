package entity

import (
	"time"

	"gorm.io/gorm"
)

type EquipmentRepair struct {
	gorm.Model
	EquipmentPurchasingID *uint
	EquipmentPurchasing   EquipmentPurchasing `gorm:"references:id;"`

	LevelID *uint
	Level   Level	`gorm:"references:id;"`

	Date time.Time

	Note	string

	LibrarianID *uint
	Librarian   Librarian	`gorm:"references:id;"`
}

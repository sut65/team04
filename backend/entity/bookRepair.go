package entity

import (
	"time"

	"gorm.io/gorm"
)

type Level struct {
	gorm.Model
	Name string

	BookRepair []BookRepair `gorm:"foreignKey:LevelID"`
	EquipmentRepair []EquipmentRepair  `gorm:"foreignKey:LevelID"`
}

type BookRepair struct {
	gorm.Model

	BookPurchasingID *uint
	BookPurchasing   BookPurchasing `gorm:"references:id;"`

	LevelID *uint
	Level   Level	`gorm:"references:id;"`

	Date time.Time

	Note	string

	LibrarianID *uint
	Librarian   Librarian	`gorm:"references:id;"`
}
package entity

import (
	"time"

	"gorm.io/gorm"
)

type EquipmentCategory struct {
	gorm.Model
	Name string

	EquipmentPurchasing []EquipmentPurchasing `gorm:"foreignKey:EquipmentCategoryID"`
}

type Company struct {
	gorm.Model
	Name string `gorm:"uniqueIndex"`

	EquipmentPurchasing []EquipmentPurchasing `gorm:"foreignKey:CompanyID"`
}

type EquipmentPurchasing struct {
	gorm.Model
	EquipmentName string
	Amount        uint
	Date          time.Time

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	EquipmentCategoryID *uint
	EquipmentCategory   EquipmentCategory `gorm:"references:id;"`

	CompanyID *uint
	Company   Company `gorm:"references:id;"`

	BorrowEquipments []BorrowEquipment `gorm:"foreignKey:EquipmentPurchasingID"`
}

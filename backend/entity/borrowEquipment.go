package entity

import (
	"time"

	"gorm.io/gorm"
)

type BorrowEquipment struct {
	gorm.Model
	BorrowEquipment_Day    time.Time
	Amount_BorrowEquipment int

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	UserID *uint
	User   User `gorm:"references:id;"`

	EquipmentPurchasingID *uint
	EquipmentPurchasing   EquipmentPurchasing `gorm:"references:id;"`

	ReturnEquipments []ReturnEquipment `gorm:"foreignKey:BorrowEquipmentID"`
}

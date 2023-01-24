package entity

import (
	"time"

	"gorm.io/gorm"
)

type EquipmentStatus struct {
	gorm.Model
	Name string

	ReturnEquipment []ReturnEquipment `gorm:"foreignKey:EquipmentStatusID"`
}

type ReturnEquipment struct {
	gorm.Model
	Return_Day    time.Time
	Return_Detail string

	EquipmentStatusID *uint
	EquipmentStatus   EquipmentStatus `gorm:"references:id;"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	BorrowEquipmentID *uint
	BorrowEquipment   BorrowEquipment `gorm:"references:id;"`
}

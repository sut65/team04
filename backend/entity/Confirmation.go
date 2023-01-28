package entity

import (
	"time"

	"gorm.io/gorm"
)

// ระบบยืนยันการรับหนังสือ

type Receiver struct {
	gorm.Model
	Type string

	Confirmation []Confirmation `gorm:"foreignKey:ReceiverID"`
}

type Confirmation struct {
	gorm.Model

	PreorderID *uint
	Preorder   Preorder `gorm:"references:id;"`

	ReceiverID *uint
	Receiver   Receiver `gorm:"references:id;"`

	NoteName string
	NoteTel  string
	Datetime time.Time

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`
}

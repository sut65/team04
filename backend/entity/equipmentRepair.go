package entity

import (
	"time"

	"gorm.io/gorm"
)

type EquipmentRepair struct {
	gorm.Model
	EquipmentName 			string

	LevelID	 				*uint
	Level					`gorm:"references:id;"`

	Date 					time.Time

	LibrarianID				*uint
	Librarian  				`gorm:"references:id;"`
}
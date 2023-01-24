package entity

import (
	"time"

	"gorm.io/gorm"
)

type Level struct {
	gorm.Model
	Name string

	BookRepairs []BookRepair `gorm:"foreignKey:LevelID"`
}

type BookRepair struct {
	gorm.Model
	BookName string

	LevelID *uint
	Level   `gorm:"references:id;"`

	Date time.Time

	LibrarianID *uint
	Librarian   `gorm:"references:id;"`
}

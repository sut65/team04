package entity

import (
	"time"

	"gorm.io/gorm"
)

type BookType struct {
	gorm.Model
	Name string

	Introduces []Introduce `gorm:"foreignKey:BookTypeID"`
}

type Objective struct {
	gorm.Model
	Name string

	Introduces []Introduce `gorm:"foreignKey:ObjectiveID"`
}

type Introduce struct {
	gorm.Model
	Title    string
	Author   string
	ISBN     uint
	Edition  uint
	Pub_Name string
	Pub_Year string
	I_Date   time.Time

	BookTypeID *uint
	BookType   BookType `gorm:"references:id;"`

	ObjectiveID *uint
	Objective   Objective `gorm:"references:id;"`

	UserID *uint
	User   User `gorm:"references:id;"`
}

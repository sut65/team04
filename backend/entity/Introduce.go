package entity

import (
	"time"

	"gorm.io/gorm"
)

type Type struct {
	gorm.Model
	Name string

	Introduces []Introduce `gorm:"foreignKey:TypeID"`
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

	TypeID *uint
	Type   Type `gorm:"references:id;"`

	ObjectiveID *uint
	Objective   Objective `gorm:"references:id;"`

	UserID *uint
	User   User `gorm:"references:id;"`
}

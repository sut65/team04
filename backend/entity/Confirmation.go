package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
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
	Preorder   Preorder `gorm:"references:id;" valid:"-"`

	ReceiverID *uint
	Receiver   Receiver `gorm:"references:id;" valid:"-"`

	NoteName string    `valid:"required~NoteName cannot be blank"`
	NoteTel  string    `valid:"required~NoteTel invalid,matches(^0([6|8|9])([0-9]{8}$))~NoteTel invalid"`
	Datetime time.Time `valid:"present~DateTime Must Be Present"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;" valid:"-"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now()
		return t.After(now.Add(3-time.Minute)) && t.Before(now.Add(3+time.Minute))
	})

}

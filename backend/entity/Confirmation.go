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

	NoteName string    `valid:"required~กรุณากรอกชื่อผู้รับหนังสือ"`
	NoteTel  string    `valid:"required~รูปแบบเบอร์โทรผู้รับไม่ถูกต้อง ,matches(^0([6|8|9])([0-9]{8}$))~รูปแบบเบอร์โทรผู้รับไม่ถูกต้อง"`
	Date     time.Time `valid:"present~วันที่ควรเป็นปัจจุบัน"`

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

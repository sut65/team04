package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type LostBook struct {
	gorm.Model
	Name string

	ReturnBooks []ReturnBook `gorm:"foreignKey:LostBookID"`
}

type ReturnBook struct {
	gorm.Model
	Current_Day    time.Time `valid:"present~วันที่คืนหนังสือต้องเป็นปัจจุบัน กรุณาลองใหม่อีกครั้ง"`
	Late_Number    int       `valid:"MoreThanEqualZeroToOneThousand~จำนวนวันเลยกำหนดคืนต้องเป็นตัวเลขมากกว่าหรือเท่ากับ 0 - 1000"`
	Book_Condition string    `valid:"required~กรุณากรอกข้อมูลสภาพหนังสือ"`
	ForfeitCheck   bool

	LostBookID *uint
	LostBook   LostBook `gorm:"references:id" valid:"-"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id" valid:"-"`

	BorrowBookID *uint
	BorrowBook   BorrowBook `gorm:"references:id" valid:"-"`

	Forfeit []Forfeit `gorm:"foreignKey:PaymentID"`
}

// ฟังก์ชันที่จะใช่ในการ validation EntryTime
func init() {
	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(10-time.Minute)) && t.Before(time.Now().Add(10+time.Minute))
	})

	govalidator.CustomTypeTagMap.Set("MoreThanEqualZeroToOneThousand", func(i interface{}, context interface{}) bool {
		t := i.(int)
		if t < 0 {
			return false
		}
		if t > 1000 {
			return false
		} else {
			return true
		}
	})

}

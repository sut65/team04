package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Name string

	Preorder []Preorder `gorm:"foreignKey:PaymentID"`
	Forfeit  []Forfeit  `gorm:"foreignKey:PaymentID"`
}

type Forfeit struct {
	gorm.Model
	Pay          int       `valid:"IsPositive~จำนวนค่าปรับต้องมากกว่าหรือเท่ากับ 0 กรุณาลองใหม่อีกครั้ง"`
	Pay_Date     time.Time `valid:"present~วันที่บันทึกการชำระค่าปรับต้องเป็นปัจจุบัน"`
	Note         string    `valid:"required~กรุณากรอกข้อมูลการหาหนังสือมาคืน, maxstringlength(70)~ข้อมูลการหาหนังสือมาคืนต้องมีความยาวไม่เกิน 70 ตัว"`
	ModulateNote string    `valid:"required~กรุณากรอกข้อมูลการขอลดหย่อน"`

	ReturnBookID *uint
	ReturnBook   ReturnBook `gorm:"references:id;" valid:"-"`

	PaymentID *uint
	Payment   Payment `gorm:"references:id;" valid:"-"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;" valid:"-"`
}

// ฟังก์ชันที่จะใช่ในการ validation EntryTime
func init() {
	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(10-time.Minute)) && t.Before(time.Now().Add(10+time.Minute))
	})

	govalidator.CustomTypeTagMap.Set("IsPositive", func(i interface{}, context interface{}) bool {
		t := i.(int)
		if t < 0 {
			return false
		}
		if t > 14600 {
			return false
		} else {
			return true
		}
	})

}

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
	Pay          int       `valid:"required~จำนวนค่าปรับต้องอยู่ระหว่าง 0-14600 บาท กรุณาลองใหม่อีกครั้ง, range(0|14600)~จำนวนค่าปรับต้องอยู่ระหว่าง 0-14600 บาท กรุณาลองใหม่อีกครั้ง"`
	Pay_Date     time.Time `valid:"present~วันที่บันทึกการชำระค่าปรับต้องเป็นปัจจุบัน"`
	Note         string    `valid:"required~กรุณากรอกข้อมูลการหาหนังสือมาคืน"`
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
		now := time.Now()
		return t.After(now.Add(3-time.Minute)) && t.Before(now.Add(3+time.Minute))
	})

}

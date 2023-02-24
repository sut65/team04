package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Idcard   string `gorm:"uniqueIndex"`
	Tel      string
	Email    string `gorm:"uniqueIndex"`
	Password string

	BorrowBooks      []BorrowBook      `gorm:"foreignKey:UserID"`
	BorrowEquipments []BorrowEquipment `gorm:"foreignKey:UserID"`
	Introduce        []Introduce       `gorm:"foreignKey:UserID"`

	Preorder []Preorder `gorm:"foreignKey:UserID"`
}

type BorrowBook struct {
	gorm.Model
	Borb_Day       time.Time `valid:"Present~วันที่ยืมหนังสือต้องเป็นปัจจุบัน กรุณาลองใหม่อีกครั้ง"`
	Return_Day     time.Time `valid:"Past~วันกำหนดคืนหนังสือต้องไม่เป็นวันในอดีต กรุณาลองใหม่อีกครั้ง"`
	Color_Bar      string    `valid:"required~กรุณากรอกเเถบสีหนังสือที่เเบ่งตามหมวดหมู่"`
	Borb_Frequency int       `valid:"required~จำนวนครั้งที่ยืมหนังสือต้องเป็นตัวเลขระหว่าง 1-1000, range(1|1000)~จำนวนครั้งที่ยืมหนังสือต้องเป็นตัวเลขระหว่าง 1-1000"`
	TrackingCheck  bool

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id" valid:"-"`

	UserID *uint
	User   User `gorm:"references:id" valid:"-"`

	BookPurchasingID *uint
	BookPurchasing   BookPurchasing `gorm:"references:id" valid:"-"`

	ReturnBooks []ReturnBook `gorm:"foreignKey:BorrowBookID"`
}

// ฟังก์ชันที่จะใช่ในการ validation EntryTime
func init() {
	govalidator.CustomTypeTagMap.Set("Past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute*-10)) || t.Equal(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("Present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(10-time.Minute)) && t.Before(time.Now().Add(10+time.Minute))
	})

}

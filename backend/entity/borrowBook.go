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
	Borb_Day       time.Time `valid:"Past~วันที่ยืมหนังสือต้องไม่เป็นวันในอดีต"`
	Return_Day     time.Time `valid:"Past~วันกำหนดคืนหนังสือต้องไม่เป็นวันในอดีต"`
	Color_Bar      string    `valid:"required~เเถบสีหนังสือต้องไม่เป็นค่าว่าง"`
	Borb_Frequency int       `valid:"required~จำนวนครั้งที่ยืมหนังสือ must be 1-100, range(1|100)~จำนวนครั้งที่ยืมหนังสือ must be 1-100"`
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
		return t.After(time.Now().Add(time.Minute*-2)) || t.Equal(time.Now())
		//return t.Before(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("Future", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now()
		return now.Before(time.Time(t))
	})

}

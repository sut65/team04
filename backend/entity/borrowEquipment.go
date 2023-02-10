package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type BorrowEquipment struct {
	gorm.Model
	BorrowEquipment_Day    time.Time `valid:"Past~วันที่และเวลาต้องไม่เป็นอดีต,Future~วันที่และเวลาต้องไม่เป็นอนาคต"`
	Amount_BorrowEquipment int       `valid:"required~ข้อมูลจำนวนไม่ถูกต้อง,range(1|5)~ข้อมูลจำนวนไม่ถูกต้อง"`
	TrackingCheck          bool

	// BorrowEquipment_Day    time.Time `valid:"required,past~ข้อมูลวันที่และเวลาที่บันทึกต้องไม่เป็นอดีต, future~ข้อมูลวันที่และเวลาที่บันทึกต้องไม่เป็นอนาคต"`
	// Amount_BorrowEquipment int       `valid:"required,range(1|5)~ยืมได้ครั้งละ 1- 5 ชิ้น/1อุปกรณ์"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id" valid:"-"`

	UserID *uint
	User   User `gorm:"references:id" valid:"-"`

	EquipmentPurchasingID *uint
	EquipmentPurchasing   EquipmentPurchasing `gorm:"references:id" valid:"-"`

	ReturnEquipments []ReturnEquipment `gorm:"foreignKey:BorrowEquipmentID"`
}

// ฟังก์ชันที่จะใช่ในการ validation EntryTime
func init() {
	govalidator.CustomTypeTagMap.Set("Past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute*-5)) || t.Equal(time.Now())
		//return t.Before(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("Future", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Before(time.Now().Add(time.Minute*5)) || t.Equal(time.Now())

		// now := time.Now()
		// return now.Before(time.Time(t))
	})
}

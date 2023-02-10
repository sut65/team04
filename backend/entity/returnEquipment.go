package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type EquipmentStatus struct {
	gorm.Model
	Name string

	ReturnEquipment []ReturnEquipment `gorm:"foreignKey:EquipmentStatusID"`
}

type ReturnEquipment struct {
	gorm.Model
	Return_Day    time.Time `valid:"Past~วันที่และเวลาต้องไม่เป็นอดีต,Future~วันที่และเวลาต้องไม่เป็นอนาคต"`
	Return_Detail string    `valid:"required~กรุณากรอกรายละเอียดเพิ่มเติม"`

	EquipmentStatusID *uint
	EquipmentStatus   EquipmentStatus `gorm:"references:id" valid:"-"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id" valid:"-"`

	BorrowEquipmentID *uint
	BorrowEquipment   BorrowEquipment `gorm:"references:id" valid:"-"`
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

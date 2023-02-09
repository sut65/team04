package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type EquipmentRepair struct {
	gorm.Model
	EquipmentPurchasingID *uint
	EquipmentPurchasing   EquipmentPurchasing `gorm:"references:id" valid:"-"`

	LevelID *uint
	Level   Level `gorm:"references:id" valid:"-"`

	Date time.Time `valid:"Past~วันที่แจ้งซ่อมอุปกรณ์ต้องไม่เป็นวันในอดีต,Future~วันที่แจ้งซ่อมอุปกรณ์ต้องไม่เป็นวันในอนาคต"`

	Note string `valid:"required~Note cannot be blank"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id" valid:"-"`
}

// ฟังก์ชันที่จะใช่ในการ validation EntryTime
func init() {
	govalidator.CustomTypeTagMap.Set("Past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute*-24)) || t.Equal(time.Now())
		//return t.Before(time.Now())
	})

	// govalidator.CustomTypeTagMap.Set("Now", func(i interface{}, context interface{}) bool {
	//     t := i.(time.Time)
	//     now := time.Now()
	//     return now.Before(time.Time(t))
	// })

	govalidator.CustomTypeTagMap.Set("Future", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Before(time.Now().Add(time.Minute*24)) || t.Equal(time.Now())

		// now := time.Now()
		// return now.Before(time.Time(t))
	})
}

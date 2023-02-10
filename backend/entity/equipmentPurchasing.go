package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type EquipmentCategory struct {
	gorm.Model
	Name string

	EquipmentPurchasing []EquipmentPurchasing `gorm:"foreignKey:EquipmentCategoryID"`
}

type Company struct {
	gorm.Model
	Name string `gorm:"uniqueIndex"`

	EquipmentPurchasing []EquipmentPurchasing `gorm:"foreignKey:CompanyID"`
}

type EquipmentPurchasing struct {
	gorm.Model
	EquipmentName string    `valid:"required~กรุณากรอกชื่ออุปกรณ์"`
	Amount        uint      `valid:"required~จำนวนอุปกรณ์ต้องมากกว่า 0 กรุณาลองใหม่อีกครั้ง,MoreThanZero~จำนวนอุปกรณ์ต้องมากกว่า 0 กรุณาลองใหม่อีกครั้ง"`
	Date          time.Time `valid:"present~วันที่จัดซื้ออุปกรณ์ต้องเป็นปัจจุบัน กรุณาลองใหม่อีกครั้ง"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	EquipmentCategoryID *uint
	EquipmentCategory   EquipmentCategory `gorm:"references:id;"`

	CompanyID *uint
	Company   Company `gorm:"references:id;"`

	BorrowEquipments []BorrowEquipment `gorm:"foreignKey:EquipmentPurchasingID"`
	EquipmentRepair  []EquipmentRepair `gorm:"foreignKey:EquipmentPurchasingID"`
}

// ฟังก์ชันที่จะใช่ในการ validation EntryTime
func init() {
	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(10-time.Minute)) && t.Before(time.Now().Add(10+time.Minute))
	})

	govalidator.CustomTypeTagMap.Set("MoreThanZero", func(i interface{}, context interface{}) bool {
		t := i.(uint)
		if t <= 0 {
			return false
		} else {
			return true
		}
	})

}

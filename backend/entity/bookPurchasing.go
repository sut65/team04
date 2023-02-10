package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Librarian struct {
	gorm.Model
	Name     string
	Tel      string
	Email    string `gorm:"uniqueIndex"`
	Password string

	BookPurchasings  []BookPurchasing  `gorm:"foreignKey:LibrarianID"`
	BorrowBooks      []BorrowBook      `gorm:"foreignKey:LibrarianID"`
	ReturnBooks      []ReturnBook      `gorm:"foreignKey:LibrarianID"`
	Forfeit          []Forfeit         `gorm:"foreignKey:PaymentID"`
	BorrowEquipments []BorrowEquipment `gorm:"foreignKey:LibrarianID"`
	ReturnEquipments []ReturnEquipment `gorm:"foreignKey:LibrarianID"`
	BookRepair       []BookRepair      `gorm:"foreignKey:LibrarianID"`
	EquipmentRepair  []EquipmentRepair `gorm:"foreignKey:LibrarianID"`

	Preorder     []Preorder     `gorm:"foreignKey:LibrarianID"`
	Confirmation []Confirmation `gorm:"foreignKey:LibrarianID"`
}

type BookCategory struct {
	gorm.Model
	Name string

	BookPurchasings []BookPurchasing `gorm:"foreignKey:BookCategoryID"`
}

type Publisher struct {
	gorm.Model
	Name string `gorm:"uniqueIndex"`

	BookPurchasings []BookPurchasing `gorm:"foreignKey:PublisherID"`
}

type BookPurchasing struct {
	gorm.Model
	BookName   string    `valid:"required~กรุณากรอกชื่อหนังสือ"`
	AuthorName string    `valid:"required~กรุณากรอกชื่อผู้แต่ง"`
	Amount     uint      `valid:"required~จำนวนหนังสือต้องมากกว่า 0 กรุณาลองใหม่อีกครั้ง,MoreThanZero~จำนวนหนังสือต้องมากกว่า 0 กรุณาลองใหม่อีกครั้ง"`
	Date       time.Time `valid:"present~วันที่จัดซื้อหนังสือต้องเป็นปัจจุบัน กรุณาลองใหม่อีกครั้ง"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id" valid:"-"`

	BookCategoryID *uint
	BookCategory   BookCategory `gorm:"references:id" valid:"-"`

	PublisherID *uint
	Publisher   Publisher `gorm:"references:id" valid:"-"`

	BorrowBooks []BorrowBook `gorm:"foreignKey:BookPurchasingID"`
	BookRepair  []BookRepair `gorm:"foreignKey:BookPurchasingID"`
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

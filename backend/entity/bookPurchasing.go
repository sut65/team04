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
	BookRepair		 []BookRepair      `gorm:"foreignKey:LibrarianID"`
	EquipmentRepair	 []EquipmentRepair      `gorm:"foreignKey:LibrarianID"`

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
	BookName   string    `valid:"required~BookName cannot be blank"`
	AuthorName string    `valid:"required~Author cannot be blank"`
	Amount     uint      `valid:"required~ข้อมูลจำนวนไม่ถูกต้อง"`
	Date       time.Time `valid:"Past~วันที่และเวลาต้องไม่เป็นอดีต"`

	LibrarianID *uint
	Librarian   Librarian `gorm:"references:id;"`

	BookCategoryID *uint
	BookCategory   BookCategory `gorm:"references:id;"`

	PublisherID *uint
	Publisher   Publisher `gorm:"references:id;"`

	BorrowBooks []BorrowBook `gorm:"foreignKey:BookPurchasingID"`
	BookRepair []BookRepair `gorm:"foreignKey:BookPurchasingID"`
}

// ฟังก์ชันที่จะใช่ในการ validation EntryTime
func init() {
	govalidator.CustomTypeTagMap.Set("Past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute*-2)) || t.Equal(time.Now())
		//return t.Before(time.Now())
	})
}

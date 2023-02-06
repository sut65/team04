package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type BookType struct {
	gorm.Model
	Name string

	Introduce []Introduce `gorm:"foreignKey:BookTypeID"`
}

type Objective struct {
	gorm.Model
	Name string

	Introduce []Introduce `gorm:"foreignKey:ObjectiveID"`
}

type Introduce struct {
	gorm.Model
	Title    string    `valid:"required~กรุณากรอกชื่อหนังสือที่ต้องการแนะนำ"`
	Author   string    `valid:"required~กรุณากรอกชื่อผู้แต่ง"`
	ISBN     string    `valid:"required~เลข ISBN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง,matches(^97([8|9])([0-9]{10}$))~เลข ISBN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"`
	Edition  int       `valid:"required~ครั้งที่พิมพ์ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง, range(1|60)~ครั้งที่พิมพ์ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"`
	Pub_Name string    `valid:"required~กรุณากรอกชื่อสำนักพิมพ์"`
	Pub_Year string    `valid:"required~กรุณากรอกปีพิมพ์ของหนังสือ"`
	I_Date   time.Time `valid:"present~วันที่แนะนำหนังสือต้องเป็นปัจจุบัน"`

	BookTypeID *uint
	BookType   BookType `gorm:"references:id;" valid:"-"`

	ObjectiveID *uint
	Objective   Objective `gorm:"references:id;" valid:"-"`

	UserID *uint
	User   User `gorm:"references:id;" valid:"-"`
}

// ฟังก์ชันที่จะใช่ในการ validation EntryTime
func init() {
	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now()
		return t.After(now.Add(3-time.Minute)) && t.Before(now.Add(3+time.Minute))
	})

}

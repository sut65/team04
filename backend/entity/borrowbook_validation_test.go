package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ข้อมูลถูกต้องหมดทุก field
func TestBorrowBookCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format ReturnBook", func(t *testing.T) {
		borrowbook := BorrowBook{
			Borb_Day:       time.Now(),
			Return_Day:     time.Now(),
			Color_Bar:      "สีเเดง",
			Borb_Frequency: 1,
		}
		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(borrowbook)

		//เช็คว่ามันเป็นค่าจริงไหม
		g.Expect(ok).To(BeTrue())

		//เช็คว่ามันว่างไหม
		g.Expect(err).To((BeNil()))

		fmt.Println(err)
	})
}

// ตรวจสอบค่าว่างของเเถบสีแล้วต้องเจอ Error
func TestColor_BarNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	borrowbook := BorrowBook{
		Borb_Day:       time.Now(),
		Return_Day:     time.Now(),
		Color_Bar:      "", //ผิด
		Borb_Frequency: 1,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(borrowbook)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("เเถบสีหนังสือต้องไม่เป็นค่าว่าง"))
}

// ตรวจสอบวันเวลาที่ยืมหนังสือต้องไม่เป็นอดีต
func TestBorb_DayMustNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	borrowbook := BorrowBook{
		Borb_Day:       time.Now().Add(-24 * time.Hour), //ผิด
		Return_Day:     time.Now(),
		Color_Bar:      "สีเเดง",
		Borb_Frequency: 1,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(borrowbook)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันที่ยืมหนังสือต้องไม่เป็นวันในอดีต"))
}

// ตรวจสอบวันเวลาวันกำหนดคืนหนังสือต้องไม่เป็นอดีต
func TestReturn_DayMustNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	borrowbook := BorrowBook{
		Borb_Day:       time.Now(),
		Return_Day:     time.Now().Add(-24 * time.Hour), //ผิด
		Color_Bar:      "สีเเดง",
		Borb_Frequency: 1,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(borrowbook)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันกำหนดคืนหนังสือต้องไม่เป็นวันในอดีต"))

}

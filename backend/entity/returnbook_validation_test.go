package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบข้อมูลต้องถูกต้องหมดทุก field
func TestAllReturnBookCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	returnbook := ReturnBook{
		Current_Day:    time.Now(),
		Late_Number:    0,
		Book_Condition: "สมบูรณ์ ปกติดี",
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(returnbook)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).To(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).To((BeNil()))

}

// ตรวจสอบค่าว่างของสภาพหนังสือแล้วต้องเจอ Error
func TestBook_ConditionNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	returnbook := ReturnBook{
		Current_Day:    time.Now(),
		Late_Number:    0,
		Book_Condition: "", //ผิด
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(returnbook)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกข้อมูลสภาพหนังสือ"))

}

// ตรวจสอบวันที่คืนหนังสือต้องเป็นวันปัจจุบัน
func TestCurrent_DayMustBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []time.Time{
		time.Now().Add(+24 * time.Hour),
		time.Now().Add(-24 * time.Hour),
	}

	for _, currentDay := range fixture {
		returnbook := ReturnBook{
			Current_Day:    currentDay, //ผิด
			Late_Number:    2,
			Book_Condition: "สมบูรณ์ ปกติดี",
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(returnbook)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("วันที่คืนหนังสือต้องเป็นปัจจุบัน กรุณาลองใหม่อีกครั้ง"))
	}
}

// ตรวจสอบวันเลยกำหนดคืนต้องเป็นตัวเลขมากกว่าหรือเท่ากับ 0 - 1000
func TestLate_NumberMustBeMoreThanEqualZero(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []int{
		-2, -1}

	for _, lateNumber := range fixture {
		returnbook := ReturnBook{
			Current_Day:    time.Now(),
			Late_Number:    lateNumber, //ผิด
			Book_Condition: "สมบูรณ์ ปกติดี",
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(returnbook)

		//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("จำนวนวันเลยกำหนดคืนต้องเป็นตัวเลขมากกว่าหรือเท่ากับ 0 - 1000"))
	}
}

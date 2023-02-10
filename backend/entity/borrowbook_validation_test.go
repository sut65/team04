package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบข้อมูลต้องถูกต้องหมดทุก field
func TestAllBorrowBookCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	borrowbook := BorrowBook{
		Borb_Day:       time.Now(),
		Return_Day:     time.Now(),
		Color_Bar:      "สีชมพู",
		Borb_Frequency: 1,
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(borrowbook)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).To(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).To((BeNil()))

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
	g.Expect(err.Error()).To(Equal("กรุณากรอกเเถบสีหนังสือที่เเบ่งตามหมวดหมู่"))
}

// ตรวจสอบวันที่ยืมหนังสือต้องเป็นปัจจุบัน
func TestBorb_DayMustBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []time.Time{
		time.Now().Add(+24 * time.Hour),
		time.Now().Add(-24 * time.Hour),
	}

	for _, borbDay := range fixture {
		borrowbook := BorrowBook{
			Borb_Day:       borbDay, //ผิด
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
		g.Expect(err.Error()).To(Equal("วันที่ยืมหนังสือต้องเป็นปัจจุบัน กรุณาลองใหม่อีกครั้ง"))
	}
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
	g.Expect(err.Error()).To(Equal("วันกำหนดคืนหนังสือต้องไม่เป็นวันในอดีต กรุณาลองใหม่อีกครั้ง"))

}

// ตรวจสอบจำนวนครั้งที่ยืมหนังสือต้องเป็นตัวเลข 1-1000
func TestBorb_FrequencyMustMoreThanZero(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []int{
		0, 1001}

	for _, borbFrequency := range fixture {
		borrowbook := BorrowBook{
			Borb_Day:       time.Now(),
			Return_Day:     time.Now(),
			Color_Bar:      "สีเหลือง",
			Borb_Frequency: borbFrequency, //ผิด
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(borrowbook)

		//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("จำนวนครั้งที่ยืมหนังสือต้องเป็นตัวเลขระหว่าง 1-1000"))

	}
}

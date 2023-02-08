package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestBorrowEquipmentCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	borrowequipment := BorrowEquipment{
		BorrowEquipment_Day:    time.Now(),
		Amount_BorrowEquipment: 2,
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(borrowequipment)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).To(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).To((BeNil()))

}

// // ตรวจสอบจำนวนอุปกรณ์ต้องเป็นตัวเลขที่อยู่ในช่วง 1-5
func TestAmountMustBeInRange(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []int{
		10,
		6,
		-1,
		0,
	}
	for _, fixture := range fixtures {
		borrowequipment := BorrowEquipment{
			BorrowEquipment_Day:    time.Now(),
			Amount_BorrowEquipment: fixture, //ผิด
		}

		ok, err := govalidator.ValidateStruct(borrowequipment)

		// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error() ต้องมี message แสดงออกมา
		g.Expect(err.Error()).To(Equal("ข้อมูลจำนวนไม่ถูกต้อง"))
	}
}

// ตรวจสอบวันเวลาที่บันทึกต้องไม่เป็นเวลาในอดีต
func TestBorrowEquipmentMustNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	borrowequipment := BorrowEquipment{
		BorrowEquipment_Day:    time.Now().Add(-24 * time.Hour), //ผิด
		Amount_BorrowEquipment: 2,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(borrowequipment)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันที่และเวลาต้องไม่เป็นอดีต"))
}

// ตรวจสอบวันเวลาที่บันทึกต้องไม่เป็นเวลาในอนาคต
func TestBorrowEquipmenttNotBeFuture(t *testing.T) {
	g := NewGomegaWithT(t)

	borrowequipment := BorrowEquipment{
		BorrowEquipment_Day:    time.Now().Add(48 * time.Hour), //ผิด
		Amount_BorrowEquipment: 2,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(borrowequipment)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันที่และเวลาต้องไม่เป็นอนาคต"))
}

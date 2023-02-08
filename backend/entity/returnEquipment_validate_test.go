package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestReturnEquipmentCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	returnequipment := ReturnEquipment{
		Return_Day:    time.Now(),
		Return_Detail: "ปกติ",
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(returnequipment)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).To(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).To((BeNil()))

}

// ตรวจสอบค่าว่างของสภาพอุปกรณ์
func TestReturnDetailNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	returnequipment := ReturnEquipment{
		Return_Day:    time.Now(),
		Return_Detail: "", //ผิด
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(returnequipment)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกรายละเอียดเพิ่มเติม"))

}

// ตรวจสอบวันเวลาที่บันทึกต้องไม่เป็นเวลาในอดีต
func TestReturnEquipmentMustNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	returnequipment := ReturnEquipment{
		Return_Day:    time.Now().Add(-24 * time.Hour), //ผิด
		Return_Detail: "ปกติ",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(returnequipment)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันที่และเวลาต้องไม่เป็นอดีต"))
}

// ตรวจสอบวันเวลาที่บันทึกต้องไม่เป็นเวลาในอนาคต
func TestReturnEquipmenttNotBeFuture(t *testing.T) {
	g := NewGomegaWithT(t)

	returnequipment := ReturnEquipment{
		Return_Day:    time.Now().Add(48 * time.Hour), //ผิด
		Return_Detail: "ปกติ",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(returnequipment)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันที่และเวลาต้องไม่เป็นอนาคต"))
}

package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ข้อมูลถูกต้องหมดทุก field
func TestForfeitCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format Forfeit", func(t *testing.T) {
		forfeit := Forfeit{
			Pay:          25,
			Pay_Date:     time.Now(),
			Note:         "ไม่มี",
			ModulateNote: "ไม่มี",
		}
		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(forfeit)

		//เช็คว่ามันเป็นค่าจริงไหม
		g.Expect(ok).To(BeTrue())

		//เช็คว่ามันว่างไหม
		g.Expect(err).To((BeNil()))

		fmt.Println(err)
	})
}

func TestForfeitPay(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []int{
		-2, -1, 14601}

	for _, pay := range fixture {
		forfeit := Forfeit{
			Pay:          pay, //ผิด
			Pay_Date:     time.Now(),
			Note:         "ไม่มี",
			ModulateNote: "ไม่มี",
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(forfeit)

		//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("จำนวนค่าปรับต้องอยู่ระหว่าง 0-14600 บาท กรุณาลองใหม่อีกครั้ง"))

	}
}

func TestForfeitNote(t *testing.T) {
	g := NewGomegaWithT(t)

	forfeit := Forfeit{
		Pay:          25,
		Pay_Date:     time.Now(),
		Note:         "", //ผิด
		ModulateNote: "ไม่มี",
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(forfeit)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกข้อมูลการหาหนังสือมาคืน"))

}

func TestForfeitModulateNote(t *testing.T) {
	g := NewGomegaWithT(t)

	forfeit := Forfeit{
		Pay:          25,
		Pay_Date:     time.Now(),
		Note:         "ไม่มี",
		ModulateNote: "", //ผิด
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(forfeit)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกข้อมูลการขอลดหย่อน"))

}

func TestPayDateMustBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []time.Time{
		time.Now().Add(24 * time.Hour),
		time.Now().Add(24 - time.Hour),
	}

	for _, paydate := range fixtures {

		forfeit := Forfeit{
			Pay:          25,
			Pay_Date:     paydate, //ผิด
			Note:         "ไม่มี",
			ModulateNote: "ไม่มี",
		}

		ok, err := govalidator.ValidateStruct(forfeit)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("วันที่บันทึกการชำระค่าปรับต้องเป็นปัจจุบัน"))
	}
}

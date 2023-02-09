package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ข้อมูลถูกต้องหมดทุก field
func TestBookRepairCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format BookRepair", func(t *testing.T) {
		bookrepair := BookRepair{
			Date:       time.Now(),
			Note: 		"Not OK",
		}
		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(bookrepair)

		//เช็คว่ามันเป็นค่าจริงไหม
		g.Expect(ok).To(BeTrue())

		//เช็คว่ามันว่างไหม
		g.Expect(err).To((BeNil()))

		fmt.Println(err)
	})
}

func TestBookRepairNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

		bookrepair := BookRepair{
			Date:       time.Now().Add(-24 * time.Hour), //ผิด,
			Note: 		"Not OK",
		}
		// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bookrepair)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันที่แจ้งซ่อมหนังสือต้องไม่เป็นวันในอดีต"))
}

func TestBookRepairNotBeFuture(t *testing.T) {
	g := NewGomegaWithT(t)

		bookrepair := BookRepair{
			Date:       time.Now().Add(+24 * time.Hour), //ผิด,
			Note: 		"Not OK",
		}
		// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bookrepair)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันที่แจ้งซ่อมหนังสือต้องไม่เป็นวันในอนาคต"))
}

func TestNoteNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	bookrepair := BookRepair{
		Date: 	time.Now(),
		Note: 	"", //ผิด
		
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bookrepair)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).NotTo(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).NotTo(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Note cannot be blank"))
}
package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบหมายเหตุชื่อผู้รับต้องไม่เป็นค่าว่าง
func TestConfirmationNoteNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check NoteName", func(t *testing.T) {
		confirm := Confirmation{

			NoteName: "", //ผิด
			NoteTel:  "0847852369",
			Datetime: time.Now(),
		}
		ok, err := govalidator.ValidateStruct(confirm)

		g.Expect(ok).ToNot(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("NoteName cannot be blank"))
	})
}

// ตรวจสอบหมายเหตุเบอร์ผู้รับ ต้องขึ้นต้นด้วย '0' ตามด้วย '6','8','9' และตามด้วย '0'-'9' จำนวน 8 ตัว
func TestNoteTelMustBeInValidPattern(t *testing.T) {
	g := NewGomegaWithT(t)
	fixtures := []string{
		"0000000000",  // เป็น 0
		"0200000000",  // ขึ้นต้นด้วย 0 ตามด้วย 2 และตามด้วย string 8 ตัว
		"090-0000000", // มีขีดคั่น
		"080000000",   // ขึ้นต้นด้วย 0 ตามด้วย 8 และตามด้วย string 7 ตัว
		"9912345678",  // ขึ้นต้นด้วย 9
		"090",         // ตัวอักษร 3 ตัว
		"0",           // ตัวอักษร 1 ตัว
	}

	for _, fixture := range fixtures {
		c := Confirmation{
			NoteName: "Maprang Saengarun",
			NoteTel:  fixture, //ผิด
			Datetime: time.Now(),
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(c)
		g.Expect(ok).ToNot(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("NoteTel invalid"))
	}
}

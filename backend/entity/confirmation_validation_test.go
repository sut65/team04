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

package entity

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบชื่อหนังสือไม่เป็นค่าว่าง - ถ้าไม่ตรงจะ error
func TestPreorderNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	pr := Preorder{
		Name:       "", //ผิด
		Price:      150,
		Author:     "maprang",
		Edition:    1,
		Year:       "2010",
		Quantity:   1,
		Totalprice: 150,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(pr)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Name cannot be blank"))
}

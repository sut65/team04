package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบข้อมูลต้องถูกต้องหมดทุก field
func TestBookPurchasingCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	bookPurchasing := BookPurchasing{
		BookName:   "ภาษาไพธอน",
		AuthorName: "อาจารย์กร",
		Amount:     70,
		Date:       time.Now(),
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bookPurchasing)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).To(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).To((BeNil()))

}

// ตรวจสอบค่าว่างของ BookName แล้วต้องเจอ Error
func TestBookNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	bookname := BookPurchasing{
		BookName:   "",
		AuthorName: "อาจารย์กร",
		Amount:     70,
		Date:       time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bookname)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกชื่อหนังสือ"))
}

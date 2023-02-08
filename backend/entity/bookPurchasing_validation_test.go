package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบค่าว่างของชื่อแล้วต้องเจอ Error
func TestBookNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	bookPurchasing := BookPurchasing{
		BookName:   "", // ผิด
		AuthorName: "อาจารย์กร",
		Amount:     70,
		Date:       time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bookPurchasing)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("BookName cannot be blank"))
}

func TestAuthorNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	bookPurchasing := BookPurchasing{
		BookName:   "ภาษาไพธอน",
		AuthorName: "", // ผิด
		Amount:     70,
		Date:       time.Now(),
	}

	ok, err := govalidator.ValidateStruct(bookPurchasing)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Author cannot be blank"))
}

// ตรวจสอบวันเวลาที่บันทึกต้องไม่เป็นเวลาในอดีต
func TestDateMustNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	bookPurchasing := BookPurchasing{
		BookName:   "ภาษาไพธอน",
		AuthorName: "อาจารย์กร",
		Amount:     70,
		Date:       time.Now().Add(-24 * time.Hour), //ผิด,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bookPurchasing)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("วันที่และเวลาต้องไม่เป็นอดีต"))
}
func TestAmountNotZero(t *testing.T) {
	g := NewGomegaWithT(t)

	bookPurchasing := BookPurchasing{
		BookName:   "ภาษาไพธอน",
		AuthorName: "อาจารย์กร",
		Amount:     0,
		Date:       time.Now(),
	}

	ok, err := govalidator.ValidateStruct(bookPurchasing)

	// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error() ต้องมี message แสดงออกมา
	g.Expect(err.Error()).To(Equal("ข้อมูลจำนวนไม่ถูกต้อง"))
}

func TestCorrectBookPurchasing(t *testing.T) {
	g := NewGomegaWithT(t)

	bookPurchasing := BookPurchasing{
		BookName:   "ภาษาไพธอน",
		AuthorName: "อาจารย์กร",
		Amount:     70,
		Date:       time.Now(),
	}

	ok, err := govalidator.ValidateStruct(bookPurchasing)
	g.Expect(ok).To(BeTrue()) //เช็คว่ามันเป็นค่าจริงไหม

	g.Expect(err).To(BeNil()) //เช็คว่ามันว่างไหม

}

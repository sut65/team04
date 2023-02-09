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

// ตรวจสอบค่าว่างของ AuthorName แล้วต้องเจอ Error
func TestAuthorNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	authorname := BookPurchasing{
		BookName:   "ภาษาไพธอน",
		AuthorName: "",
		Amount:     70,
		Date:       time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(authorname)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกชื่อผู้แต่ง"))
}

// ตรวจสอบวันที่บันทึกข้อมูลต้องเป็นปัจจุบันและไม่เป็นอนาคต
func TestDateBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []time.Time{
		time.Now().Add(+24 * time.Hour),
		time.Now().Add(-24 * time.Hour),
	}

	for _, datetime := range fixture {
		datePurchasing := BookPurchasing{
			BookName:   "ภาษาไพธอน",
			AuthorName: "อาจารย์กร",
			Amount:     70,
			Date:       datetime,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(datePurchasing)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("วันที่จัดซื้อหนังสือต้องเป็นปัจจุบัน กรุณาลองใหม่อีกครั้ง"))
	}
}

// ตรวจสอบจำนวนหนังสือที่สั่งซื้อ
func TestAmount(t *testing.T) {
	g := NewGomegaWithT(t)

	amount := BookPurchasing{
		BookName:   "ภาษาไพธอน",
		AuthorName: "อาจารย์กร",
		Amount:     0,
		Date:       time.Now(),
	}
	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(amount)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("จำนวนหนังสือต้องมากกว่า 0 กรุณาลองใหม่อีกครั้ง"))

}

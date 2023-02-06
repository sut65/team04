package entity

import (
	"fmt"
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ค่าที่ถูกต้องทั้งหมด
func TestCorrectPreorder(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format", func(t *testing.T) {
		pr := Preorder{
			Name:       "CSS & JAVA",
			Price:      150,
			Author:     "J.Sonar",
			Edition:    1,
			Year:       "2022",
			Quantity:   1,
			Totalprice: 150,
		}
		ok, err := govalidator.ValidateStruct(pr)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To((BeNil()))

		fmt.Println(err)
	})
}

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

// ตรวจสอบราคาหนังสือ ต้องเป็นตัวเลขมากกว่า 0 - ถ้าไม่ตรงจะ error
func TestPreorderPriceNotZero(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []int{
		-1, 0, 10000}

	for _, price := range fixture {
		pr := Preorder{
			Name:       "Css",
			Price:      price, //ผิด
			Author:     "maprang",
			Edition:    1,
			Year:       "2010",
			Quantity:   1,
			Totalprice: 150,
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(pr)

		//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Price must greater than zero"))

	}
}

// ตรวจสอบชื่อผู้แต่งแล้วไม่เป็นค่าว่าง - ถ้าไม่ตรงจะ error
func TestPreorderAuthorNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	pr := Preorder{
		Name:       "css",
		Price:      150,
		Author:     "", //ผิด
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
	g.Expect(err.Error()).To(Equal("Author cannot be blank"))
}

// ตรวจสอบพิมพ์ครั้งที่ ต้องเป็นตัวเลขมากกว่า 0 - ถ้าไม่ตรงจะ error
func TestPreorderEditionNotZero(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []int{
		-1, 0, 10000}

	for _, edition := range fixture {
		pr := Preorder{
			Name:       "Css",
			Price:      1,
			Author:     "maprang",
			Edition:    edition, //ผิด
			Year:       "2010",
			Quantity:   1,
			Totalprice: 150,
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(pr)

		//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Edition must greater than zero"))

	}
}

// ตรวจสอบปีที่พิมพ์ต้องไม่เป็นค่าว่าง - ถ้าไม่ตรงจะ error
func TestPreorderYearNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	pr := Preorder{
		Name:       "css",
		Price:      150,
		Author:     "maprang",
		Edition:    1,
		Year:       "", //ผิด
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
	g.Expect(err.Error()).To(Equal("year cannot be blank"))
}

// ตรวจสอบจำนวนเล่ม ต้องเป็นตัวเลข มากกว่า 0 น้อยกว่า 5 - ถ้าไม่ตรงจะ error
func TestPreorderQuantity(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []int{
		0, 6, 51}

	for _, quantity := range fixture {
		pr := Preorder{
			Name:       "Css",
			Price:      150,
			Author:     "maprang",
			Edition:    1,
			Year:       "2010",
			Quantity:   quantity, //ผิด
			Totalprice: 150,
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(pr)

		//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("quantity must be 1-5"))

	}
}

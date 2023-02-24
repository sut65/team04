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
	g.Expect(err.Error()).To(Equal("กรุณากรอกชื่อหนังสือ"))
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
		g.Expect(err.Error()).To(Equal("ราคาหนังสือไม่ถูกต้อง"))

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
	g.Expect(err.Error()).To(Equal("กรุณากรอกชื่อผู้แต่งหนังสือ"))
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
		g.Expect(err.Error()).To(Equal("จำนวนครั้งที่พิมพ์ไม่ถูกต้อง"))

	}
}

// ตรวจสอบปีที่พิมพ์ต้องไม่เป็นค่าว่าง - ถ้าไม่ตรงจะ error
func TestPreorderYearNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []string{
		"12",
		"",
		"25000",
		"201",
	}

	for _, year := range fixture {
		pr := Preorder{
			Name:       "Css",
			Price:      1,
			Author:     "maprang",
			Edition:    1,
			Year:       year, //ผิด
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
		g.Expect(err.Error()).To(Equal("ปีที่พิมพ์ไม่ถูกต้อง"))

	}
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
		g.Expect(err.Error()).To(Equal("จำนวนหนังสือควรมีตั้งแต่ 1-5 เท่านั้น"))

	}
}

// ตรวจสอบราคารวมทั้งหมด ต้องเป็นตัวเลขมากกว่า 0 - ถ้าไม่ตรงจะ error
func TestPreorderTotalPriceNotZero(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []int{
		-1, 0, 10000}

	for _, ttp := range fixture {
		pr := Preorder{
			Name:       "Css",
			Price:      1,
			Author:     "maprang",
			Edition:    2,
			Year:       "2010",
			Quantity:   1,
			Totalprice: ttp, //ผิด
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(pr)

		//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("ราคารวมทั้งหมดไม่ถูกต้อง"))

	}
}

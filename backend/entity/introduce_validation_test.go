package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ข้อมูลถูกต้องหมดทุก field
func TestIntroduceCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format Introduce", func(t *testing.T) {
		introduce := Introduce{
			Title:    "แคลคูลัส 1 สำหรับวิศวกร",
			Author:   "รศ. ดร.ธีระศักดิ์ อุรัจนานนท์",
			ISBN:     "9786162139130",
			Edition:  1,
			Pub_Name: "สกายบุ๊กส์ บ.จ.ก.",
			Pub_Year: "2012",
			I_Date:   time.Now(),
		}
		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(introduce)

		//เช็คว่ามันเป็นค่าจริงไหม
		g.Expect(ok).To(BeTrue())

		//เช็คว่ามันว่างไหม
		g.Expect(err).To((BeNil()))

		fmt.Println(err)
	})
}

func TestIntroduceTitle(t *testing.T) {
	g := NewGomegaWithT(t)

	introduce := Introduce{
		Title:    "", // ผิด
		Author:   "รศ. ดร.ธีระศักดิ์ อุรัจนานนท์",
		ISBN:     "9786162139130",
		Edition:  1,
		Pub_Name: "สกายบุ๊กส์ บ.จ.ก.",
		Pub_Year: "2012",
		I_Date:   time.Now(),
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(introduce)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกชื่อหนังสือที่ต้องการแนะนำ"))

}

func TestIntroduceAuthor(t *testing.T) {
	g := NewGomegaWithT(t)

	introduce := Introduce{
		Title:    "แคลคูลัส 1 สำหรับวิศวกร",
		Author:   "", // ผิด
		ISBN:     "9786162139130",
		Edition:  1,
		Pub_Name: "สกายบุ๊กส์ บ.จ.ก.",
		Pub_Year: "2012",
		I_Date:   time.Now(),
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(introduce)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกชื่อผู้แต่ง"))

}

func TestIntroduceISBN(t *testing.T) {
	g := NewGomegaWithT(t)
	fixtures := []string{
		"0000000000000", // เป็น 0
		"9800000000000", // ขึ้นต้นด้วย 9 ตามด้วย 8 และตามด้วย string 11 ตัว
		"97800-0000000", // มีขีดคั่น
		"978000000000",  // ขึ้นต้นด้วย 97 ตามด้วย 8 และตามด้วย string 9 ตัว
		"1111234567890", // ขึ้นต้นด้วย 1
		"978",           // ตัวอักษร 3 ตัว
		"9",             // ตัวอักษร 1 ตัว
	}

	for _, isbn := range fixtures {
		introduce := Introduce{
			Title:    "แคลคูลัส 1 สำหรับวิศวกร",
			Author:   "รศ. ดร.ธีระศักดิ์ อุรัจนานนท์",
			ISBN:     isbn, // ผิด
			Edition:  1,
			Pub_Name: "สกายบุ๊กส์ บ.จ.ก.",
			Pub_Year: "2012",
			I_Date:   time.Now(),
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(introduce)
		g.Expect(ok).ToNot(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("เลข ISBN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"))
	}
}

func TestIntroduceEdition(t *testing.T) {
	g := NewGomegaWithT(t)

	fixture := []int{
		-1, -2, 0, 61}

	for _, edition := range fixture {
		introduce := Introduce{
			Title:    "แคลคูลัส 1 สำหรับวิศวกร",
			Author:   "รศ. ดร.ธีระศักดิ์ อุรัจนานนท์",
			ISBN:     "9786162139130",
			Edition:  edition,
			Pub_Name: "สกายบุ๊กส์ บ.จ.ก.",
			Pub_Year: "2012",
			I_Date:   time.Now(),
		}

		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(introduce)

		//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("ครั้งที่พิมพ์ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"))

	}
}

func TestIntroducePubName(t *testing.T) {
	g := NewGomegaWithT(t)

	introduce := Introduce{
		Title:    "แคลคูลัส 1 สำหรับวิศวกร",
		Author:   "รศ. ดร.ธีระศักดิ์ อุรัจนานนท์",
		ISBN:     "9786162139130",
		Edition:  1,
		Pub_Name: "", // ผิด
		Pub_Year: "2012",
		I_Date:   time.Now(),
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(introduce)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกชื่อสำนักพิมพ์"))

}

func TestIntroducePubYear(t *testing.T) {
	g := NewGomegaWithT(t)

	introduce := Introduce{
		Title:    "แคลคูลัส 1 สำหรับวิศวกร",
		Author:   "รศ. ดร.ธีระศักดิ์ อุรัจนานนท์",
		ISBN:     "9786162139130",
		Edition:  1,
		Pub_Name: "สกายบุ๊กส์ บ.จ.ก.",
		Pub_Year: "", // ผิด
		I_Date:   time.Now(),
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(introduce)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("กรุณากรอกปีพิมพ์ของหนังสือ"))

}

func TestIDateMustBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []time.Time{
		time.Now().Add(24 * time.Hour),
		time.Now().Add(24 - time.Hour),
	}

	for _, idate := range fixtures {

		introduce := Introduce{
			Title:    "แคลคูลัส 1 สำหรับวิศวกร",
			Author:   "รศ. ดร.ธีระศักดิ์ อุรัจนานนท์",
			ISBN:     "9786162139130",
			Edition:  1,
			Pub_Name: "สกายบุ๊กส์ บ.จ.ก.",
			Pub_Year: "2012",
			I_Date:   idate, // ผิด
		}

		ok, err := govalidator.ValidateStruct(introduce)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("วันที่แนะนำหนังสือต้องเป็นปัจจุบัน"))
	}
}

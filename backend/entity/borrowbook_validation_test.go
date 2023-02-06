package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ข้อมูลถูกต้องหมดทุก field
func TestBorrowBookCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format ReturnBook", func(t *testing.T) {
		borrowbook := BorrowBook{
			Borb_Day:       time.Now(),
			Return_Day:     time.Now(),
			Color_Bar:      "สีเเดง",
			Borb_Frequency: 1,
		}
		//ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(borrowbook)

		//เช็คว่ามันเป็นค่าจริงไหม
		g.Expect(ok).To(BeTrue())

		//เช็คว่ามันว่างไหม
		g.Expect(err).To((BeNil()))

		fmt.Println(err)
	})
}

package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบข้อมูลต้องถูกต้องหมดทุก field
func TestReturnBookCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	returnbook := ReturnBook{
		Current_Day:    time.Now(),
		Late_Number:    0,
		Book_Condition: "สมบูรณ์ ปกติดี",
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(returnbook)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).To(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).To((BeNil()))

}

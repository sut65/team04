package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบข้อมูลต้องถูกต้องหมดทุก field
func TestEquipmentPurchasingCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	equipmentPurchasing := EquipmentPurchasing{
		EquipmentName: "หูฟัง",
		Amount:        50,
		Date:          time.Now(),
	}

	//ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(equipmentPurchasing)

	//ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).To(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).To((BeNil()))

}

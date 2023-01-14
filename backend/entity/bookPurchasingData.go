package entity

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func bookPurchasingData(db *gorm.DB) {
	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)
	if err != nil {
		panic("failed to generate password")
	}
	lb := []Librarian{
		{
			Name:     "ศิริวิภา สุระมณี",
			Tel:      "0933193160",
			Email:    "sirivipa@gmail.com",
			Password: string(password),
		},
		{
			Name:     "ธารภิรมณ์ โลนุช",
			Tel:      "0912365478",
			Email:    "thanphirom@gmail.com",
			Password: string(password),
		},
		{
			Name:     "ชนาพร อัปมานะ",
			Tel:      "091-5256587",
			Email:    "chanaporn@gmail.com",
			Password: string(password),
		},
	}

	db.CreateInBatches(lb, len(lb))

	bc := []BookCategory{
		{
			Name: "วรรณคดี",
		},
		{
			Name: "นวนิยาย",
		},
		{
			Name: "ปรัชญา จิตวิทยา",
		},
		{
			Name: "ความรู้ทั่วไป",
		},
		{
			Name: "วิทยาศาสตร์ประยุกต์และเทคโนโลยี",
		},
		{
			Name: "ประวัติศาสตร์ ภูมิศาสตร์และชีวประวัติ",
		},
	}

	db.CreateInBatches(bc, len(bc))

	pb := []Publisher{
		{
			Name: "ซีเอ็ดบุ๊คเซนเตอร์",
		},
		{
			Name: "แจ่มใส",
		},
		{
			Name: "OMG books",
		},
		{
			Name: "นานมีบุ๊คส์",
		},
		{
			Name: "Springbooks",
		},
		{
			Name: "Amarin How to",
		},
	}
	db.CreateInBatches(pb, len(pb))

}

package entity

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("sa-65.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(
		&BookPurchasing{},
		&Librarian{},
		&BookCategory{},
		&Publisher{},
		&User{},
		&BorrowBook{},
		&LostBook{},
		&ReturnBook{},
		&EquipmentPurchasing{},
	)

	db = database

	//
	// User Data สมาชิกห้องสมุด
	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)

	db.Model(&User{}).Create(&User{
		Name:     "มนตรี สุขใจ",
		Idcard:   "1234567890123",
		Tel:      "086-495-4672",
		Email:    "montree@gmail.com",
		Password: string(password),
	})
	db.Model(&User{}).Create(&User{
		Name:     "มุมานะ สุขใจ",
		Idcard:   "1234567890456",
		Tel:      "085-6589421",
		Email:    "mumana@gmail.com",
		Password: string(password),
	})

	var montree User
	var mumana User
	db.Raw("SELECT * FROM users WHERE email = ?", "montree@gmail.com").Scan(&montree)
	db.Raw("SELECT * FROM users WHERE email = ?", "mumana@gmail.com").Scan(&mumana)

	//
	// Librarian Data บรรณารักษ์
	db.Model(&Librarian{}).Create(&Librarian{
		Name:     "ศิริวิภา สุระมณี",
		Tel:      "0933193160",
		Email:    "sirivipa@gmail.com",
		Password: string(password),
	})
	db.Model(&Librarian{}).Create(&Librarian{
		Name:     "ธารภิรมณ์ โลนุช",
		Tel:      "0912365478",
		Email:    "thanphirom@gmail.com",
		Password: string(password),
	})
	db.Model(&Librarian{}).Create(&Librarian{
		Name:     "ชนาพร อัปมานะ",
		Tel:      "091-5256587",
		Email:    "chanaporn@gmail.com",
		Password: string(password),
	})

	var chanaporn Librarian
	var thanphirom Librarian
	var sirivipa Librarian

	db.Raw("SELECT * FROM librarians WHERE email = ?", "thanphirom@gmail.com").Scan(&thanphirom)
	db.Raw("SELECT * FROM librarians WHERE email = ?", "chanaporn@gmail.com").Scan(&chanaporn)
	db.Raw("SELECT * FROM librarians WHERE email = ?", "sirivipa@gmail.com").Scan(&sirivipa)

	//
	//------ BookCategory Data
	bookCategory1 := BookCategory{
		Name: "วรรณคดี",
	}
	db.Model(&BookCategory{}).Create(&bookCategory1)

	bookCategory2 := BookCategory{
		Name: "นวนิยาย",
	}
	db.Model(&BookCategory{}).Create(&bookCategory2)

	bookCategory3 := BookCategory{
		Name: "ปรัชญา จิตวิทยา",
	}
	db.Model(&BookCategory{}).Create(&bookCategory3)

	bookCategory4 := BookCategory{
		Name: "ความรู้ทั่วไป",
	}
	db.Model(&BookCategory{}).Create(&bookCategory4)

	bookCategory5 := BookCategory{
		Name: "วิทยาศาสตร์ประยุกต์และเทคโนโลยี",
	}
	db.Model(&BookCategory{}).Create(&bookCategory5)

	bookCategory6 := BookCategory{
		Name: "ประวัติศาสตร์ ภูมิศาสตร์และชีวประวัติ",
	}
	db.Model(&BookCategory{}).Create(&bookCategory6)

	//
	//------ Publisher Data
	publisher1 := Publisher{
		Name: "ซีเอ็ดบุ๊คเซนเตอร์",
	}
	db.Model(&Publisher{}).Create(&publisher1)

	publisher2 := Publisher{
		Name: "แจ่มใส",
	}
	db.Model(&Publisher{}).Create(&publisher2)

	publisher3 := Publisher{
		Name: "OMG books",
	}
	db.Model(&Publisher{}).Create(&publisher3)

	publisher4 := Publisher{
		Name: "นานมีบุ๊คส์",
	}
	db.Model(&Publisher{}).Create(&publisher4)

	publisher5 := Publisher{
		Name: "Springbooks",
	}
	db.Model(&Publisher{}).Create(&publisher5)

	publisher6 := Publisher{
		Name: "Amarin How to",
	}
	db.Model(&Publisher{}).Create(&publisher6)

	//
	// จำลองตาราง BookPurchasing ---ฟ้า---
	bookPurchasing1 := BookPurchasing{
		BookName:     "เธอมีค่าในเเบบที่เป็น",
		AuthorName:   "คิมจีฮุน",
		Amount:       275,
		Date:         time.Now(),
		BookCategory: bookCategory1,
		Publisher:    publisher4,
		Librarian:    sirivipa,
	}
	db.Model(&BookPurchasing{}).Create(&bookPurchasing1)

	bookPurchasing2 := BookPurchasing{
		BookName:     "ประวัติกฎหมายไทย",
		AuthorName:   "ร.เเลงกานต์",
		Amount:       94,
		Date:         time.Now(),
		BookCategory: bookCategory1,
		Publisher:    publisher1,
		Librarian:    thanphirom,
	}
	db.Model(&BookPurchasing{}).Create(&bookPurchasing2)

	//
	//-----จำลองตาราง BorrowBook ---เปรี้ยว---
	borrowBook1 := BorrowBook{
		Borb_Day:       time.Now(),
		Return_Day:     time.Now().AddDate(+0, +0, +7),
		Color_Bar:      "สีเเดง",
		Borb_Frequency: 1,
		Librarian:      thanphirom,
		User:           montree,
		BookPurchasing: bookPurchasing1,
	}
	db.Model(&BorrowBook{}).Create(&borrowBook1)

	borrowBook2 := BorrowBook{
		Borb_Day:       time.Now(),
		Return_Day:     time.Now().AddDate(+0, +0, +7),
		Color_Bar:      "สีเขียว",
		Borb_Frequency: 15,
		Librarian:      thanphirom,
		User:           mumana,
		BookPurchasing: bookPurchasing2,
	}
	db.Model(&BorrowBook{}).Create(&borrowBook2)

	//
	//------ LostBook Data
	lostBook1 := LostBook{
		Name: "หาย",
	}
	db.Model(&LostBook{}).Create(&lostBook1)

	lostBook2 := LostBook{
		Name: "ไม่หาย",
	}
	db.Model(&LostBook{}).Create(&lostBook2)

	//
	//-----จำลองตาราง ReturnBook ---เปรี้ยว---
	returnBook1 := ReturnBook{
		Current_Day:    time.Now(),
		Late_Number:    5,
		Book_Condition: "สมบูรณ์ ปกติดี",
		LostBook:       lostBook2,
		Librarian:      thanphirom,
		BorrowBook:     borrowBook1,
	}
	db.Model(&ReturnBook{}).Create(&returnBook1)

	returnBook2 := ReturnBook{
		Current_Day:    time.Now(),
		Late_Number:    5,
		Book_Condition: "สมบูรณ์ ปกติดี",
		LostBook:       lostBook2,
		Librarian:      thanphirom,
		BorrowBook:     borrowBook2,
	}
	db.Model(&ReturnBook{}).Create(&returnBook2)
}

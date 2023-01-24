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
		&Payment{}, &Preorder{},
		&Confirmation{},
		&Forfeit{},
		&Introduce{},
		&Objective{},
		&Type{},
		&BorrowEquipment{},
		&EquipmentStatus{},
		&ReturnEquipment{},
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

	//EquipmentCategory --- ฟ้า
	equipmentCategory1 := EquipmentCategory{
		Name: "อุปกรณ์เครื่องเขียน",
	}
	db.Model(&EquipmentCategory{}).Create(&equipmentCategory1)

	equipmentCategory2 := EquipmentCategory{
		Name: "อุปกรณ์อิเล็กทรอนิกส์",
	}
	db.Model(&EquipmentCategory{}).Create(&equipmentCategory2)

	equipmentCategory3 := EquipmentCategory{
		Name: "อุปกรณ์โสตทัศนูปกรณ์",
	}
	db.Model(&EquipmentCategory{}).Create(&equipmentCategory3)

	equipmentCategory4 := EquipmentCategory{
		Name: "อุปกรณ์แสดงผลข้อมูลในรูปแบบเสียง",
	}
	db.Model(&EquipmentCategory{}).Create(&equipmentCategory4)

	equipmentCategory5 := EquipmentCategory{
		Name: "อุปกรณ์พกพา",
	}
	db.Model(&EquipmentCategory{}).Create(&equipmentCategory5)

	//
	//------ Company Data
	Company1 := Company{
		Name: "ไอ.โอ.เทคนิค จำกัด",
	}
	db.Model(&Company{}).Create(&Company1)

	Company2 := Company{
		Name: "เอปสัน พรีซิซั่น (ไทยแลนด์) จำกัด",
	}
	db.Model(&Company{}).Create(&Company2)

	Company3 := Company{
		Name: "ซีพีเค.ไวท์ร์ด จำกัด",
	}
	db.Model(&Company{}).Create(&Company3)

	Company4 := Company{
		Name: "พรีเมี่ยม เพอร์เฟค จำกัด",
	}
	db.Model(&Company{}).Create(&Company4)

	//
	// จำลองตาราง EquipmentPurchasing ---ฟ้า---
	EquipmentPurchasing1 := EquipmentPurchasing{
		EquipmentName:     "ปากกาไวท์บอ์ด PILOT สีน้ำเงิน",
		Amount:            50,
		Date:              time.Now(),
		EquipmentCategory: equipmentCategory1,
		Company:           Company4,
		Librarian:         sirivipa,
	}
	db.Model(&EquipmentPurchasing{}).Create(&EquipmentPurchasing1)
	EquipmentPurchasing2 := EquipmentPurchasing{
		EquipmentName:     "ปากกาลูกลื่น",
		Amount:            75,
		Date:              time.Now(),
		EquipmentCategory: equipmentCategory3,
		Company:           Company2,
		Librarian:         thanphirom,
	}
	db.Model(&EquipmentPurchasing{}).Create(&EquipmentPurchasing2)

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

	//--- maprang ---
	//payment
	pay1 := Payment{
		Name: "เงินสด",
	}
	db.Model(&Payment{}).Create(&pay1)
	pay2 := Payment{
		Name: "โอนชำระผ่านธนาคาร",
	}
	db.Model(&Payment{}).Create(&pay2)
	pay3 := Payment{
		Name: "สแกนคิวอาร์โค้ด",
	}
	db.Model(&Payment{}).Create(&pay3)
	pay4 := Payment{
		Name: "ระยะการยืมเวลาไม่เกินกำหนด ไม่ต้องชำระเงิน",
	}
	db.Model(&Payment{}).Create(&pay4)

	//preorder
	preorder1 := Preorder{
		Owner:      mumana,
		Name:       "Java",
		Price:      150,
		Author:     "ม.ม่วง",
		Edition:    1,
		Year:       "2560",
		Quantity:   1,
		Totalprice: 150,
		Payment:    pay1,
		Datetime:   time.Now(),
		Librarian:  chanaporn,
	}
	db.Model(&Preorder{}).Create(&preorder1)

	preorder2 := Preorder{
		Owner:      montree,
		Name:       "Chinese",
		Price:      120,
		Author:     "Xiao Lu",
		Edition:    5,
		Year:       "c2010",
		Quantity:   2,
		Totalprice: 240,
		Payment:    pay1,
		Datetime:   time.Now(),
		Librarian:  chanaporn,
	}
	db.Model(&Preorder{}).Create(&preorder2)

	// --- จำลอง Confirmaition ---
	// --- วิธีการรับสินค้า ---
	receiver1 := Receiver{
		Type: "รับโดยสมาชิก",
	}
	db.Model(&Receiver{}).Create(&receiver1)
	receiver2 := Receiver{
		Type: "รับโดยตัวแทน",
	}
	db.Model(&Receiver{}).Create(&receiver2)

	// --- ตารางหลัก Confirmation

	confirmation1 := Confirmation{
		User:      mumana,
		Preorder:  preorder1,
		Receiver:  receiver1,
		Note:      "-",
		Datetime:  time.Now(),
		Librarian: chanaporn,
	}
	db.Model(&Confirmation{}).Create(&confirmation1)

	confirmation2 := Confirmation{
		User:      montree,
		Preorder:  preorder2,
		Receiver:  receiver2,
		Note:      "1778899445561, สมชาย ใจดี, 0879456321",
		Datetime:  time.Now(),
		Librarian: chanaporn,
	}
	db.Model(&Confirmation{}).Create(&confirmation2)

	//-----จำลองตาราง Forfeit ---จูเนียร์--
	forfeit1 := Forfeit{
		ReturnBook: returnBook1,
		Pay:        25,
		Payment:    pay1,
		Pay_Date:   time.Now(),
		Note:       "ไม่มี",
		Librarian:  chanaporn,
	}
	db.Model(&Forfeit{}).Create(&forfeit1)

	forfeit2 := Forfeit{
		ReturnBook: returnBook2,
		Pay:        10,
		Payment:    pay3,
		Pay_Date:   time.Now(),
		Note:       "ไม่มี",
		Librarian:  chanaporn,
	}
	db.Model(&Forfeit{}).Create(&forfeit2)

	//-----จำลอง Type
	type1 := Type{
		Name: "หนังสือ",
	}
	db.Model(&Type{}).Create(&type1)
	type2 := Type{
		Name: "E-Book",
	}
	db.Model(&Type{}).Create(&type2)
	type3 := Type{
		Name: "Audiobook",
	}
	db.Model(&Type{}).Create(&type3)
	type4 := Type{
		Name: "อื่นๆ",
	}
	db.Model(&Type{}).Create(&type4)

	//-----จำลอง Objective
	objective1 := Objective{
		Name: "การเรียนการสอน",
	}
	db.Model(&Objective{}).Create(&objective1)
	objective2 := Objective{
		Name: "คู่มือสำหรับการปฏิบัติงาน",
	}
	db.Model(&Objective{}).Create(&objective2)
	objective3 := Objective{
		Name: "ทั่วไป",
	}
	db.Model(&Objective{}).Create(&objective3)

	//-----จำลองตาราง Introduce ---จูเนียร์--
	introduce1 := Introduce{
		Title:     "แคลคูลัส 1 สำหรับวิศวกร",
		Author:    "รศ. ดร.ธีระศักดิ์ อุรัจนานนท์",
		ISBN:      9786162139130,
		Edition:   1,
		Pub_Name:  "สกายบุ๊กส์ บ.จ.ก.",
		Pub_Year:  "2012",
		Type:      type1,
		Objective: objective1,
		I_Date:    time.Now(),
		User:      montree,
	}
	db.Model(&Introduce{}).Create(&introduce1)

	introduce2 := Introduce{
		Title:     "คัมภีร์ Python",
		Author:    "อรพิน ประวัติบริสุทธิ์",
		ISBN:      9786162047930,
		Edition:   1,
		Pub_Name:  "Provision",
		Pub_Year:  "2021",
		Type:      type1,
		Objective: objective1,
		I_Date:    time.Now(),
		User:      montree,
	}
	db.Model(&Introduce{}).Create(&introduce2)

	introduce3 := Introduce{
		Title:     "เพียงชั่วเวลากาแฟยังอุ่น ตราบชั่วเวลาของคำโกหก",
		Author:    "คาวางุจิ โทชิคาซึ",
		ISBN:      9786161848330,
		Edition:   1,
		Pub_Name:  "แพรว ส.น.พ.",
		Pub_Year:  "2022",
		Type:      type1,
		Objective: objective3,
		I_Date:    time.Now(),
		User:      montree,
	}
	db.Model(&Introduce{}).Create(&introduce3)

	//Level khanoon
	level1 := Level{
		Name: "น้อย",
	}
	db.Model(&Level{}).Create(&level1)
	level2 := Level{
		Name: "ปานกลาง",
	}
	db.Model(&Level{}).Create(&level2)
	level3 := Level{
		Name: "มาก",
	}
	db.Model(&Level{}).Create(&level3)

	//จำลองตาราง BookRepair khanoon
	db.Model(&BookRepair{}).Create(&BookRepair{
		BookName:  "มือใหม่ Python เก่งได้ใน 30 วัน",
		Level:     level1,
		Date:      time.Now(),
		Librarian: sirivipa,
	})
	db.Model(&BookRepair{}).Create(&BookRepair{
		BookName:  "เธอมีค่าในแบบที่ เป็น",
		Level:     level2,
		Date:      time.Now(),
		Librarian: thanphirom,
	})
	db.Model(&BookRepair{}).Create(&BookRepair{
		BookName:  "ประวัติกฎหมาย ไทย",
		Level:     level3,
		Date:      time.Now(),
		Librarian: chanaporn,
	})

	//จำลองตาราง EquipmentRepair khanoon
	db.Model(&EquipmentRepair{}).Create(&EquipmentRepair{

		EquipmentName: "ปากกาไวท์บอร์ด PILOT สีน้ำเงิน",
		Level:         level1,
		Date:          time.Now(),
		Librarian:     sirivipa,
	})
	db.Model(&EquipmentRepair{}).Create(&EquipmentRepair{
		EquipmentName: "ปากกาลูกลื่นสีแดง",
		Level:         level2,
		Date:          time.Now(),
		Librarian:     thanphirom,
	})
	db.Model(&EquipmentRepair{}).Create(&EquipmentRepair{
		EquipmentName: "Headphone",
		Level:         level3,
		Date:          time.Now(),
		Librarian:     chanaporn,
	})

	//B6223090 นิด
	//------ Equipment Status Data
	equipment_status1 := EquipmentStatus{
		Name: "ชำรุด",
	}
	db.Model(&EquipmentStatus{}).Create(&equipment_status1)

	equipment_status2 := EquipmentStatus{
		Name: "ไม่ชำรุด",
	}
	db.Model(&EquipmentStatus{}).Create(&equipment_status2)

	//-----จำลองตาราง Borrow Equipment
	borrowEquipment1 := BorrowEquipment{
		BorrowEquipment_Day:    time.Now(),
		Amount_BorrowEquipment: 1,
		Librarian:              chanaporn,
		User:                   montree,
		EquipmentPurchasing:    EquipmentPurchasing1,
	}
	db.Model(&BorrowEquipment{}).Create(&borrowEquipment1)

	borrowEquipment2 := BorrowEquipment{
		BorrowEquipment_Day:    time.Now(),
		Amount_BorrowEquipment: 1,
		Librarian:              chanaporn,
		User:                   montree,
		EquipmentPurchasing:    EquipmentPurchasing2,
	}
	db.Model(&BorrowEquipment{}).Create(&borrowEquipment2)

	//-----จำลองตาราง Return Equipment
	returnEquipment1 := ReturnEquipment{
		Return_Day:      time.Now(),
		EquipmentStatus: equipment_status2,
		Return_Detail:   "ปกติ",
		Librarian:       chanaporn,
		BorrowEquipment: borrowEquipment1,
	}
	db.Model(&ReturnEquipment{}).Create(&returnEquipment1)

	returnEquipment2 := ReturnEquipment{
		Return_Day:      time.Now(),
		EquipmentStatus: equipment_status1,
		Return_Detail:   "ปากกาเขียนไม่ติด",
		Librarian:       chanaporn,
		BorrowEquipment: borrowEquipment2,
	}
	db.Model(&ReturnEquipment{}).Create(&returnEquipment2)
}

package entity

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("sa65-team04.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	database.AutoMigrate(
		&BookPurchasing{},
		&Librarian{},
		&BookCategory{},
		&Publisher{},
	)
	db = database

	// BookPurchasing System
	bookPurchasingData(db)

}

import { EquipmentPurchasingInterface } from "./IEquipmentPurchasing"
import { LibrarianInterface } from "./ILibrarian"
import { UserInterface } from "./IUser"

export interface BorrowEquipmentInterface{
    ID:                number,
    BorrowEquipment_Day:       Date,
	Amount_BorrowEquipment:        number,

	LibrarianID:       number,
	Librarian:         LibrarianInterface,

	UserID:            number,
	User:              UserInterface, 

	EquipmentPurchasingID:  number,
	EquipmentPurchasing:    EquipmentPurchasingInterface,
}


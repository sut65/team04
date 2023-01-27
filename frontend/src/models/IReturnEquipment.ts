import { LibrarianInterface } from "./ILibrarian"
import { EquipmentStatusInterface } from "./IEquipmentStatus"
import { BorrowEquipmentInterface } from "./IBorrowEquipment"


export interface ReturnEquipmentInterface {
    ID:              number,
    Return_Day:     Date,
	Return_Detail:  string,

	EquipmentStatusID:      number,
	EquipmentStatus:        EquipmentStatusInterface,

	LibrarianID:     number,
	Librarian:       LibrarianInterface,

	BorrowEquipmentID:    number,
	BorrowEquipment:      BorrowEquipmentInterface,

}
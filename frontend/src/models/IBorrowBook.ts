import { BookPurchasingInterface } from "./IBookPurchasing"
import { LibrarianInterface } from "./ILibrarian"
import { UserInterface } from "./IUser"

export interface BorrowBookInterface {
    ID:                number,
    Borb_Day:          Date,
	Return_Day:        Date,
	Color_Bar:         string,
	Borb_Frequency:    number,

	LibrarianID:       number,
	Librarian:         LibrarianInterface,

	UserID:            number,
	User:              UserInterface, 

	BookPurchasingID:  number,
	BookPurchasing:    BookPurchasingInterface,

}
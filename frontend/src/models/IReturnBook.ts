import { BorrowBookInterface } from "./IBorrowBook"
import { LibrarianInterface } from "./ILibrarian"
import { LostBookInterface } from "./ILostBook"


export interface ReturnBookInterface {
    ID:              number,
    Current_Day:     Date,
	Late_Number:     number,
	Book_Condition:  string,

	LostBookID:      number,
	LostBook:        LostBookInterface,

	LibrarianID:     number,
	Librarian:       LibrarianInterface,

	BorrowBookID:    number,
	BorrowBook:      BorrowBookInterface,

}
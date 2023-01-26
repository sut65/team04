import { ReturnBookInterface } from "./IReturnBook"
import { PaymentInterface } from "./IPayment"
import { LibrarianInterface } from "./ILibrarian"


export interface ForfeitInterface{
    Pay: number
	Pay_Date: Date
	Note:     string

	ReturnBookID: number
	ReturnBook:   ReturnBookInterface

	PaymentID: number
	Payment:   PaymentInterface

	LibrarianID: number
	Librarian:   LibrarianInterface
}
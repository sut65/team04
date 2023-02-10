import { ReturnBookInterface } from "./IReturnBook"
import { PaymentInterface } from "./IPayment"
import { LibrarianInterface } from "./ILibrarian"


export interface ForfeitInterface{
	ID?: number
    Pay?: number
	Pay_Date?: Date
	Note?:     string
	ModulateNote?:     string

	ReturnBookID?: number
	ReturnBook:   ReturnBookInterface

	PaymentID?: number
	Payment:   PaymentInterface

	LibrarianID?: number
	Librarian:   LibrarianInterface
}
import { PaymentInterface } from "./IPayment"
import { LibrarianInterface } from "./ILibrarian"
import { UserInterface } from "./IUser"

export interface PreorderInterface {
    ID: number

    UserID: number
    User: UserInterface

    Name: string
    Price: number
    Author: string
    Edition: number
    Year: string
    Quantity: number
    Totalprice: number

    PaymentID: number
    Payment: PaymentInterface

    Datetime: Date

    LibrarianID: number
    Librarian: LibrarianInterface
}


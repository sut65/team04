import { LibrarianInterface } from "./ILibrarian"
import { PreorderInterface } from "./IPreorder"
import { ReceiverInterface } from "./IReceiver"

export interface ConfirmationInterface{
    Id: number

    PreorderID: number
    Preorder: PreorderInterface

    ReceiverID: number
    Receiver: ReceiverInterface

    NoteName: string
    NoteTel: string
    Datetime: Date

    LibrarianID: number
    Librarian: LibrarianInterface
}
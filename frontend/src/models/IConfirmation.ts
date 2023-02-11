import { LibrarianInterface } from "./ILibrarian"
import { PreorderInterface } from "./IPreorder"
import { ReceiverInterface } from "./IReceiver"

export interface ConfirmationInterface{
    ID: number

    PreorderID: number
    Preorder: PreorderInterface

    ReceiverID: number
    Receiver: ReceiverInterface

    NoteName: string
    NoteTel: string
    Date: Date

    LibrarianID: number
    Librarian: LibrarianInterface
}
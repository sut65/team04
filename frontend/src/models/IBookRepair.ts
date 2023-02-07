import { BookPurchasingInterface } from "./IBookPurchasing"
import { LibrarianInterface } from "./ILibrarian"
import { LevelInterface } from "./ILevel"

export interface BookRepairInterface {

    ID: number
	
    BookPurchasingID:   Number
    BookPurchasing:     BookPurchasingInterface

    LevelID:    Number
    Level:      LevelInterface

    Date:    Date

    Note:   string

    LibrarianID: number
	Librarian:   LibrarianInterface 
   
}
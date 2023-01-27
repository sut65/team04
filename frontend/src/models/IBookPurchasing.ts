import { BookCategoryInterface } from "./IBookCategory"
import { LibrarianInterface } from "./ILibrarian"
import { PublisherInterface } from "./IPublisher"

export interface BookPurchasingInterface {

    ID: number
	Date:    Date
    BookName: String
    AuthorName: string
	Amount: number

    LibrarianID: number
	Librarian:   LibrarianInterface 

    BookCategoryID: number
	BookCategory:   BookCategoryInterface

    PublisherID: number
	Publisher:   PublisherInterface 
   
   }
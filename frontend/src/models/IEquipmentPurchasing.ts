import { CompanyInterface } from "./ICompany"
import { EquipmentCategoryInterface } from "./IEquipmentCategory"
import { LibrarianInterface } from "./ILibrarian"


export interface BookPurchasingInterface {

    Id: number
	Date:    Date
    EquipmentName: String
	Amount: number

    LibrarianID: number
	Librarian:   LibrarianInterface 

    EquipmentCategoryID: number
	EquipmentCategory:   EquipmentCategoryInterface 

    CompanyID: number
	Company:   CompanyInterface
   
   }
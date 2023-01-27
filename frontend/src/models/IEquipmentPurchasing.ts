import { CompanyInterface } from "./ICompany"
import { EquipmentCategoryInterface } from "./IEquipmentCategory"
import { LibrarianInterface } from "./ILibrarian"


export interface EquipmentPurchasingInterface {

    ID: number
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
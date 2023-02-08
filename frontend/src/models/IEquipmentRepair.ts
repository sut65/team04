import { EquipmentPurchasingInterface } from "./IEquipmentPurchasing"
import { LibrarianInterface } from "./ILibrarian"
import { LevelInterface } from "./ILevel"

export interface EquipmentRepairInterface {

    ID: number
	
    EquipmentPurchasingID:   Number
    EquipmentPurchasing:     EquipmentPurchasingInterface

    LevelID:    Number
    Level:      LevelInterface

    Date:    Date

    Note:   string

    LibrarianID: number
	Librarian:   LibrarianInterface 
   
}
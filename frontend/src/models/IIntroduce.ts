import { BookTypeInterface } from "./IBookType"
import { ObjectiveInterface } from "./IObjective"
import { UserInterface } from "./IUser"

export interface IntroduceInterface{
    Title:    string
	Author:   string
	ISBN:     number
	Edition:  number
	Pub_Name: string
	Pub_Year: string
	I_Date:   Date

	BookTypeID: number
	BookType:   BookTypeInterface

	ObjectiveID: number
	Objective:   ObjectiveInterface

	UserID: number
	User:   UserInterface 
}
import { ILinks } from "./ILinks";
import { EEventType } from "../enums/EEventType";

export interface INotification {
    eventTypeName: EEventType
    text: string
    received: boolean
    creationTime: string
    _links: ILinks
}

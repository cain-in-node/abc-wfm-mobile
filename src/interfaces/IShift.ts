import { ILinks } from './ILinks';
import { EStatus } from '../enums/EStatus';
import { ETypeShifts } from '../enums/ETypeShifts';
import { IDataTimeInterval } from './IDataTimeInterval';

// Объект с информацией о дне из рабочего графика
export interface IShift {
    dateTimeInterval: IDataTimeInterval,
    employeePositionId?: number,
    positionTypeId: number,
    positionIndex: number,
    positionCategoryRosterId: number,
    hasLunch: boolean,
    lunch: number,
    edited: boolean,
    availableForAssignment: boolean,
    type: ETypeShifts,
    status: EStatus | null,
    _links?: ILinks,
    id: number
}

// Массив с объектами рабочего графика
export interface IListShifts {
    [key: number]: IShift;
}
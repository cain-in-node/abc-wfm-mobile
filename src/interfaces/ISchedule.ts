import { ILinks } from './ILinks';
import { EStatus } from '../enums/EStatus';
import { ETypesOfEvents } from '../enums/ETypesOfEvents';
import { IDataTimeInterval } from './IDataTimeInterval';

// Объект с информацией о событии из графика событий
export interface ISchedule {
    type: ETypesOfEvents,
    dateTimeInterval: IDataTimeInterval,
    daylong: boolean,
    status: EStatus | null,
    employeeId: number,
    positionId: number,
    _links: ILinks,
}

// Массив с объектами графика событий
export interface IListSchedules {
    [key: number]: ISchedule;
}
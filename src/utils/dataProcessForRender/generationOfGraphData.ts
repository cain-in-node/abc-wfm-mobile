import { IShift, IListShifts } from '../../interfaces/IShift';
import { ISchedule, IListSchedules } from '../../interfaces/ISchedule';
import { IDataTimeInterval } from '../../interfaces/IDataTimeInterval';
import { EStatus } from '../../enums/EStatus';
import { DataDay } from '../../interfaces/IDays';
import moment from 'moment';
import { EFetchingStatus } from '../../enums/EFetchingStatus';
import { createMonth } from './createMonth';
import { UserApi } from '../../backend/User';
import { getNumberFirstDay } from '../getNumberFirstDay';
import { ETypesOfEvents } from '../../enums/ETypesOfEvents';

// Функция приводящая данные к виду необходимому для рендера
export function generationOfGraphData(startDate: string, endDate: string): void {
    const schedules: IListSchedules = filterSchedule(UserApi.schedules);
    const shifts: IListShifts = filterShifts(UserApi.shifts, startDate);
    const shiftsExchange: IListShifts = filterShiftsExchange(UserApi.shifts);
    const totalArray: Array<DataDay> = createMonth(startDate, endDate);
    const numberFirstDayInMonth = getNumberFirstDay(startDate);
    totalArray.forEach((item, id) => {
        if(item.active) {
            const number = id + 2 - numberFirstDayInMonth;
            shifts[number] !== undefined ? item.shift = shifts[number] : null;
            schedules[number] !== undefined ? item.schedule = schedules[number] : null;
            shiftsExchange[number] !== undefined ? item.shiftExchange = shiftsExchange[number]: null
        }
    });
    UserApi.totalArrayByRender = totalArray;
    UserApi.setFetchingUserStatus(EFetchingStatus.done);
    return;
}

// Получение номера дня
const getNumberDayInMonth = (date: string | Date) => {
    return +(moment(date).format('D'));
}

// Получение диапозона дней
const getRange = (timeData: IDataTimeInterval) => {
    const firstDay = getNumberDayInMonth(timeData.startDateTime);
    const lastDay  = getNumberDayInMonth(timeData.endDateTime);
    const result = [];
    for (var i = firstDay; i <= lastDay; i++) {
        result.push(i);
    }
    return result;
}

// Обработка графика смен для рендера
const filterShifts = (shifts: Array<IShift>, startDate: string) => {
    const filterShifts: IListShifts = {};
    const lastMonth = moment().format('M') <= moment(startDate).format('M');
    const hasDayPassed = (i: number) => lastMonth ? i < +(moment().format('D')) : false;
    shifts.map(item => {
        const numberDay = getNumberDayInMonth(item.dateTimeInterval.startDateTime);
        if(hasDayPassed(numberDay) && item.employeePositionId !== null) {
            filterShifts[numberDay] = item;
        } else if (!hasDayPassed(numberDay) && item.employeePositionId !== null) {
            filterShifts[numberDay] = item;
        }
    });
    return filterShifts;
}

// Обработка графика смен c биржи для рендера
const filterShiftsExchange = (shifts: Array<IShift>) => {
    const filterShiftsExchange: IListShifts = {};
    shifts.map(item => {
        const numberDay = getNumberDayInMonth(item.dateTimeInterval.startDateTime);
        if(item.employeePositionId === null) {
            filterShiftsExchange[numberDay] = item;
        }
    });

    return filterShiftsExchange;
}

// Обработка графика отсутствия для рендеда
const filterSchedule = (schedules: Array<ISchedule>) => {
    const filterSchedules: IListSchedules = {};
    schedules.map(item => {
        if(item.status === EStatus.APPROVED || item.status === EStatus.NOT_APPROVED) {
            if(item.type === ETypesOfEvents.DAY_OFF) return;
            const rangeNumbers = getRange(item.dateTimeInterval);
            if(rangeNumbers.length === 1) {
                filterSchedules[getNumberDayInMonth(item.dateTimeInterval.startDateTime)] = item;
            } else {
                rangeNumbers.map(number => {
                    filterSchedules[number] = item;
                })
            }
        }
    });
    return filterSchedules;
}
import moment from 'moment';
import { DataDay } from '../../interfaces/IDays';
import { getNumberFirstDay } from '../getNumberFirstDay';

// Фукнция по созданию массива с объектами для рендера месяца

export function createMonth(startDate: string, endDate: string): Array<DataDay> {
    const countDaysInSchedule: number = 42;
    const countDaysInMonth: number = moment(startDate).daysInMonth();
    const numberFirstDayInMonth: number = getNumberFirstDay(startDate);
    const daysInPastMonth: number = moment(startDate).subtract(1,'months').endOf('month').daysInMonth();

    // Проверка текущего месяца
    const checkMonth = () => {
        return +(moment().format('M')) === +(moment(startDate).format('M'));
    };

    // Проверка прошедешего месяца
    const lastMonth = () => {
        if(+(moment(startDate).format('M')) === 1) return false;
        return +(moment().format('M')) > +(moment(startDate).format('M'));
    };

    // Проверка на сегодняшний день
    const checkToday = (i: number) => checkMonth() ? i === +(moment().format('D')) : false;

    // Проверка на прошедший день
    const hasDayPassed = (i: number) => {
        if(checkMonth()) return i < +(moment().format('D'));
        return lastMonth();
    }

    const totalArray: Array<DataDay> = [];

    // Создание дней предъидущего месяца
    for(let i = 1; i < numberFirstDayInMonth; i++) {
        totalArray.push(new DataDay(daysInPastMonth - numberFirstDayInMonth + i + 1, false));
    }

    // Создание дней текущего месяца
    for(let i = 1; i <= countDaysInMonth; i++) {
        const today = checkToday(i);
        const dayPassed = hasDayPassed(i);
        const date = moment(startDate).format('YYYY-MM-DDTh:mm:ss');
        totalArray.push(new DataDay(i, true, today, dayPassed, date));
    }

    // Создание дней следующего месяца
    for(let i = totalArray.length, n = 1; i < countDaysInSchedule; i++, n++) {
        totalArray.push(new DataDay(n, false));
    }

    return totalArray;
}
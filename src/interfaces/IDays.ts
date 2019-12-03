import { IShift } from './IShift';
import { ISchedule } from './ISchedule';

export interface IDay {
    shift: IShift | any,
    schedule: ISchedule | any,
    shiftExchange: IShift | any,
    number: number,
    active: boolean,
    today: boolean,
    hasDayPassed: boolean,
    date: string,
}

export interface IWeek {
    listWorkDays: Array<IDay>
}

export interface IMonth {
    listWeeks: Array<IWeek>
}

export class DataDay implements IDay {
    constructor(num: number = new Date().getDate(),
                act: boolean = true,
                today: boolean = false,
                hasDayPassed: boolean = false,
                date: string = '') {
        this.number = num;
        this.active = act;
        this.today  = today;
        this.hasDayPassed = hasDayPassed;
        this.date = date;
    }
    public shift = {}
    public schedule = {}
    public shiftExchange = {}
    public number = 0
    public active = true
    public today = false
    public hasDayPassed = false
    public date = ''
}
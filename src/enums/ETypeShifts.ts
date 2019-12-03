// Типы рабочих смен

export enum ETypeShifts {
    FULL_DAY = 'FULL_DAY', // Весь день
    MIDDLE = 'MIDDLE', // Середина рабочего дня
    OPEN = 'OPEN', // Начало смена к открытию магизина
    CLOSE = 'CLOSE', // Конец смены к закрытию магазина
    OUTSIDE_OPEN = 'OUTSIDE_OPEN', // Начало смены до открытия магазина
    OUTSIDE_CLOSE = 'OUTSIDE_CLOSE' // Конец смены после закрытия магазина
}
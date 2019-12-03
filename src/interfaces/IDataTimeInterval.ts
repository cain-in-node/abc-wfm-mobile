// Данные о времени события

export interface IDataTimeInterval {
    startDateTime: Date | string, // Дата и время начала события
    endDateTime: Date | string, // Дата и время окончания события
    lengthInMinutes?: number, // Количество минут в собитии
    lengthInHours?: number, // Количество часов в событии
}
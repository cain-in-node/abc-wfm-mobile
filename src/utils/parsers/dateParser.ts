// Парсер даты полного формата, возвращает дату без указания времени
export const parseDate = (date: string): string => date.substring(0, date.indexOf('T'));

// Парсер даты полного формата, для извлечения времени
export const parseDateTime = (date: string): string => date.substring(date.indexOf('T') + 1, date.length - 3);

// Подмена даты
export const parseDateChangeDay = (date: string, day: number): string => `${date.substr(0, 8)}${day < 10 ? `0${day}` : day}${date.substr(10)}`;
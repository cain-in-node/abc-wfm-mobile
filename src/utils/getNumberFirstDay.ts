import moment from 'moment';

// Функция для получения порядкового номера, первого дня месяца
// На вход приинмаюет любую дату, возвращает номер первого дня
// Moment js воскресенье определяет как 0, поэтому для него реализована заглушка

export function getNumberFirstDay(startDate: string) {
    const numberDay = moment(startDate).startOf('month').day();
    if(numberDay === 0) return 7;
    return numberDay;
}
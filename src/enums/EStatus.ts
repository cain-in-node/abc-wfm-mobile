// Статусы для смен, событий, аналитики

export enum EStatus {
    APPROVED = 'APPROVED', // подтверждена
    NOT_APPROVED = 'NOT_APPROVED', // не подтверждена
    CANCELED = 'CANCELED', // отменена
    NOT_EXIST = 'NOT_EXIST', // не существует
    DAY_OFF = 'DAY_OFF', // отгул
    SICK_LEAVE = 'SICK_LEAVE', // больничный
    OFF_TIME = 'OFF_TIME', // выходной
    VACATION = 'VACATION', // отпуск
    TRAINING = 'TRAINING', // обучение
    BIO_NORMAL = 'BIO_NORMAL', // смена (из биометрии)
    BIO_LATE_FOR_SHIFT = 'BIO_LATE_FOR_SHIFT', // опоздание на смену (из биометрии)
    BIO_EARLY_DEPARTURE = 'BIO_EARLY_DEPARTURE', // ранний уход со смены (из биометрии)
    BIO_WITH_VIOLATION = 'BIO_WITH_VIOLATION', // смена с нарушением (из биометрии)
    BIO_FAILURE_TO_APPEAR = 'BIO_FAILURE_TO_APPEAR', // неявка (из биометрии)
}

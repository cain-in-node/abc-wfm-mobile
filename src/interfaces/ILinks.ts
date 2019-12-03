// Объект с набором ссылок возвращаемый при запросах к бэку

export interface ILinks {
    [x: string]: {
        [x: string]: string
    };
}
// Заголовок хедеров экранов приложения

export interface IHeader {
    title: string,
    custom: boolean
    handler: () => void
}
// Парсер ссылок из ответа сервера, для передачи квери параметров
export const parseLinks = (link: string): string =>
    link.substring(0, link.indexOf('?')) === '' ? link : link.substring(0, link.indexOf('?'));

// Парсер ссылок с темплэйтом из ответа сервера, для передачи квери параметров
export const parseLinksTemplate = (link: string): string =>
    link.substring(0, link.indexOf('{?')) === '' ? link : link.substring(0, link.indexOf('{?'));
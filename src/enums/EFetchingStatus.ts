// Название статусов для fecth запросов

export enum EFetchingStatus {
    none = 'none',
    error = 'error',
    done = 'done',
    inProg = 'inProg',
    inProgLevel1 = 'inProgLevel1',
    inProgLevel2 = 'inProgLevel2',
    inProgLevel3 = 'inProgLevel3',
    inProgLevel4 = 'inProgLevel4'
}

// Название типа fetch запросов

export enum ENamesFetching {
    profile = 'profile',
    user    = 'user'
}
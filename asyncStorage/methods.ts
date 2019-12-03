import storage from './storage';

interface ILoad {
    key: string,
    autoSync?: boolean,
    syncInBackground?: boolean
}

interface IDelete {
    key: string
}

export function SaveStore(key: string, data: any, expires: any = null): void {
    storage.save({key,data,expires});
}

export function LoadStore({key, autoSync = false, syncInBackground = false}: ILoad): Promise<any> {
    return storage.load({key,autoSync,syncInBackground});
}

export function DeleteStore({key}: IDelete) {
    return storage.remove({key});
}

import axios from 'axios';
import { observable } from 'mobx';

// Enums
import { ENKS } from '../enums/EStorage';
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Local storage
import { SaveStore, LoadStore, DeleteStore } from '../../asyncStorage/methods';

// Services
import { FireBase } from '../services/Notification';

// Utils
import Base64 from '../utils/base64';

const base64 = new Base64;

export class AuthApi {
    @observable static auth: boolean;
    @observable static error = null;
    @observable static adress: string;
    @observable static fetchingStatus: EFetchingStatus = EFetchingStatus.inProg;

    static setFetchingStatus(newStatus: EFetchingStatus) {
        AuthApi.fetchingStatus = newStatus;
    }

    static async authorization(adress: string, login: string, password: string) {
        const authRequest = axios.create({baseURL: `${adress}/api/v1`,withCredentials: true});
        const encodeLP = base64.encode(`${login}:${password}`);
        const headers = {'Authorization': `Basic ${encodeLP}`,
                         'Accept': 'application/hal+json',
                         'Content-Type': 'application/hal+json'}

        return authRequest.get('', { headers }).then(response => {
            this.auth  = true;
            SaveStore(ENKS.userAuth,{auth: true});
            SaveStore(ENKS.userAuthData, {login, password});
            SaveStore(ENKS.userLinks, {links: response.data._links});
            this.setFetchingStatus(EFetchingStatus.done);
            FireBase.checkPermission(headers);
          }).catch(err => {
            this.error = err.response;
            this.setFetchingStatus(EFetchingStatus.error);
          });
    }

    static async login(login: string, password: string): Promise<void> {
        this.setFetchingStatus(EFetchingStatus.inProg);
        LoadStore({key: ENKS.adressServer}).then(response => {
            this.authorization(response.adress, login, password);
            AuthApi.adress = response.adress;
        }).catch((err) => {
            AuthApi.adress = '';
            this.error = err;
            this.setFetchingStatus(EFetchingStatus.error);
        });
    }

    static async logOut(): Promise<void> {
        DeleteStore({key: ENKS.userAuth});
        DeleteStore({key: ENKS.userAuthData});
        DeleteStore({key: ENKS.fcmToken});
        AuthApi.auth = false;
    }

    static async autoLogin(): Promise<void> {
        LoadStore({key: ENKS.userAuthData}).then(response => {
            this.setFetchingStatus(EFetchingStatus.inProg);
            this.authorization(AuthApi.adress, response.login, response.password);
        }).catch(() => {
            this.setFetchingStatus(EFetchingStatus.none);
        });
    }

    static async getAdress(): Promise<void> {
        LoadStore({key: ENKS.adressServer}).then(response => {
            AuthApi.adress = response.adress.trim();
        }).catch(() => {
            AuthApi.adress = '';
        });
    }

    static setError(obj: any) {
        this.error = obj;
    }
}
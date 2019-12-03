import axios from 'axios';
import { observable } from 'mobx';

// Enums
import { ENKS } from '../enums/EStorage';
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Interfaces
import { ILinks } from '../interfaces/ILinks';

// Utils
import { parseLinks } from '../utils/parsers/linkParser';

// Local storage
import { LoadStore } from '../../asyncStorage/methods';

export class ExchangeApi {
    @observable static error = {};
    @observable static userLinks: ILinks = {};
    @observable static shiftsInExchange = {};

    @observable static fetchingStatusExchange: EFetchingStatus = EFetchingStatus.none;

    static setFetchingStatus(newStatus: EFetchingStatus) {
        ExchangeApi.fetchingStatusExchange = newStatus;
    }

    static async getUserLinks() {
        LoadStore({key: ENKS.userLinks}).then(response => {
            ExchangeApi.userLinks = response.links;
        });
    }

    static async getShiftExchange(startDate: string, endDate: string) {
        this.setFetchingStatus(EFetchingStatus.inProg);
        this.getUserLinks().then(() => {
            return axios.create({baseURL: `${parseLinks(ExchangeApi.userLinks.getGeneralExchangeView.href)}/?from=${startDate}&to=${endDate}`}).get('').then(response => {
                ExchangeApi.shiftsInExchange = response.data;
                this.setFetchingStatus(EFetchingStatus.done);
            }).catch(err => {
                this.error = err;
                this.setFetchingStatus(EFetchingStatus.error);
            });
        });
    }
}

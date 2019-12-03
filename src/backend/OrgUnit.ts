import axios from 'axios';
import { observable } from 'mobx';

// Enums
import { ENKS } from '../enums/EStorage';
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Interfaces
import { ILinks } from '../interfaces/ILinks';

// Local storage
import { LoadStore } from '../../asyncStorage/methods';


export class OrgUnitApi {
    @observable static error = {};
    @observable static userLinks: ILinks = {};
    @observable static orgUnitInfo = {};
    @observable static fetchingStatusExchange: EFetchingStatus = EFetchingStatus.none;

    static setFetchingStatus(newStatus: EFetchingStatus) {
        OrgUnitApi.fetchingStatusExchange = newStatus;
    }

    static async getUserLinks() {
        LoadStore({key: ENKS.userLinks}).then(response => {
            OrgUnitApi.userLinks = response.links;
        });
    }

    static async getOrgUnit() {
        this.setFetchingStatus(EFetchingStatus.inProg);
        this.getUserLinks().then(() => {
            return axios.create({baseURL: OrgUnitApi.userLinks.orgUnits.href}).get('').then(response => {
                this.orgUnitInfo = response.data._embedded.orgUnits;
            }).catch(err => {
                this.error = err;
            });
        });
    }
}

import axios from 'axios';
import { observable } from 'mobx';

// Classes
import { CreateSchedule } from '../class/CreateSchedule';

// Enums
import { ENKS } from '../enums/EStorage';
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Interfaces
import { IUserProfile } from '../interfaces/IUser';
import { IShift } from '../interfaces/IShift';
import { ILinks } from '../interfaces/ILinks';
import { ISchedule } from '../interfaces/ISchedule';
import { DataDay } from '../interfaces/IDays';

// Utils
import { generationOfGraphData } from '../utils/dataProcessForRender/generationOfGraphData';
import { parseLinksTemplate } from '../utils/parsers/linkParser';


// Local storage
import { LoadStore } from '../../asyncStorage/methods';

const headersByCreate = {
    'Accept': 'application/hal+json',
    'Content-Type': 'application/hal+json',
  }

export class UserApi {
    @observable static userProfile: IUserProfile;
    @observable static error = {};
    @observable static shifts: Array<IShift> = [];
    @observable static schedules: Array<ISchedule> = [];
    @observable static totalArrayByRender: Array<DataDay> = [];
    @observable static userLinks: ILinks;
    @observable static position: any;
    @observable static orgUnit: any;
    
    @observable static fetchingStatusUser: EFetchingStatus = EFetchingStatus.none;
    @observable static fetchingSchedule: EFetchingStatus = EFetchingStatus.none;
    @observable static fetchingShift: EFetchingStatus = EFetchingStatus.none;

    static setFetchingUserStatus(newStatus: EFetchingStatus) {
        UserApi.fetchingStatusUser = newStatus;
    }

    static setFetchingSchedule(newStatus: EFetchingStatus) {
        UserApi.fetchingSchedule = newStatus;
    }

    static setFetchingShift(newStatus: EFetchingStatus) {
        UserApi.fetchingShift = newStatus;
    }

    static async getUserLinks() {
        LoadStore({key: ENKS.userLinks}).then(response => {
            UserApi.userLinks = response.links;
        });
    }

    static async getUser(startDate: string, endDate: string) {
        this.setFetchingUserStatus(EFetchingStatus.inProgLevel1);
        this.getUserLinks().then(() => {
            return axios.create({baseURL: UserApi.userLinks.userEmployee.href}).get('').then(response => {
                UserApi.userProfile = response.data;
                this.getUserPosition();
                this.getShifts(startDate, endDate);
            }); 
        });
    }

    static async getUserPosition() {
        return axios.create({baseURL: UserApi.userProfile._links.positions.href}).get('').then(response => {
            UserApi.position = response.data;
            this.getOrgUnit(response.data._embedded.positions[0]._links.orgUnit.href);
        }); 
    }

    static async getOrgUnit(link: string) {
        return axios.create({ baseURL: link }).get('').then(response => {
            UserApi.orgUnit = response.data;
        });
    }

    static async getShifts(startDate: string, endDate: string) {
        this.setFetchingUserStatus(EFetchingStatus.inProgLevel2);
        return axios.create({baseURL: `${parseLinksTemplate(UserApi.userProfile._links.shifts.href)}?from=${startDate}&to=${endDate}`}).get('').then(response => {
            UserApi.shifts = response.data._embedded.shifts;
            this.getSchedules(startDate, endDate);
        }).catch((err) => {
            UserApi.shifts = [];
            this.getSchedules(startDate, endDate);
        });
    }

    static async getSchedules(startDate: string, endDate: string) {
        this.setFetchingUserStatus(EFetchingStatus.inProgLevel3);
        return axios.create({baseURL: `${parseLinksTemplate(UserApi.userProfile._links.scheduleRequests.href)}?from=${startDate}&to=${endDate}`}).get('').then(response => {
            UserApi.schedules = response.data._embedded.scheduleRequests;
            generationOfGraphData(startDate, endDate);
        }).catch((err) => {
            UserApi.schedules = [];
            generationOfGraphData(startDate, endDate);
        });
    }

    static async createSchedule(obj: CreateSchedule) {
        this.setFetchingSchedule(EFetchingStatus.inProg)
        return axios.create({baseURL: `${parseLinksTemplate(this.userLinks.scheduleRequests.href)}?calculateConstraints=true`, headers: headersByCreate}).post('', obj);
    }

    static async editSchedule(link: string, obj: CreateSchedule) {
        this.setFetchingSchedule(EFetchingStatus.inProgLevel1)
        return axios.create({baseURL: link, headers: headersByCreate}).put('', obj);
    }

    static async deleteSchedule(link: string) {
        this.setFetchingSchedule(EFetchingStatus.inProgLevel2)
        return axios.create({ baseURL: link }).delete('');
    }

    static async takeShift(link: string, obj: any) {
        this.setFetchingShift(EFetchingStatus.inProgLevel1);
        return axios.create({baseURL: link, headers: headersByCreate}).post('', obj);
    }

    static async putShift(link: string, obj: any) {
        this.setFetchingShift(EFetchingStatus.inProgLevel2);
        return axios.create({baseURL: link, headers: headersByCreate}).put('', obj);
    }
}
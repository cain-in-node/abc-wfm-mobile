import axios from 'axios';
import { observable } from 'mobx';

// Enums
import { ENKS } from '../enums/EStorage';
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Interfaces
import { ILinks } from '../interfaces/ILinks';
import { INotification } from '../interfaces/INotification';

// Local storage
import { LoadStore } from '../../asyncStorage/methods';

// Utils
import moment from 'moment';

const headersByCreate = {
    'Accept': 'application/hal+json',
    'Content-Type': 'application/hal+json',
  }

export class NotificationApi {
    @observable static error = {};
    @observable static userLinks: ILinks = {};
    @observable static profileInfo: any = {};
    @observable static notification: Array<INotification> = [];

    @observable static fetchingStatusNotification: EFetchingStatus = EFetchingStatus.done;

    static setFetchingStatus(newStatus: EFetchingStatus) {
        NotificationApi.fetchingStatusNotification = newStatus;
    }

    static async getUserLinks() {
        LoadStore({key: ENKS.userLinks}).then(response => {
            NotificationApi.userLinks = response.links;
        });
    }

    static async deleteLocalNotification(id: number) {
        NotificationApi.notification.splice(id - 1, 1);
    }

    static async getProfileInfo() {
        this.setFetchingStatus(EFetchingStatus.inProg);
        this.getUserLinks().then(() => {
            return axios.create({baseURL: `${NotificationApi.userLinks.profileInfo.href}`}).get('').then(response => {
                NotificationApi.profileInfo = response.data;
                this.getNotifications();
            }).catch(err => {
                this.error = err;
                this.setFetchingStatus(EFetchingStatus.error);
            });
        });
    }

    static async getNotifications(deleted: boolean = false, received: boolean = false, allNotification: boolean = true, size: number = 10000) {
        this.setFetchingStatus(EFetchingStatus.inProg);
        NotificationApi.notification = [];
        const attrUrl = () => allNotification ? `?deleted=${deleted}&size=${size}` : `?deleted=${deleted}&received=${received}&size=${size}`;
        
        return axios.create({baseURL: `${NotificationApi.profileInfo._links.notifications.href}${attrUrl()}`}).get('').then(response => {
            response.data._embedded ? NotificationApi.notification = this.sortNotification(response.data._embedded.notifications) : null;
            this.setFetchingStatus(EFetchingStatus.done);
        }).catch(err => {
            NotificationApi.notification = [];
            this.error = err;
            this.setFetchingStatus(EFetchingStatus.error);
        });
    }

    static async notificationReceived(link: string) {
        return axios.create({baseURL: link, headers: headersByCreate}).put('', { received: true }).catch(err => {
            this.error = err;
            this.setFetchingStatus(EFetchingStatus.error);
        });
    }

    static async deleteNotification(link: string) {
        return axios.create({baseURL: link, headers: headersByCreate}).delete('').catch(err => {
            this.error = err;
            this.setFetchingStatus(EFetchingStatus.error);
        });
    }

    static sortNotification(allNotification: Array<INotification>): Array<INotification> {
        const currentDate: string = moment().subtract(1, 'months').format();
        const filteredNotification: Array<INotification> = [];
        allNotification.map(item => moment(item.creationTime).format() > currentDate ? filteredNotification.push(item) : null);
        return filteredNotification;
    }
}

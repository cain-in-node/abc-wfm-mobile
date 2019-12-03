import { observable } from 'mobx';

// Interfaces
import { IDay, DataDay } from '../interfaces/IDays';

// Utils
import getData from '../utils/getData';

export class DetailsDayAPI {
    @observable static dataDay: IDay = new DataDay;
    @observable static checkedDay: boolean = false;
    @observable static orgUnit: string = '';

    static async deleteDay() {
        this.dataDay = new DataDay;
        this.checkedDay = false;
    }

    static async setDay(day: IDay) {
        this.dataDay = day;
        this.checkedDay = true;
    }

    static async getOrgUnit() {
        getData(DetailsDayAPI.dataDay.shift._links.employeePosition.href).then(response => {
			this.orgUnit = response._embedded.position._embedded.orgUnit.name;
		}).catch(err => console.log(err));
    }
}
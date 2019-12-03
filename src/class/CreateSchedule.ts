import { ETypesOfEvents } from '../enums/ETypesOfEvents';
import { EStatus } from '../enums/EStatus';
import { ILinks } from '../interfaces/ILinks';
import { IDataTimeInterval } from '../interfaces/IDataTimeInterval';
import { UserApi } from '../backend/User';

export class CreateSchedule {
	constructor(type: ETypesOfEvents, status: EStatus, daylong: boolean, startDateTime: string, endDateTime: string) {
		this.type = type;
		this.status = status;
		this.daylong = daylong;
		this.dateTimeInterval = {
			startDateTime,
			endDateTime
		};
		this._links = {
			employee: UserApi.userLinks.userEmployee,
			position: UserApi.position._embedded.positions[0]._links.self,
			self: UserApi.userLinks.scheduleRequests
		}
	}
	type: ETypesOfEvents = ETypesOfEvents.SHIFT
	status: EStatus = EStatus.NOT_APPROVED
	daylong: boolean = false
	dateTimeInterval: IDataTimeInterval = {
		startDateTime: "",
		endDateTime: ""
	}
	_links: ILinks = {
		employe: {},
		position: {},
		self: {}
	}
}
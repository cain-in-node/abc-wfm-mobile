import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';

// Localization
import { strings } from '../../i18n/i18n';

// Components
import Header from '../components/Header';
import Error from '../components/Error';

// Interfaces
import { INavProps } from '../interfaces/INavigation';

// Enums
import { ETypesOfEvents } from '../enums/ETypesOfEvents';
import { EFetchingStatus } from '../enums/EFetchingStatus';
import { EStatus } from '../enums/EStatus';

// Data of backend
import { DetailsDayAPI } from '../backend/Details';
import { UserApi } from '../backend/User';

// Utils
import moment from 'moment';
import Colors from '../services/Colors';
import { isEmptyObject } from '../utils/isEmptyObject';

// Sizes device
import { H3, H4, text } from '../utils/sizes/fontSize';
import Device from '../utils/sizes/sizeDevice';

@observer
export default class Info extends Component<INavProps> {
	static navigationOptions = {header: null};

	state = {
		error: false,
		errorConnect: false
	};

	get fecthTakeShiftProgress() {
		return UserApi.fetchingShift === EFetchingStatus.inProgLevel1;
	}

	get fecthPutShiftProgress() {
		return UserApi.fetchingShift === EFetchingStatus.inProgLevel2;
	}
	  
	get shiftIsActive() {
		return isEmptyObject(DetailsDayAPI.dataDay.shift);
	}

	get shiftExchangeIsActive() {
		return isEmptyObject(DetailsDayAPI.dataDay.shiftExchange);
	}

	get scheduleIsActive() {
		return isEmptyObject(DetailsDayAPI.dataDay.schedule);
	}

	goBack = () => {
		const firstDayInMonth: string = moment(DetailsDayAPI.dataDay.date).startOf('month').format('YYYY-MM-DD');
		const lastDayInMonth: string = moment(DetailsDayAPI.dataDay.date).endOf('month').format('YYYY-MM-DD');
		UserApi.setFetchingShift(EFetchingStatus.done);
		UserApi.getShifts(firstDayInMonth, lastDayInMonth);
		this.props.navigation.navigate('Calendar');  
	}

	goBackWithoutEvent = () => {
		UserApi.setFetchingShift(EFetchingStatus.done);
		this.props.navigation.navigate('Calendar');
	}

	takeShift() {
		UserApi.setFetchingShift(EFetchingStatus.inProgLevel1);
		const dataShiftChange = {_links: {employee: UserApi.userLinks.userEmployee,
								 self: DetailsDayAPI.dataDay.shiftExchange._links.takeShiftFromExchange}}
		UserApi.takeShift(dataShiftChange._links.self.href, dataShiftChange).catch(err => {
			UserApi.setFetchingShift(EFetchingStatus.error);
			!err.response ? this.setState({errorConnect: true}) : this.setState({error: true});
		}).then(() => {
			!this.state.error && !this.state.errorConnect ? this.goBack() : null;
		});
	}

	putShift() {
		UserApi.setFetchingShift(EFetchingStatus.inProgLevel2);
		const dataShiftChange = {_links: {self: DetailsDayAPI.dataDay.shift._links.putShiftToExchange}}
		UserApi.putShift(dataShiftChange._links.self.href, dataShiftChange).catch(err => {
			UserApi.setFetchingShift(EFetchingStatus.error);
			!err.response ? this.setState({errorConnect: true}) : this.setState({error: true});
		}).then(() => {
			!this.state.error && !this.state.errorConnect ? this.goBack() : null;
		});
	}

	renderShift() {
		DetailsDayAPI.getOrgUnit();
		const shiftThisDay = DetailsDayAPI.dataDay.shift;
		const startTime = shiftThisDay.dateTimeInterval.startDateTime;
		const endTime = shiftThisDay.dateTimeInterval.endDateTime;
		const isRequest = shiftThisDay._links.acceptShiftToExchange;

		return(
			<View style={[styles.row]}>
				{isRequest ? <Text style={[styles.status, styles.notApproved]}>{strings(`status.SEND_TO_EXCHANGE`)}</Text> : null}
				<Text style={[styles.title]}>{strings(`shifts.${DetailsDayAPI.dataDay.shift.type}`)}</Text>
				<Text style={[styles.orgUnit]}>{strings('helpers.in')} {DetailsDayAPI.orgUnit}</Text>
				<Text style={[styles.time]}>{`${strings('events.startTime')}: ${moment(startTime).format('HH:mm')}`}</Text>
				<Text style={[styles.time]}>{`${strings('events.endTime')}: ${moment(endTime).format('HH:mm')}`}</Text>
				{!isRequest ? <View style={[styles.button]}>
					<Button onPress={() => this.putShift()} title={strings('load.takeShiftOnExchange')}></Button>
				</View> : null}
			</View>
		)
	}

	renderShiftExchange() {
		const shiftThisDay = DetailsDayAPI.dataDay.shiftExchange;
		const startTime = shiftThisDay.dateTimeInterval.startDateTime;
		const endTime = shiftThisDay.dateTimeInterval.endDateTime;

		return(
			<View style={[styles.row]}>
				<Text style={[styles.title]}>{strings(`shifts.EXCHANGE`)}</Text>
				<Text style={[styles.time]}>{`${strings('events.startTime')}: ${moment(startTime).format('HH:mm')}`}</Text>
				<Text style={[styles.time]}>{`${strings('events.endTime')}: ${moment(endTime).format('HH:mm')}`}</Text>
				<View style={[styles.button]}>
					<Button onPress={() => this.takeShift()} title={strings('load.getShiftOnExchange')}></Button>
				</View>
			</View>
		)
	}

	renderSchedule() {
		const scheduleThisDay = DetailsDayAPI.dataDay.schedule;
		const startTime = scheduleThisDay.dateTimeInterval.startDateTime;
		const endTime = scheduleThisDay.dateTimeInterval.endDateTime;
		const approved = scheduleThisDay.status === EStatus.APPROVED;
		const showTime = scheduleThisDay.type === ETypesOfEvents.PARTIAL_ABSENCE || scheduleThisDay.type === ETypesOfEvents.SHIFT;

		return(
			<View style={[styles.row]}>
				<Text style={[styles.status, approved ? styles.approved : styles.notApproved]}>{strings(`status.${scheduleThisDay.status}`)}</Text>
				<Text style={[styles.title]}>{strings(`events.${DetailsDayAPI.dataDay.schedule.type}`)}</Text>
				<View style={[!showTime ? styles.hide : null]}>
					<Text style={[styles.time]}>{`${strings('events.startTime')}: ${moment(startTime).format('HH:mm')}`}</Text>
					<Text style={[styles.time]}>{`${strings('events.endTime')}: ${moment(endTime).format('HH:mm')}`}</Text>
				</View>
			</View>
		)
	}

	renderProgress() {
		// Вынести прелоудер со стилями в отдельный компонент
		return(
			<View style={[styles.preloader]}>
				{this.fecthTakeShiftProgress ? <Text style={[styles.textLoading]}>{strings('load.getShift')}</Text> : null}
				{this.fecthPutShiftProgress ? <Text style={[styles.textLoading]}>{strings('load.takeShift')}</Text> : null}
				<View style={[styles.horizontal]}>
					<ActivityIndicator size="large" color={Colors.grey} style={styles.activityIndicator} />
				</View>
			</View>
		)
	}

	render() {
		const currentYear = moment(DetailsDayAPI.dataDay.date).format('YYYY');
		const currentMonth = moment(DetailsDayAPI.dataDay.date).format('MM');
		const createScheduleError = UserApi.fetchingShift === EFetchingStatus.error;
		const notFectchRequests = this.fecthTakeShiftProgress || this.fecthPutShiftProgress;

      	return(
          	<View style={styles.container}>
				<Header handler={this.goBackWithoutEvent} custom={true} title={strings('events.infoByDay')} navigation={this.props.navigation}></Header>
				{notFectchRequests ? this.renderProgress() : <View>
					<Text style={[styles.headerWithDate]}>{DetailsDayAPI.dataDay.number}.{currentMonth}.{currentYear}</Text>
					{this.shiftIsActive ? this.renderShift() : null}
					{this.shiftExchangeIsActive && !this.shiftIsActive ? this.renderShiftExchange() : null}
					{this.scheduleIsActive ? this.renderSchedule() : null}
					{createScheduleError
						? <Error error={this.state.error} errorConnect={this.state.errorConnect} /> : null}
				</View>}
          	</View>
      	)
  	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	row: {
		borderTopWidth: 1,
		borderTopColor: Colors.grey,
		borderBottomWidth: 1,
		borderBottomColor: Colors.grey,
		paddingTop: 10,
		paddingBottom: 10,
		marginBottom: 20,
		marginLeft: 5,
		marginRight: 5,
	},
	headerWithDate: {
		fontSize: H3,
		marginTop: 20,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 20,
	},
	title: {
		fontSize: H3,
		marginLeft: 15,
		marginRight: 15,
	},
	button: {
		marginTop: 20,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 5
	},
	orgUnit: {
		fontSize: H4,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 5
	},
	time: {
		fontSize: text,
		marginLeft: 15,
		marginRight: 15,
	},
	preloader: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		marginBottom: Device.heightPercentageToDP('10%'),
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	textLoading: {
		textAlign: 'center',
		fontSize: H3,
		marginTop: 30
	},
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		marginTop: 50
	},
	status: {
		fontSize: text,
		textAlign: 'right',
		marginRight: 5,
	},
	approved: {
		color: Colors.green
	},
	notApproved: {
		color: Colors.warning
	},
	hide: {
		display: 'none'
	}
});
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Button } from 'react-native';
import { observer }   from 'mobx-react';
import { observable } from 'mobx';

// Localization
import { strings } 		 from '../../i18n/i18n';

// Components
import GestureRecognizer from 'react-native-swipe-gestures';
import Header    	  	 from '../components/Header';
import WorkMount      	 from '../components/WorkMount';
import Icon 			 from 'react-native-vector-icons/FontAwesome5';

// Interfaces
import { INavProps }  	 from '../interfaces/INavigation';
import { ISchedule } 	 from '../interfaces/ISchedule';

// Enums
import { ESymbol } 	  	 from '../enums/ESymbol';
import { EFetchingStatus } from '../enums/EFetchingStatus';
import { ETypesOfEvents } from '../enums/ETypesOfEvents';
import { ETypeShifts } 	 from '../enums/ETypeShifts';
import { EStatus } 		 from '../enums/EStatus';

// Data of backend
import { UserApi }    	 from '../backend/User';
import { ExchangeApi } 	 from '../backend/Exchange';
import { OrgUnitApi }    from '../backend/OrgUnit';
import { DetailsDayAPI } from '../backend/Details';

// Utils
import moment 		  	 from 'moment';
import Colors from '../services/Colors';
import { isEmptyObject } from '../utils/isEmptyObject';

// Sizes device
import { H3, H4, icon1 } from '../utils/sizes/fontSize';
import Device from '../utils/sizes/sizeDevice';

@observer
export default class Calendar extends Component<INavProps> {
	static navigationOptions = {header: null};
	@observable currentDate: Date = new Date;
	firstDayInMonth: string = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
	lastDayInMonth: string = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');
	numberCurrentMonth: number = 0;
	numberMonth = +(moment(this.currentDate).format('M'));
	numberYear = +(moment(this.currentDate).format('YYYY'));

	componentDidMount() {
		UserApi.getUser(this.firstDayInMonth,this.lastDayInMonth);
		OrgUnitApi.getOrgUnit();
	}

	getUserDataForMonth() {
		if(UserApi.fetchingStatusUser !== EFetchingStatus.done) return;
		const firstDayInMonth: string = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
		const lastDayInMonth: string = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');
		UserApi.getShifts(firstDayInMonth,lastDayInMonth);
		ExchangeApi.getShiftExchange(firstDayInMonth,lastDayInMonth);
	}

	changeMonth(symbol: string) {
		if(UserApi.fetchingStatusUser !== EFetchingStatus.done) return;
		DetailsDayAPI.deleteDay();
		if(symbol === ESymbol.plus) this.numberCurrentMonth++;
		if(symbol === ESymbol.minus) this.numberCurrentMonth--;
		this.numberCurrentMonth === 0
			? this.currentDate = new Date
			: this.currentDate = moment().add(this.numberCurrentMonth,'months').toDate();
		this.getUserDataForMonth();
		this.numberMonth = +(moment(this.currentDate).format('M'));
		this.numberYear = +(moment(this.currentDate).format('YYYY'));
	}

	renderTypeEvent = (event: ISchedule) => <Text style={styles.event}>{strings(`events.${event.type}`)}</Text>;

	renderTypeShift = (shift: ETypeShifts) => <Text style={styles.event}>{strings(`shifts.${shift}`)}</Text>

	renderShift(day = DetailsDayAPI.dataDay) {
		const startTime = day.shift.dateTimeInterval.startDateTime;
		const endTime = day.shift.dateTimeInterval.endDateTime;
		const exchange = day.shift.employeePositionId !== null;

		return (
			<View style={[styles.detailsDay]}>
				{exchange ? this.renderTypeShift(day.shift.type) : <Text style={styles.event}>{strings('shifts.EXCHANGE')}</Text>}
				<Text style={[styles.time]}>{`${strings('events.startTime')}: ${moment(startTime).format('HH:mm')}`}</Text>
				<Text style={[styles.time]}>{`${strings('events.endTime')}: ${moment(endTime).format('HH:mm')}`}</Text>
			</View>
		)
	}

	renderSchedule(day = DetailsDayAPI.dataDay) {
		const startTime = day.schedule.dateTimeInterval.startDateTime;
		const endTime = day.schedule.dateTimeInterval.endDateTime;
		const eventWithTime = day.schedule.type === ETypesOfEvents.SHIFT || day.schedule.type === ETypesOfEvents.PARTIAL_ABSENCE;

		return (
			<View style={[styles.detailsDay]}>
				{this.renderTypeEvent(day.schedule)}
				{eventWithTime ? <Text style={[styles.time]}>{`${strings('events.startTime')}: ${moment(startTime).format('HH:mm')}`}</Text> : null}
				{eventWithTime ? <Text style={[styles.time]}>{`${strings('events.endTime')}: ${moment(endTime).format('HH:mm')}`}</Text> : null}
			</View>
		)
	}

	renderDetails() {
		const shiftIsActive = isEmptyObject(DetailsDayAPI.dataDay.shift);
		const scheduleIsActive = isEmptyObject(DetailsDayAPI.dataDay.schedule);

		if(shiftIsActive) return this.renderShift();
		if(scheduleIsActive) return this.renderSchedule();

		if(!shiftIsActive && !scheduleIsActive) {
			return (
				<View style={[styles.detailsDay]}>
					<Text style={styles.event}>{DetailsDayAPI.checkedDay ? strings('events.weekend') : strings('entry.pickDay')}</Text>
				</View>
			)
		}
	}

	renderInfoByDay() {
		const shiftIsActive = isEmptyObject(DetailsDayAPI.dataDay.shift);
		const shiftExchangeIsActive = isEmptyObject(DetailsDayAPI.dataDay.shiftExchange);
		const scheduleIsActive = isEmptyObject(DetailsDayAPI.dataDay.schedule);
		const hasDayPassed = DetailsDayAPI.dataDay.hasDayPassed;

		return (
			<View style={[styles.detailsDayWrapper]}>
				{this.renderDetails()}
				<View style={[styles.detailsControls, DetailsDayAPI.checkedDay ? null : styles.hide]}>
					<TouchableOpacity style={[styles.control,
											  scheduleIsActive ? styles.hide : null,
											  hasDayPassed ? styles.hide : null]}
									  onPress={() => this.props.navigation.navigate('Create')}>
						<Icon name="plus" size={icon1} color={Colors.grey}></Icon>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.control,
											  !scheduleIsActive ? styles.hide : null,
											  hasDayPassed ? styles.hide : null]}
									  onPress={() => this.props.navigation.navigate('Edit')}>
						<Icon name="pencil-alt" size={icon1 - 2} color={Colors.grey}></Icon>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.control,
											  !shiftIsActive && !scheduleIsActive && !shiftExchangeIsActive ? styles.hide : null,
											  hasDayPassed ? styles.hide : null]}
									  onPress={() => this.props.navigation.navigate('Info')}>
						<Icon name="info" size={icon1} color={Colors.grey}></Icon>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	render() {
		const config = {
			velocityThreshold: 0.1,
			directionalOffsetThreshold: 120,
			gestureIsClickThreshold: 20
		};

		const userLoadDone = UserApi.fetchingStatusUser === EFetchingStatus.done;
		const hideRightButton = this.numberCurrentMonth > 1;
		const hideLeftButton = this.numberCurrentMonth <= -1;
		const notSwipeToRight = this.numberCurrentMonth > -1;
		const notSwipeToLeft = this.numberCurrentMonth < 2;

		return (
			<View style={{ flex: 1 }}>
				<Header handler={() => {}} custom={false} title={strings('central.calendar')} navigation={this.props.navigation} />
				<View style={[styles.navigation]}>
					<TouchableOpacity style={[hideLeftButton ? styles.hide : null]} onPress={() => this.changeMonth(ESymbol.minus)}>
						<Icon style={{ marginLeft: 15 }} name="chevron-left" size={icon1} color={Colors.grey}></Icon>
					</TouchableOpacity>
					<Text style={[styles.date]}>{strings(`namesMonths.${this.numberMonth}`)} {this.numberYear}</Text>
					<TouchableOpacity style={[hideRightButton ? styles.hide : null]} onPress={() => this.changeMonth(ESymbol.plus)}>
						<Icon style={{ marginRight: 15 }} name="chevron-right" size={icon1} color={Colors.grey}></Icon>
					</TouchableOpacity>
				</View>
				<GestureRecognizer
					onSwipeLeft={() => notSwipeToLeft ? this.changeMonth(ESymbol.plus) : null}
					onSwipeDown={() => this.getUserDataForMonth()}
					onSwipeRight={() => notSwipeToRight ? this.changeMonth(ESymbol.minus) : null}
					config={config}>
					<View style={{ height: Device.heightPercentageToDP('63%') }}>
						<WorkMount date={this.currentDate} />
					</View>
				</GestureRecognizer>
				{userLoadDone ? this.renderInfoByDay() : <View style={[styles.detailsDayWrapper]}></View>}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	detailsDayWrapper: {
		display: 'flex',
		flexDirection: 'row',
		height: Device.heightPercentageToDP('22%'),
		borderTopWidth: 1,
		borderTopColor: Colors.lightGrey,
	},
	detailsDay: {
		paddingTop: Device.heightPercentageToDP('1%'),
		paddingLeft: Device.heightPercentageToDP('2%'),
		paddingRight: Device.heightPercentageToDP('2%'),
		width: Device.widthPercentageToDP('82%')
	},
	detailsControls: {
		width: Device.widthPercentageToDP('18%'),
		display: 'flex',
		flexDirection: 'column',
		borderLeftWidth: 1,
		borderLeftColor: Colors.lightGrey,
		alignItems: 'stretch'
	},
	control: {
		height: Device.heightPercentageToDP('9%'),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	navigation: {
		height: Device.heightPercentageToDP('7%'),
		padding: 10,
		flexDirection: "row",
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	date: {
		padding: 15,
		fontSize: H3
	},
	time: {
		fontSize: H4
	},
	event: {
		fontSize: H3
	},
	status: {
		position: 'absolute',
		right: 0,
		top: -3,
		textAlign: 'right',
		fontSize: 10,
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
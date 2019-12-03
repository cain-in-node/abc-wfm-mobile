import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer }   from 'mobx-react';

// Components
import IconF from 'react-native-vector-icons/FontAwesome';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import IconIos from 'react-native-vector-icons/Ionicons';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

// Interfaces
import { IDate } 			from '../interfaces/IDate';
import { IDay } from '../interfaces/IDays';

// Enums
import { ETypeShifts } from '../enums/ETypeShifts';
import { ETypesOfEvents } from '../enums/ETypesOfEvents';
import { EStatus } from '../enums/EStatus';

// Data of backend
import { UserApi }   	 from '../backend/User';
import { DetailsDayAPI } from '../backend/Details';

// Utils
import moment from 'moment';
import Colors from '../services/Colors';
import { getNumberFirstDay } from '../utils/getNumberFirstDay';
import { isEmptyObject } from '../utils/isEmptyObject';

// Sizes device
import { text, icon2, icon3 } from '../utils/sizes/fontSize';
import Device from '../utils/sizes/sizeDevice';

@observer
export default class WorkWeek extends Component<IDate> {

	state = {
		checkedDay: null
	}

	numberFirstDayInMonth = getNumberFirstDay(moment(this.props.date).startOf('month').format('YYYY-MM-DD hh:mm'));

	renderWorkDay(item: IDay) {
		if(isEmptyObject(item.shift)) {
			switch(item.shift.type) {
				case ETypeShifts.FULL_DAY:
					return <View style={[styles.marker, styles.workMiddleday]}></View>;
				case ETypeShifts.OPEN:
					return <View style={[styles.marker, styles.workFromMorning]}></View>;
				case ETypeShifts.MIDDLE:
					return <View style={[styles.marker, styles.workMiddleday]}></View>;
				case ETypeShifts.CLOSE:
					return <View style={[styles.marker, styles.workFromEvening]}></View>;
				case ETypeShifts.OUTSIDE_OPEN:
					return <View style={[styles.marker, styles.workFromMorning]}></View>;
				case ETypeShifts.OUTSIDE_CLOSE:
					return <View style={[styles.marker, styles.workFromEvening]}></View>;
			}
		}
	}

	renderExchangeDay(item: IDay) {
		if(isEmptyObject(item.shiftExchange)) {
			const hasDayPassed = item.hasDayPassed;
			let isRequest;

			if(isEmptyObject(item.shift)) {isRequest = item.shift._links.acceptShiftToExchange}

			if(hasDayPassed) return;

			if(isRequest) return <IconF5 style={[styles.status, styles.statusExclamation]} name="exclamation" size={8} color={Colors.black}></IconF5>;

			return <IconF5 style={[styles.status]} name="question" size={8} color={Colors.black}></IconF5>;
		}
	}

	renderNotWorkDay(item: IDay) {
		if(isEmptyObject(item.schedule)) {
			const approvedEvent = item.schedule.status === EStatus.APPROVED;
			switch(item.schedule.type) {
				case ETypesOfEvents.OFF_TIME:
					return <IconF5 style={[styles.markerExchange, approvedEvent ? null : styles.notApproved]}
								 name="coffee" size={icon3} color={Colors.schedule}></IconF5>;
				case ETypesOfEvents.PARTIAL_ABSENCE:
					return <IconF5 style={[styles.markerExchange, approvedEvent ? null : styles.notApproved]}
								 name="user-clock" size={icon3} color={Colors.schedule}></IconF5>;
				case ETypesOfEvents.SHIFT:
					return <IconMCI style={[styles.markerExchange, approvedEvent ? null : styles.notApproved]}
								 name="calendar-clock" size={icon2} color={Colors.schedule}></IconMCI>;
				case ETypesOfEvents.SICK_LEAVE:
					return  <IconF5 style={[styles.markerExchange, approvedEvent ? null : styles.notApproved]}
								 name="briefcase-medical" size={icon3} color={Colors.schedule}></IconF5>;
				case ETypesOfEvents.VACATION:
					return  <IconF5 style={[styles.markerExchange, approvedEvent ? null : styles.notApproved]}
								 name="umbrella-beach" size={icon3} color={Colors.schedule}></IconF5>;
				case ETypesOfEvents.TRAINING:
					return  <IconF style={[styles.markerExchange, approvedEvent ? null : styles.notApproved]}
								  name="book" size={icon3} color={Colors.schedule}></IconF>;
				case ETypesOfEvents.BUSINESS_TRIP:
					return  <IconIos style={[styles.markerExchange, approvedEvent ? null : styles.notApproved]}
								  name="md-airplane" size={icon3} color={Colors.schedule}></IconIos>;
			  }
		}
	}
	
	renderEventsByDay = (item: IDay) => {
		return(
			<Fragment>
				{this.renderExchangeDay(item)}
				{this.renderWorkDay(item)}
				{this.renderNotWorkDay(item)}
			</Fragment>
		)
	}

	checkDay(item: IDay) {
		DetailsDayAPI.setDay(item);
		this.setState({ checkedDay: item.number });
	}

  	render() {
		return (
			<View style={styles.row}>
				{UserApi.totalArrayByRender.map((item: IDay, id: number) => {
					const isShift = isEmptyObject(item.shift);
					const weekend = (id + 1)%7 === 0 || (id + 2)%7 === 0;
					const active = item.active;
					const checked = id + 2 - this.numberFirstDayInMonth === this.state.checkedDay;
					const today = item.today;
					const hasDayPassed = item.hasDayPassed;
					
					return (
						<TouchableOpacity key={'key-' + id} onPress={() => active ? this.checkDay(item) : null}>
							<View style={[
								styles.day,
								hasDayPassed ? styles.opacity : null,
								today ? styles.today : null,
								active ? null : styles.dayNotInfo]}>
								<Text style={[styles.text,
												checked ? styles.focus : null,
												isShift ? styles.white : null,
												weekend ? styles.weekend : null]}>
									{item.number}
								</Text>
								{active ? this.renderEventsByDay(item) : null}
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
		);
  	}
}

const styles = StyleSheet.create({
	day: {
		width: Device.widthPercentageToDP('10%'),
		height: Device.heightPercentageToDP('8.8%'),
		borderRadius: 6,
		borderColor: Colors.lightGrey,
		borderWidth: 1,
		marginLeft: Device.widthPercentageToDP('1.5%'),
		marginRight: Device.widthPercentageToDP('1.5%'),
		marginBottom: Device.widthPercentageToDP('2%'),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	today: {
		borderColor: Colors.green
	},
	dayNotInfo: {
		backgroundColor: Colors.lightGrey
	},
	text: {
		textAlign: 'center',
		zIndex: 2,
		height: Device.heightPercentageToDP('2.8%'),
		width: Device.widthPercentageToDP('6%'),
		margin: 5,
		marginBottom: 'auto',
		fontSize: text,
		color: Colors.black
	},
	white: {
		color: Colors.white
	},
	markerWrapper: {
		borderWidth: 1,
		borderColor: Colors.black,
		borderRadius: 5,
	},
	marker: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: Device.widthPercentageToDP('10%') - 2,
		height: Device.heightPercentageToDP('8.8%') - 2,
		borderRadius: 5,
		zIndex: 1
	},
	markerExchange: {
		textAlign: 'center',
		paddingBottom: Device.heightPercentageToDP('1%'),
		zIndex: 2
	},
	workFromMorning: {
		backgroundColor: Colors.sinceOpening,
	},
	workMiddleday: {
		backgroundColor: Colors.fullDay
	},
	workFromEvening: {
		backgroundColor: Colors.untilСlosing,
	},
	notWork: {
		backgroundColor: '#ef9a9a',
	},
	status: {
		position: 'absolute',
		right: 2,
		top: 2,
	},
	statusExclamation: {
		zIndex: 2,
		left: 3,
		right: 0
	},
	exchange: {
		backgroundColor: Colors.black
	},
	notApproved: {
		opacity: 0.5
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		flexWrap: 'wrap',
		marginBottom: 10,
		paddingLeft: 5,
		paddingRight: 5
	},
	weekend: {
		color: Colors.warning
	},
	focus: {
		backgroundColor: Colors.green,
		borderRadius: 10,
		color: Colors.white
	},
	opacity: {
		opacity: 0.5
	},
	notFocus: {
		borderColor: Colors.lightGrey,
	}
});
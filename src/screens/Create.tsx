import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Picker } from 'react-native';
import { observer } from 'mobx-react';

// Localization
import { strings } from '../../i18n/i18n';

// Classes
import { CreateSchedule } from '../class/CreateSchedule';

// Components
import Header from '../components/Header';
import Error from '../components/Error';
import DatePicker from 'react-native-datepicker';

// Interfaces
import { INavProps } from '../interfaces/INavigation';

// Enums
import { ETypesOfEvents } from '../enums/ETypesOfEvents';
import { ETimeEvents } from '../enums/ETimeEvents';
import { EFetchingStatus } from '../enums/EFetchingStatus';
import { EStatus } from '../enums/EStatus';

// Data of backend
import { UserApi } from '../backend/User';
import { DetailsDayAPI } from '../backend/Details';

// Utils
import moment from 'moment';
import Colors from '../services/Colors';
import { parseDate, parseDateChangeDay } from '../utils/parsers/dateParser';

// Sizes device
import { H5 } from '../utils/sizes/fontSize';
import Device from '../utils/sizes/sizeDevice';

@observer
export default class Create extends Component<INavProps> {
	static navigationOptions = {header: null};

	state = {
		withTimeAndDate: true,
		withDate: false,
		type: ETypesOfEvents.SHIFT,
		status: EStatus.NOT_APPROVED,
		initStartTime: "00:00",
		initEndTime: "00:00",
		startDate: parseDateChangeDay(DetailsDayAPI.dataDay.date, DetailsDayAPI.dataDay.number),
		endDate: parseDateChangeDay(DetailsDayAPI.dataDay.date, DetailsDayAPI.dataDay.number),
		startTime:  "",
		endTime:  "",
		daylong: false,
		error: false,
		errorConnect: false
	};

  	goBack(): void {
		const firstDayInMonth: string = moment(DetailsDayAPI.dataDay.date).startOf('month').format('YYYY-MM-DD');
		const lastDayInMonth: string = moment(DetailsDayAPI.dataDay.date).endOf('month').format('YYYY-MM-DD');
		UserApi.setFetchingSchedule(EFetchingStatus.done);
		UserApi.getSchedules(firstDayInMonth, lastDayInMonth);
		this.props.navigation.navigate('Calendar');
	}

	goBackWithoutEvent = () => {
		UserApi.setFetchingSchedule(EFetchingStatus.done);
		this.props.navigation.navigate('Calendar');
	}

	setTimeInState(time: string, event: string): void {
		event === ETimeEvents.START
			? this.setState({ initStartTime: time, startTime: this.getStartTime(time) })
			: this.setState({ initEndTime: time, endTime: this.getEndTime(time) });
	}

	setStartDateInState(date: string) {
		const pickDate: string = `${moment(date).format('YYYY-MM-DD')}T00:00:00`;
		this.setState({ startTime: pickDate, startDate: pickDate });
	}

	setEndDateInState(date: string) {
		const pickDate: string = `${moment(date).format('YYYY-MM-DD')}T08:00:00`;
		this.setState({ endTime: pickDate, endDate: pickDate });
	}

	getStartTime(time: string) {
		this.setState({error: false});
		return `${parseDate(moment(this.state.startDate).format('YYYY-MM-DDTh:mm:ss'))}T${time}:00`;
	}

	getEndTime(time: string) {
		this.setState({error: false});
		return `${parseDate(moment(this.state.endDate).format('YYYY-MM-DDTh:mm:ss'))}T${time}:00`;
	}

	handlerChangeTypeEvent(itemValue: string): void {
		this.setState({errorConnect: false, error: false});
		if(itemValue === ETypesOfEvents.SHIFT || itemValue === ETypesOfEvents.PARTIAL_ABSENCE) {
			this.setState({	withTimeAndDate: true,
							withDate: false,
							daylong: false,
							type: itemValue})
		} else if(itemValue === ETypesOfEvents.OFF_TIME) {
			this.setState({	withTimeAndDate: false,
							withDate: false,
							daylong: true,
							type: itemValue,
							startTime: this.getStartTime('00:00'),
							endTime: this.getEndTime('08:00')});
		} else {
			this.setState({	withTimeAndDate: false,
							withDate: true,
							daylong: true,
							type: itemValue,
							startTime: this.getStartTime('00:00'),
							endTime: this.getEndTime('08:00')});
		}
	}

	handlerCreateEvent(): void {
		this.setState({errorConnect: false});
		const newSchedule = new CreateSchedule( this.state.type,
												this.state.status,
												this.state.daylong,
												this.state.startTime,
												this.state.endTime)
		UserApi.createSchedule(newSchedule).catch(err => {
			UserApi.setFetchingSchedule(EFetchingStatus.error);
			!err.response ? this.setState({errorConnect: true}) : this.setState({error: true});
		}).then(() => {
			!this.state.error && !this.state.errorConnect ? this.goBack() : null;
		});
	}

	renderProgress() {
		// Ввынести прелоудер со стилями в отдельный компонент
		return(
			<View style={[styles.preloader]}>
				<Text style={[styles.textLoading]}>{strings('load.createRequestEvent')}</Text>
				<View style={[styles.horizontal]}>
					<ActivityIndicator size="large" color={Colors.grey} style={styles.activityIndicator} />
				</View>
			</View>
		)
	}

	renderForm() {
		const createScheduleError = UserApi.fetchingSchedule === EFetchingStatus.error;
		const currentYear = moment(DetailsDayAPI.dataDay.date).format('YYYY');
		const currentMonth = moment(DetailsDayAPI.dataDay.date).format('MM');

		return(
			<View>
				<Text style={[styles.headerWithDate]}>{DetailsDayAPI.dataDay.number}.{currentMonth}.{currentYear}</Text>
				<Text style={[styles.title]}>{strings('events.type')}</Text>
				<View style={[styles.selectWrapper]}>
					<Picker
						selectedValue={this.state.type}
						style={[styles.select]}
						onValueChange={(itemValue, itemIndex) => this.handlerChangeTypeEvent(itemValue)}>
						<Picker.Item label={strings('events.SHIFT')} value={ETypesOfEvents.SHIFT} />
						<Picker.Item label={strings('events.OFF_TIME')} value={ETypesOfEvents.OFF_TIME} />
						<Picker.Item label={strings('events.VACATION')} value={ETypesOfEvents.VACATION} />
						<Picker.Item label={strings('events.SICK_LEAVE')} value={ETypesOfEvents.SICK_LEAVE} />
						<Picker.Item label={strings('events.PARTIAL_ABSENCE')} value={ETypesOfEvents.PARTIAL_ABSENCE} />
						<Picker.Item label={strings('events.TRAINING')} value={ETypesOfEvents.TRAINING} />
						<Picker.Item label={strings('events.BUSINESS_TRIP')} value={ETypesOfEvents.BUSINESS_TRIP} />
					</Picker>
				</View>
				<View style={[this.state.withTimeAndDate ? null : styles.hide]}>
					<View style={[styles.containerWithColumns]}>
						<View style={[styles.column]}>
							<Text style={[styles.title]}>{strings('events.startDate')}</Text>
							<DatePicker
								style={styles.dataPicker}
								date={this.state.startDate}
								mode="date"
								placeholder={strings('events.pickDate')}
								format="YYYY-MM-DD"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								customStyles={{
									dateIcon: { display: 'none' },
									dateInput: {marginLeft: Device.widthPercentageToDP('5%')}
								}}
								onDateChange={(date) => this.setStartDateInState(date)}/>
						</View>
						<View style={[styles.column]}>
							<Text style={[styles.title]}>{strings('events.endDate')}</Text>
							<DatePicker
								style={styles.dataPicker}
								date={this.state.endDate}
								mode="date"
								placeholder={strings('events.pickDate')}
								format="YYYY-MM-DD"
								minDate={this.state.startDate}
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								customStyles={{
									dateIcon: { display: 'none' },
									dateInput: {marginLeft: Device.widthPercentageToDP('5%')}
								}}
								onDateChange={(date) => this.setEndDateInState(date)}/>
						</View>
					</View>
					<View style={[styles.containerWithColumns]}>
						<View style={[styles.column]}>
							<Text style={[styles.title]}>{strings('events.startTime')}</Text>
							<DatePicker
								style={styles.dataPicker}
								date={this.state.initStartTime}
								mode="time"
								format="HH:mm"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								customStyles={{
									dateIcon: { display: 'none' },
									dateInput: {marginLeft: Device.widthPercentageToDP('5%')}
								}}
								onDateChange={(time) => this.setTimeInState(time, ETimeEvents.START)}
							/>
						</View>
						<View style={[styles.column]}>
							<Text style={[styles.title]}>{strings('events.endTime')}</Text>
							<DatePicker
								style={styles.dataPicker}
								date={this.state.initEndTime}
								mode="time"
								format="HH:mm"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								customStyles={{
									dateIcon: { display: 'none' },
									dateInput: {marginLeft: Device.widthPercentageToDP('5%')}
								}}
								onDateChange={(time) => this.setTimeInState(time, ETimeEvents.END)}
							/>
						</View>
					</View>
				</View>
				<View style={[styles.containerWithRows, this.state.withDate ? null : styles.hide]}>
					<View style={[styles.containerWithColumns]}>
						<View style={[styles.column]}>
							<Text style={[styles.title]}>{strings('events.startDate')}</Text>
							<DatePicker
								style={styles.dataPicker}
								date={this.state.startDate}
								mode="date"
								placeholder={strings('events.pickDate')}
								format="YYYY-MM-DD"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								customStyles={{
									dateIcon: { display: 'none' },
									dateInput: {marginLeft: Device.widthPercentageToDP('5%')}
								}}
								onDateChange={(date) => this.setStartDateInState(date)}/>
						</View>
						<View style={[styles.column]}>
							<Text style={[styles.title]}>{strings('events.endDate')}</Text>
							<DatePicker
								style={styles.dataPicker}
								date={this.state.endDate}
								mode="date"
								placeholder={strings('events.pickDate')}
								format="YYYY-MM-DD"
								minDate={this.state.startDate}
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								customStyles={{
									dateIcon: { display: 'none' },
									dateInput: {marginLeft: Device.widthPercentageToDP('5%')}
								}}
								onDateChange={(date) => this.setEndDateInState(date)}/>
						</View>
					</View>
				</View>
				{createScheduleError
					? <Error error={this.state.error} errorConnect={this.state.errorConnect} /> : null}
				<View style={{ marginTop: 30, marginLeft: 15, marginRight: 15 }}>
					<Button title={strings('entry.create')} onPress={() => this.handlerCreateEvent()} />
				</View>
			</View>
		)
	}

  	render() {
		const createScheduleInProg = UserApi.fetchingSchedule === EFetchingStatus.inProg;

      	return(
          	<View style={styles.container}>
				<Header handler={this.goBackWithoutEvent} custom={true} title={strings('load.createEvent')} navigation={this.props.navigation}></Header>
				{!createScheduleInProg ? this.renderForm() : null}
				{createScheduleInProg ? this.renderProgress() : null}
          	</View>
      	)
  	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	dataPicker: {
		width: Device.widthPercentageToDP('45%')
	},
	containerWithColumns: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	containerWithRows: {
		display: 'flex',
		flexDirection: 'column',
	},
	headerWithDate: {
		fontSize: 20,
		marginTop: 20,
		marginLeft: 15,
		marginRight: 15,
	},
	column: {
		width: Device.widthPercentageToDP('50%')
	},
	marginStandar: {
		marginLeft: Device.widthPercentageToDP('5%'),
		marginRight: Device.widthPercentageToDP('5%'),
	},
	preloader: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		marginBottom: Device.heightPercentageToDP('10%'),
	},
	select: {
		height: 50,
		width: Device.widthPercentageToDP('90%'),
		margin: 1,
	},
	selectWrapper: {
		marginLeft: Device.widthPercentageToDP('5%'),
		marginRight: Device.widthPercentageToDP('5%'),
		borderWidth: 1,
		borderColor: Colors.grey,
		borderRadius: 5,
	},
	title: {
		fontSize: H5,
		marginTop: 20,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 10,
	},
	hide: {
		display: 'none'
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	textLoading: {
		textAlign: 'center',
		fontSize: 20,
		marginTop: 30
	},
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		marginTop: 50
	},
});
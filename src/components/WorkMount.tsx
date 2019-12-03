import React, { Component, Fragment }  from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { observer }  		from 'mobx-react';

// Localization
import { strings } 		 from '../../i18n/i18n';

// Components
import WorkWeek 			from './WorkWeek';

// Interfaces
import { IDate } 			from '../interfaces/IDate';

// Enums
import { EFetchingStatus } 	from '../enums/EFetchingStatus';

// Data of backend
import { UserApi }    	 from '../backend/User';

// Utils
import moment 				from 'moment';
import Colors from '../services/Colors';

// Sizes device
import { H3, text } from '../utils/sizes/fontSize';
import Device from '../utils/sizes/sizeDevice';

@observer
export default class WorkMount extends Component<IDate> {
	static defaultProps = {date: new Date}
	public numberMonth: number = 0;

	renderProgLevel1() {
		return (
		<View style={[styles.container]}>
			<Text style={[styles.textLoading]}>{strings('load.getUserData')}</Text>
			<View style={[styles.horizontal]}>
				<ActivityIndicator size="large" color={Colors.grey} style={styles.activityIndicator} />
			</View>
		</View>)
	}

	renderProgLevel2() {
		return (
		<View style={[styles.container]}>
			<Text style={[styles.textLoading]}>{strings('load.formScheduleFor')} {strings(`namesMonths.${this.numberMonth}`)}</Text>
			<View style={[styles.horizontal]}>
				<ActivityIndicator size="large" color={Colors.grey} style={styles.activityIndicator} />
			</View>
		</View>)
	}

	renderProgLevel3() {
		return (
		<View style={[styles.container]}>
			<Text style={[styles.textLoading]}>{strings('load.getShiftsFor')} {strings(`namesMonths.${this.numberMonth}`)}</Text>
			<View style={[styles.horizontal]}>
				<ActivityIndicator size="large" color={Colors.grey} style={styles.activityIndicator} />
			</View>
		</View>)
	}

	renderShedule() {
		return (
			<View style={{ height: Device.heightPercentageToDP('65%') }}>
				<View style={[styles.wrapperDays]}>
					<Text style={[styles.nameDay]}>{strings('daysOfWeek.short.1')}</Text>
					<Text style={[styles.nameDay]}>{strings('daysOfWeek.short.2')}</Text>
					<Text style={[styles.nameDay]}>{strings('daysOfWeek.short.3')}</Text>
					<Text style={[styles.nameDay]}>{strings('daysOfWeek.short.4')}</Text>
					<Text style={[styles.nameDay]}>{strings('daysOfWeek.short.5')}</Text>
					<Text style={[styles.nameDay]}>{strings('daysOfWeek.short.6')}</Text>
					<Text style={[styles.nameDay]}>{strings('daysOfWeek.short.7')}</Text>
				</View>
				<WorkWeek date={this.props.date} />
			</View>
		)
	}

  	render() {
		this.numberMonth     = +(moment(this.props.date).format('M'));
		const userProgLevel1 = UserApi.fetchingStatusUser === EFetchingStatus.inProgLevel1;
		const userProgLevel2 = UserApi.fetchingStatusUser === EFetchingStatus.inProgLevel2;
		const userProgLevel3 = UserApi.fetchingStatusUser === EFetchingStatus.inProgLevel3;
		const userDone 		 = UserApi.fetchingStatusUser === EFetchingStatus.done;
		const userError 	 = UserApi.fetchingStatusUser === EFetchingStatus.error;

        return (
			<Fragment>
				{userProgLevel1 ? this.renderProgLevel1() : null}
				{userProgLevel2 ? this.renderProgLevel2() : null}
				{userProgLevel3 ? this.renderProgLevel3() : null}
				{userDone ? this.renderShedule() : null}
				{/* {userError ? <Text>Ошибка</Text> : null} */}
			</Fragment>
		);
  	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		flexDirection: 'column'
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	textLoading: {
		textAlign: 'center',
		fontSize: H3,
		marginLeft: 15,
		marginRight: 15
	},
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: Device.heightPercentageToDP('4%'),
		marginTop: Device.heightPercentageToDP('5%')
	},
	wrapperDays: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingLeft: 5,
		paddingRight: 5,
		height: Device.heightPercentageToDP('4%')
	},
	nameDay: {
		textAlign: 'center',
		width: Device.widthPercentageToDP('10%'),
		fontSize: text,
	}
});

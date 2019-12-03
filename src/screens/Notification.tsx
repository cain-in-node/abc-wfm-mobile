import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Picker, ActivityIndicator, Animated } from 'react-native';
import { observer } from 'mobx-react';

// Components
import Header from '../components/Header';
import Error from '../components/Error';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconIconic from 'react-native-vector-icons/Ionicons';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

// Interfaces
import { INotification } from '../interfaces/INotification';
import { INavProps } from '../interfaces/INavigation';

// Enums
import { ETypeNotification } from '../enums/ETypeNotification';
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Data of backend
import { NotificationApi } from '../backend/Notification';

// Utils
import moment from 'moment';
import { strings }    from '../../i18n/i18n';
import Colors from '../services/Colors';

// Sizes device
import { H3, H4, text, icon3 } from '../utils/sizes/fontSize';
import { MarSidByCont } from '../utils/sizes/margin';
import Device from '../utils/sizes/sizeDevice';

@observer
export default class Notification extends Component<INavProps> {
	state = {
		numberOpenNotific: null,
		typeNotific: ETypeNotification.all,
		error: false,
		errorConnect: false
	}

	get fetchGetNotification() {
		return NotificationApi.fetchingStatusNotification === EFetchingStatus.inProg;
	}

	get fetchDoneNotification() {
		return NotificationApi.fetchingStatusNotification === EFetchingStatus.done;
	}

	get fetchErrorNotification() {
		return NotificationApi.fetchingStatusNotification === EFetchingStatus.error;
	}

	componentDidMount() {
		NotificationApi.getProfileInfo();
	}

	renderInProg() {
		return (
		<View style={[styles.container]}>
			<Text style={[styles.textLoading]}>{strings('notification.getNotificaton')}</Text>
			<View style={[styles.horizontal]}>
				<ActivityIndicator size="large" color={Colors.grey} style={styles.activityIndicator} />
			</View>
		</View>)
	}

	handlerOpenNotific(item: INotification, id: number) {
		this.setState({ numberOpenNotific: this.state.numberOpenNotific === id ? null : id })
		
		if(item.received === false) {
			NotificationApi.notificationReceived(item._links.self.href);
			NotificationApi.notification[id].received = true;
		}
	}

	handlerDeleteNotification(item: INotification, id: number) {
		this.setState({ numberOpenNotific: null })
		NotificationApi.deleteNotification(item._links.self.href);
		NotificationApi.deleteLocalNotification(id);
	}

	renderIconRender(item: INotification, isStatus: boolean = false) {
		const iconName: string = !isStatus ? 'ios-mail' : item.received ? 'ios-mail-open' : 'ios-mail-unread';
		const iconColor: string = !isStatus ? Colors.black : item.received ? Colors.grey : Colors.green;
		if(this.state.typeNotific === ETypeNotification.deleted) {
			return <IconIconic style={[styles.status]} name="md-trash" size={icon3} color={Colors.warning}></IconIconic>;
		}
		return <IconIconic style={[styles.status]} name={iconName} size={icon3} color={iconColor}></IconIconic>;
	}

	////////////////////////////////////////////////

	// renderRightActions = (progress: any, dragX: any) => {
	// 	console.log(dragX)
	// 	const trans = dragX.interpolate({
	// 		inputRange: [0, 50, 100, 101],
	// 		outputRange: [0, 0, 0, 0],
	// 	});

	// 	return (
	// 		<View style={{ width: 80, backgroundColor: 'red' }}>
	// 			<RectButton style={styles.leftAction }>
	// 				<Animated.Text style={[{transform: [{ translateX: trans }], color: 'white'}]}>
	// 					Archive
	// 				</Animated.Text>
	// 			</RectButton>
	// 		</View>
	// 	  );
	// };

	/////////////////////////////////////

	renderNotificationContainer() {
		return (<SafeAreaView>
					<ScrollView>
					{NotificationApi.notification.length === 0 ? <Text style={styles.noNotifications}>{strings('notification.notHaveNotification')}</Text> : null}
					{NotificationApi.notification.map((item, id) => {
						return <View style={[styles.notificWrapper,
									id === NotificationApi.notification.length -1 ? styles.marginLastChild : null]} key={`id_${id}`}>
							<TouchableOpacity onPress={() => this.handlerOpenNotific(item, id)}>
								{this.renderIconRender(item, true)}
								<Text style={[styles.date]}>{moment(item.creationTime).format('DD.MM.YYYY h:mm')}</Text>
								<Text style={[styles.title, MarSidByCont]}>{strings(`eventType.${item.eventTypeName}`)}</Text>
								<Icon style={[styles.chevron, this.state.numberOpenNotific === id ? styles.open : null]}
									name="chevron-down" size={icon3} color={Colors.black}></Icon>
							</TouchableOpacity>
							<View style={[MarSidByCont, this.state.numberOpenNotific === id ? null : styles.hide]}>
								<Text style={[styles.text]}>{item.text}</Text>
								<TouchableOpacity style={[styles.deleteWrapper, this.state.typeNotific === ETypeNotification.deleted ? styles.hide : null]}
												onPress={() => this.handlerDeleteNotification(item, id)}>
									<Text style={[styles.delete]}>{strings('entry.delete')}</Text>
								</TouchableOpacity>
							</View>
						</View>
					})}
					{/* <FlatList
						data={NotificationApi.notification}
						ItemSeparatorComponent={() => <View style={styles.separator} />}
						renderItem={({ item }) => (
							<Swipeable
								friction={2}
								leftThreshold={30}
								rightThreshold={40}
								renderRightActions={this.renderRightActions}>
									<RectButton style={styles.rectButton}>
										<Text>{strings(`eventType.${item.eventTypeName}`)}</Text>
										<Text>{item.text}</Text>
									</RectButton>
							</Swipeable>
						)}
						keyExtractor={(item, index) => `message ${index}`}
					/> */}
				</ScrollView>
			</SafeAreaView>)
	}

	handlerChangeTypeEvent(value: ETypeNotification) {
		this.setState({ numberOpenNotific: null });
		switch(value) {
			case `${ETypeNotification.all}`:
				this.setState({ typeNotific: ETypeNotification.all });
				NotificationApi.getNotifications();
				break;
			case `${ETypeNotification.recevied}`:
				this.setState({ typeNotific: ETypeNotification.recevied });
				NotificationApi.getNotifications(false, true, false);
				break;
			case `${ETypeNotification.notRecevied}`:
				this.setState({ typeNotific: ETypeNotification.notRecevied });
				NotificationApi.getNotifications(false, false, false);
				break;
			case `${ETypeNotification.deleted}`:
				this.setState({ typeNotific: ETypeNotification.deleted });
				NotificationApi.getNotifications(true, false, true, 20);
				break;
		}

	}

  	render() {
		return (
			<View style={{ flex: 1 }}>
				<Header handler={()=> {}} custom={false} title={strings('central.notific')} navigation={this.props.navigation} />
				<Picker selectedValue={this.state.typeNotific}
						onValueChange={(itemValue) => this.handlerChangeTypeEvent(itemValue)}>
					<Picker.Item label={strings('typeNotification.all')} value={ETypeNotification.all} />
					<Picker.Item label={strings('typeNotification.recevied')} value={ETypeNotification.recevied} />
					<Picker.Item label={strings('typeNotification.notRecevied')} value={ETypeNotification.notRecevied} />
					<Picker.Item label={strings('typeNotification.deleted')} value={ETypeNotification.deleted} />
				</Picker>
				{this.fetchGetNotification ? this.renderInProg() : null}
				{this.fetchDoneNotification ? this.renderNotificationContainer() : null}
				{this.fetchErrorNotification
					? <Error error={this.state.error} errorConnect={this.state.errorConnect} /> : null}
			</View>
		);
  	}
}

const styles = StyleSheet.create({
	notificWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.grey,
		paddingTop: Device.heightPercentageToDP('1%'),
		paddingBottom: Device.heightPercentageToDP('1%'),
		position: 'relative'
	},
	rectButton: {
		flex: 1,
		height: 80,
		paddingVertical: 10,
		paddingHorizontal: 20,
		justifyContent: 'space-between',
		flexDirection: 'column',
		backgroundColor: 'white',
	},
	separator: {
		backgroundColor: 'rgb(200, 199, 204)',
		height: StyleSheet.hairlineWidth,
	},
	leftAction: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
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
	deleteWrapper: {
		width: Device.widthPercentageToDP('25%'),
		marginLeft: 'auto'
	},
	noNotifications: {
		textAlign: 'center',
		fontSize: H3,
		marginLeft: Device.widthPercentageToDP('5%'),
		marginRight: Device.widthPercentageToDP('5%'),
		marginTop: Device.heightPercentageToDP('35%')

	},
	title: {
		fontSize: H4,
		marginBottom: Device.heightPercentageToDP('1%')
	},
	status: {
		position: 'absolute',
		top: 0,
		left: Device.widthPercentageToDP('4%')
	},
	text: {
		fontSize: text
	},
	hide: {
		display: 'none',
	},
	date: {
		textAlign: 'right',
		fontSize: text,
		marginRight: Device.widthPercentageToDP('4%')
	},
	chevron: {
		position: 'absolute',
		bottom: 0,
		right: Device.widthPercentageToDP('4%'),
		transform: [{ rotate: '0deg'}]
	},
	open: {
		transform: [{ rotate: '90deg'}]
	},
	delete: {
		textAlign: 'right',
		fontSize: text,
		marginTop: Device.heightPercentageToDP('1%'),
		marginRight: Device.widthPercentageToDP('4%'),
		marginBottom: Device.heightPercentageToDP('0.5%'),
		color: Colors.warning
	},
	marginLastChild: {
		borderBottomColor: Colors.grey
	}
});
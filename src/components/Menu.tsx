import React, { Component } from 'react';
import { View, Text, StyleSheet,
		 TouchableOpacity } from 'react-native';
import { observer }   from 'mobx-react';
import { DrawerActions } from 'react-navigation-drawer';
import SafeAreaView from 'react-native-safe-area-view';
import { NavigationActions } from 'react-navigation';
import { StackActions } from 'react-navigation';
import Swipeable from 'react-native-gesture-handler/Swipeable';

// Localization
import { strings }    from '../../i18n/i18n';

// Components
import Icon from 'react-native-vector-icons/FontAwesome5';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

// Interfaces
import { INavProps } from '../interfaces/INavigation';

// Enums
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Data of backend
import { AuthApi } from '../backend/Auth';
import { UserApi }    from '../backend/User';

// Utils
import Colors from '../services/Colors'; 

// Sizes device
import { H3, H4 } from '../utils/sizes/fontSize';
import Device from '../utils/sizes/sizeDevice';

@observer
export default class Menu extends Component<INavProps> {
	get fetchUserProfileDone() {
		return UserApi.fetchingStatusUser === EFetchingStatus.done;
	}

	state = { fromLeft: true, type: 0 };

	renderProfile() {
		const position = UserApi.position._embedded.positions[0].name;
		
		return (<View style={styles.profileText}>
					<Text style={styles.name}>{UserApi.userProfile.firstName} {UserApi.userProfile.lastName}</Text>
					<Text style={styles.description}>{position}</Text>
					<Text style={styles.description}>{UserApi.orgUnit.name}</Text>
				</View>)
	}

	goToSection(section: string) {
		this.props.navigation.dispatch(NavigationActions.navigate({ routeName: section }));
		this.props.navigation.dispatch(DrawerActions.closeDrawer());
	}

	renderDrawer = () => {
		return (<Text>I am in the drawer!</Text>);
	  };

	render() {
		return(
			<View style={{flex: 1}}>
				<DrawerLayout
					drawerWidth={200}
					drawerType='front'
					drawerBackgroundColor="#ddd"
					keyboardDismissMode="on-drag"
					drawerPosition={
						this.state.fromLeft
						? 'left'
						: 'right'
					}
					renderNavigationView={this.renderDrawer}>
					<View style={styles.container}>
						<View style={styles.menu}>
							<View style={styles.info}>
								<View style={styles.profile}>
									<View style={[styles.avatar]}>
										<Icon name="user" size={Device.heightPercentageToDP('8%')} color={Colors.black}></Icon>
									</View>
									{this.fetchUserProfileDone ? this.renderProfile() : null}
								</View>
							</View>
							<View style={styles.links}>
								<View>
									<TouchableOpacity onPress={() => this.goToSection('Calendar')}>
										<Text style={styles.link}>{strings('central.calendar')}</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.goToSection('Notification')}>
										<Text style={styles.link}>{strings('central.notific')}</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.goToSection('Legend')}>
										<Text style={styles.link}>{strings('central.legend')}</Text>
									</TouchableOpacity>
								</View>
								<TouchableOpacity onPress={() => AuthApi.logOut()}>
									<Text style={[styles.buttonLogOut]}>{strings('entry.logOut')}</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.footer}>
								<Text style={styles.version}>App v1.0</Text>
							</View>
						</View>
					</View>
				</DrawerLayout>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: Device.heightPercentageToDP('100%'),
		width: Device.widthPercentageToDP('100%'),
		display: 'flex',
		flexDirection: 'row',
		position: 'relative'
	},
	overlay: {
		backgroundColor: 'transparent',
	},
	menu: {
		width: Device.widthPercentageToDP('80%'),
		height: Device.heightPercentageToDP('100%'),
		backgroundColor: Colors.white,
	},
	buttonLogOut: {
		marginRight: 16,
		marginLeft: 16,
		marginBottom: 20,
		marginTop: 20,
		textAlign: 'center',
		fontSize: H3,
		color: Colors.white,
		backgroundColor: Colors.blue,
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: 5,
	},
	avatar: {
		height: Device.heightPercentageToDP('15%'),
		width: Device.heightPercentageToDP('15'),
		backgroundColor: Colors.white,
		borderRadius: Device.heightPercentageToDP('50%'),
		display: 'flex',
		alignItems:'center',
		justifyContent: 'center',
		marginLeft: 'auto',
		marginRight: 'auto'
	},
	profile: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: 25
	},
	profileText: {
		marginTop: Device.heightPercentageToDP('2%'),
		flexDirection: 'column'
	},
	name: {
		fontSize: H3,
		paddingBottom: 0,
		color: Colors.white,
		textAlign: 'center'
	},
	description: {
		textAlign: 'center',
		color: Colors.white,
		fontSize: H4,
		paddingTop: Device.heightPercentageToDP('0.5%')
	},
	info:{
		height: Device.heightPercentageToDP('38%'),
		backgroundColor: Colors.general,
	},
	links: {
		height: Device.heightPercentageToDP('52%'),
		paddingTop: 10,
		justifyContent: 'space-between',
	},
	link: {
		fontSize: H3,
		padding: 6,
		paddingLeft: 14,
		margin: 5,
		textAlign: 'left',
	},
	footer: {
		height: Device.heightPercentageToDP('10%'),
		flexDirection: 'row',
		backgroundColor: Colors.white,
		borderTopWidth: 1,
		borderTopColor: Colors.lightGrey
	},
	version: {
		color: 'gray',
		marginLeft: 20,
		paddingTop: 10
	},
});

// return(
// 	<GestureRecognizer config={config}
// 		onSwipeLeft={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}>
// 		<View style={styles.container}>
// 			<View style={styles.menu}>
// 				<View style={styles.info}>
// 					<View style={styles.profile}>
// 						<View style={[styles.avatar]}>
// 							<Icon name="user" size={Device.heightPercentageToDP('8%')} color={Colors.black}></Icon>
// 						</View>
// 						{this.fetchUserProfileDone ? this.renderProfile() : null}
// 					</View>
// 				</View>
// 				<View style={styles.links}>
// 					<View>
// 						<TouchableOpacity onPress={() => this.goToSection('Calendar')}>
// 							<Text style={styles.link}>{strings('central.calendar')}</Text>
// 						</TouchableOpacity>
// 						<TouchableOpacity onPress={() => this.goToSection('Notification')}>
// 							<Text style={styles.link}>{strings('central.notific')}</Text>
// 						</TouchableOpacity>
// 						<TouchableOpacity onPress={() => this.goToSection('Legend')}>
// 							<Text style={styles.link}>{strings('central.legend')}</Text>
// 						</TouchableOpacity>
// 					</View>
// 					<Swipeable renderRightActions={this.detect}>
// 						<Text>Swipable</Text>
// 					</Swipeable>
// 					<TouchableOpacity onPress={() => AuthApi.logOut()}>
// 						<Text style={[styles.buttonLogOut]}>{strings('entry.logOut')}</Text>
// 					</TouchableOpacity>
// 				</View>
// 				<View style={styles.footer}>
// 					<Text style={styles.version}>App v1.0</Text>
// 				</View>
// 			</View>
// 		</View>
// 	</GestureRecognizer>
// )
// }
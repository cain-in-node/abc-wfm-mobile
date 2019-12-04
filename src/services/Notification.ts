import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import axios from 'axios';
import firebase from 'react-native-firebase';
import { SaveStore, LoadStore } from '../../asyncStorage/methods';
import { ENKS } from '../enums/EStorage';
import Colors from './Colors';

export const configNofic = () => {
    PushNotification.configure({
        onNotification: function(notification) {notification.finish(PushNotificationIOS.FetchResult.NoData)},
        senderID: "YOUR GCM (OR FCM) SENDER ID",
        permissions: {alert: true,badge: true,sound: true},
        popInitialNotification: true,
        requestPermissions: true
    });
}

const createLocalNotification = (title: string, body: string, data: any) => {
	return PushNotification.localNotification({
		autoCancel: true,
		largeIcon: "ic_time",
		smallIcon: "ic_time",
		bigText: data.param1,
		subText: data.param2,
		color: Colors.green,
		vibrate: true,
		vibration: 300,
		title: title,
		message: data.param3,
		playSound: true,
		soundName: 'default',
		actions: '["Accept", "Reject"]',
	  })	
}
  
const createScheduleNotification = (title: string) => {
	return PushNotification.localNotificationSchedule({
	  message: title,
	  date: new Date(Date.now() + 5000)
	});
  }

export class FireBase {
	static notificationListener: any;
	static notificationOpenedListener: any;
	static messageListener: any;
	static headers: any;
	static userId: number;

	static async authorizationFirebase() {
		firebase.auth().signInAnonymously().then(credential => {
			// if (credential) {
			// 	console.log('default app user ->', credential.user.toJSON());
			// }
		});
	}

	static async checkPermission(headers: any): Promise<void> {
		this.headers = headers;
		const enabled = await firebase.messaging().hasPermission();
		enabled ? this.getToken() : this.requestPermission();
	}

	static async getToken(): Promise<void> {
		let fcmToken = await LoadStore({key: ENKS.fcmToken}).catch(() => console.log('fcmToken not found'));
		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
			if (fcmToken) {
				this.postTokenByFirebase(fcmToken);
				await SaveStore(ENKS.fcmToken, fcmToken);
			}
			return;
		}
		if (fcmToken) await this.postTokenByFirebase(fcmToken);
	}

	static async requestPermission(): Promise<void> {
		try {
			await firebase.messaging().requestPermission();
			this.getToken();
		} catch (error) {console.log('permission rejected')}
	}

	static async getUserId(fcmToken: string) {
        LoadStore({key: ENKS.userLinks}).then((response) => {
            return axios.create({baseURL: response.links.user.href}).get('').then(response => {
				this.userId = response.data.id;
				this.postTokenByFirebase(fcmToken);
			}).catch((err) => {console.log(err)});
		})
    }

	static async postTokenByFirebase(fcmToken: string) {
		!this.userId ? this.getUserId(fcmToken) : 
		LoadStore({key: ENKS.adressServer}).then(response => {
			return axios.create({baseURL: `${response.adress}/api/v1/users/${this.userId}/notification-key`, headers: this.headers }).put('', { androidKey: fcmToken });
		}).catch((err) => {console.log(err)});
	}

	static async createNotificationListeners() {
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			const { title, body, data } = notification;
			createLocalNotification(title, body, data);
		});

		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			const { title, body, data } = notificationOpen.notification;
			createLocalNotification(title, body, data);
		});

		this.notificationOpenedListener = firebase.notifications().onNotificationDisplayed((notification) => {
			const { title, body, data } = notification;
			createLocalNotification(title, body, data);
		});

		const notificationOpen = await firebase.notifications().getInitialNotification();

		if (notificationOpen) {
			const { title, body, data } = notificationOpen.notification;
			createLocalNotification(title, body, data);
		}

		this.messageListener = firebase.messaging().onMessage((message) => {
		  	console.log(JSON.stringify(message));
		});
	}
}
import React from 'react';
import { DrawerContainer, AuthContainer } from './src/routes/navigation';
import { observer } from 'mobx-react';

// Component
import Orientation from 'react-native-orientation-locker';

// Data in backend
import { AuthApi } from './src/backend/Auth';

// Services
import { FireBase } from './src/services/Notification';

@observer
export default class App extends React.Component {
	onOrientationDidChange = (orientation: any) => {
		orientation == 'PORTRAIT' ? Orientation.lockToPortrait() : null;
	};

	async componentDidMount() {
		AuthApi.getAdress();
		AuthApi.autoLogin();
		FireBase.createNotificationListeners();
		Orientation.lockToPortrait();
		Orientation.addOrientationListener(this.onOrientationDidChange);
	}

	componentWillUnmount() {
		FireBase.notificationListener();
		FireBase.notificationOpenedListener();
		FireBase.messageListener();
		Orientation.unlockAllOrientations();
		Orientation.removeOrientationListener(this.onOrientationDidChange);
	}

	render() {
		return AuthApi.auth ? <DrawerContainer /> : <AuthContainer />;
	}
}

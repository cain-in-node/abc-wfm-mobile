import React from 'react';
import { Dimensions, Animated, Easing } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { INavProps } from '../interfaces/INavigation';
import Adress        from '../screens/Adress';
import Notification  from '../screens/Notification';
import Legend          from '../screens/Legend';
import Calendar      from '../screens/Calendar';
import Authorization from '../screens/Authorization';
import Edit 		 from '../screens/Edit';
import Info 		 from '../screens/Info';
import Create 		 from '../screens/Create';
import Menu    		 from '../components/Menu';

const WIDTH = Dimensions.get('window').width;

const AuthNavStack = createStackNavigator(
    {
      Adress: Adress,
      Auth: Authorization,
    },
    {
      initialRouteName: 'Auth',
    }
);

const NavigationStackConfig = {
	initialRouteName: 'Calendar',
	// headerMode: 'none',
	// transitionConfig : () => ({
	// 	transitionSpec: {
	// 		duration: 0,
	// 		easing: Easing.step0,
	// 		timing: Animated.timing,
	// 	},
	// }),
}

const Details = createStackNavigator({
	Calendar: Calendar,
	Edit: Edit,
	Info: Info,
	Create: Create
}, NavigationStackConfig);

const DrawerConfig = {
	drawerWidth: WIDTH*0.8,
	overlayColor: 'rgba( 0, 0, 0, 0.5)',
	contentComponent: ({ navigation }: INavProps) => {
		return(<Menu navigation={navigation} />)
	}
}

const DrawerNavigator = createDrawerNavigator({Calendar: Details, Notification: Notification}, DrawerConfig);
	
const AuthContainer = createAppContainer(AuthNavStack);
const DrawerContainer = createAppContainer(DrawerNavigator);

export { AuthContainer, DrawerContainer };

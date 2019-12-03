import { NavigationParams,
		 NavigationScreenProp,
		 NavigationState } from 'react-navigation';

// Пропсы для навигации
export interface INavProps {
	navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
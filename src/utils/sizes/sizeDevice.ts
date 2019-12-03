import { Dimensions, PixelRatio } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const widthPercentageToDP = (widthPercent: string) => {
	const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  
	return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
  };
  
const heightPercentageToDP = (heightPercent: string) => {
	const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);

	return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

const setOrientation = () => {
    screenWidth = Dimensions.get('window').width;
	screenHeight = Dimensions.get('window').height;
}

const listenOrientationChange = (that: any) => {
  	Dimensions.addEventListener('change', newDimensions => {
		screenWidth = newDimensions.window.width;
		screenHeight = newDimensions.window.height;

		that.setState({
			orientation: screenWidth < screenHeight ? 'portrait' : 'landscape'
		});
  	});
};

const removeOrientationListener = () => {
  	Dimensions.removeEventListener('change', () => {});
};

export default {
	listenOrientationChange,
	removeOrientationListener,
	screenWidth, screenHeight,
	widthPercentageToDP,
	heightPercentageToDP,
	setOrientation
};
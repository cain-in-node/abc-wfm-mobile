import { Dimensions, PixelRatio } from 'react-native';

const coofScale = PixelRatio.get() > 2 ? 0 : 1;

export const H1 = Dimensions.get('window').height * (4/100);
export const H2 = Dimensions.get('window').height * (3.5/100);
export const H3 = Dimensions.get('window').height * (3/100);
export const H4 = Dimensions.get('window').height * (2.5/100);
export const H5 = Dimensions.get('window').height * (2/100);

export const text = Dimensions.get('window').height * (2/100);
export const text2 = Dimensions.get('window').height * (1.5/100);

export const icon1 = Dimensions.get('window').height * ((4.5)/100);
export const icon2 = Dimensions.get('window').height * ((3.5)/100);
export const icon3 = Dimensions.get('window').height * ((2.5)/100);

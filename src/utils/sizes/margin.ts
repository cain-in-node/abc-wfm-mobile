import { Dimensions } from 'react-native';

export const marginSide = Dimensions.get('window').width * (4/100);
export const marginTopBot = Dimensions.get('window').height * (2.5/100);

export const MarSidByCont = {
    marginLeft: marginSide,
    marginRight: marginSide
}

export const MarTopBotByCont = {
    marginTop: marginTopBot,
    marginBottom: marginTopBot
}

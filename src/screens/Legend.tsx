import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

// Localization
import { strings } 		 from '../../i18n/i18n';

// Components
import Header    	  	 from '../components/Header';
import IconF5 from 'react-native-vector-icons/FontAwesome5';

// Interfaces
import { INavProps }  	 from '../interfaces/INavigation';

// Utils
import Colors from '../services/Colors';

// Sizes device
import { icon3 } from '../utils/sizes/fontSize';
import Device from '../utils/sizes/sizeDevice';

export default class Legend extends Component<INavProps> {
  static navigationOptions = {header: null};

  render() {
    return (
      <View>
        <Header handler={() => {}} custom={false} title={strings('central.legend')} navigation={this.props.navigation} />
        <View style={styles.row}>
          <IconF5 name="umbrella-beach" size={icon3} color={Colors.schedule}></IconF5>
          <Text style={styles.hr}>-</Text>
          <Text>{ strings('legend.events.relax') }</Text>
        </View>
        <View style={styles.row}>
          <IconF5 name="briefcase-medical" size={icon3} color={Colors.schedule}></IconF5>
          <Text style={styles.hr}>-</Text>
          <Text>{ strings('legend.events.relax') }</Text>
        </View>
        <View style={styles.row}>
          <IconF5 name="user-clock" size={icon3} color={Colors.schedule}></IconF5>
          <Text style={styles.hr}>-</Text>
          <Text>{ strings('legend.events.relax') }</Text>
        </View>
        <View style={styles.row}>
          <IconF5 name="coffee" size={icon3} color={Colors.schedule}></IconF5>
          <Text style={styles.hr}>-</Text>
          <Text>{ strings('legend.events.relax') }</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: Device.heightPercentageToDP('2.5%'),
    paddingLeft: Device.heightPercentageToDP('4%')
  },
  hr: {
    margin: Device.heightPercentageToDP('1%')
  }
});

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Components
import Icon from 'react-native-vector-icons/FontAwesome5';

// Utils
import Colors from '../services/Colors'; 

// Interfaces
import { INavProps } from '../interfaces/INavigation';
import { IHeader } from '../interfaces/IHeader';

// Sizes device
import { H3, icon1 } from '../utils/sizes/fontSize';
import Device from '../utils/sizes/sizeDevice';

const DS_heightHeader = Device.heightPercentageToDP('8%');

export default class Header extends Component<INavProps & IHeader> {
  render() {
    const { custom } = this.props;

    return (
      <View style={styles.container}>
        {!custom ? <TouchableOpacity style={[styles.button]} onPress={() => this.props.navigation.toggleDrawer()}>
          <Icon name="bars" size={icon1} color={Colors.white}></Icon>
			  </TouchableOpacity> : null}
        {custom ? <TouchableOpacity style={[styles.button]} onPress={() => this.props.handler()}>
          <Icon style={{ paddingRight: 10 }} name="chevron-left" size={icon1} color={Colors.white}></Icon>
			  </TouchableOpacity> : null}
        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		height: DS_heightHeader, paddingRight: 15, paddingLeft: 5, backgroundColor: Colors.general, flexDirection: "row", alignItems: 'center'
  },
  button: {
    width: DS_heightHeader, height: DS_heightHeader, display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  title: {
    fontSize: H3, color: Colors.white
  }
});
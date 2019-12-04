import React, { Component, Fragment } from 'react';
import { View, Text, TextInput, Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';

// Interfaces
import { INavProps } from '../interfaces/INavigation';

// Enums
import { ENKS } from '../enums/EStorage';
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Data of backend
import { AuthApi } from '../backend/Auth';

// Local store
import { SaveStore } from '../../asyncStorage/methods';

// Utils
import Colors from '../services/Colors';
import { strings } from '../../i18n/i18n';

// Sizes device
import Device from '../utils/sizes/sizeDevice';

@observer
export default class Adress extends Component<INavProps> {
  static navigationOptions = {header: null};
  private adressInput: any = TextInput;

  componentDidMount() {
    this.setState({
      adress: AuthApi.adress
    });
  }

  confirmAdressServer = () => {
    SaveStore(ENKS.adressServer,{adress: this.state.adress.trim()});
    AuthApi.getAdress();
    Keyboard.dismiss();
    this.setState({refresh: true, editable: false});
    setTimeout(() => {
      this.setState({refresh: false});
    }, 500);
  }

  editAdressServer = () => {
    this.setState({editable: true});
    setTimeout(() => {
      this.adressInput.focus();
    });
    AuthApi.setError(null);
    AuthApi.setFetchingStatus(EFetchingStatus.done);
  }

  adressCentralServer() {
    if(this.state.adress === '') {
      return <Text style={[styles.adress]}>{strings('server.emptyAdress')}</Text>;
    } else {
      return <Text style={[styles.adress]}>{this.state.adress}</Text>
    }
  }

  goBack() {
    this.props.navigation.navigate('Auth');  
  }

  state = {
    adress: '',
    editable: false,
    refresh: false,
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Text style={[styles.title]}>{strings('server.adress')}</Text>
        {this.state.editable ? null : this.adressCentralServer()}
        {this.state.editable ?
          <Fragment>
            <TextInput onChangeText={(char) => this.setState({adress: char})}
                       value={this.state.adress}
                       ref={input => this.adressInput = input as any}
                       style={[styles.input]} />
            <TouchableOpacity onPress={() => this.confirmAdressServer()}> 
              <Text style={[styles.buttonSafe]}>
                {strings('server.save')}
              </Text>
            </TouchableOpacity>
          </Fragment> :
          <Fragment>
            <TouchableOpacity onPress={() => this.editAdressServer()}> 
              <Text style={[styles.buttonSafe]}>
                {strings('server.edit')}
              </Text>
            </TouchableOpacity>
          </Fragment>}
          <TouchableOpacity onPress={() => this.goBack()}> 
            <Text style={[styles.buttonSafe]}>
              {strings('entry.goBack')}
            </Text>
          </TouchableOpacity>
        {this.state.refresh ? <Text style={[styles.notification]}>{strings('server.updated')}</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: Device.heightPercentageToDP('20%'),
    marginBottom: 40,
  },
  notification: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    color: Colors.grey
  },
  adress: {
    textAlign: 'center',
    fontSize: 20,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 43,
  },
	input: {
		height: 40,
		backgroundColor: Colors.white,
		marginLeft: Device.widthPercentageToDP('10%'),
		marginRight: Device.widthPercentageToDP('10%'),
		borderRadius: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderColor: '#909090',
    borderWidth: 2,
    marginBottom: 30,
	},
	buttonSafe: {
		marginRight: Device.widthPercentageToDP('15%'),
		marginLeft: Device.widthPercentageToDP('15%'),
		marginBottom: 20,
		textAlign: 'center',
		fontSize: 20,
		color: Colors.white,
		backgroundColor: Colors.blue,
		paddingTop: 5,
		paddingBottom: 5,
		borderRadius: 5,
	}
}); 
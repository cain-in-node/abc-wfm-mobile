import React, { Component, Fragment } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { observer } from 'mobx-react';

// Interfaces
import { INavProps } from '../interfaces/INavigation';

// Sources
import { logo } from '../sources/logo';

// Enums
import { EFetchingStatus } from '../enums/EFetchingStatus';

// Data of backend
import { AuthApi } from '../backend/Auth';

// Utils
import Colors from '../services/Colors';
import { strings } from '../../i18n/i18n';

// Sizes device
import Device from '../utils/sizes/sizeDevice';

@observer
export default class Authorization extends Component<INavProps | any> {
  static navigationOptions = {header: null};

  state = {
    login: '',
    password: '',
	status: false,
	error: false
  }

  login() {
    AuthApi.login(
      this.state.login, this.state.password).then(
        this.props.navigation.navigate('Calendar'));
  }

  goSettings() {
    this.props.navigation.navigate('Adress');
  }

  renderError() {
	  return <Text style={{color: Colors.warning, textAlign: 'center'}}>
	  			{!AuthApi.error ? strings('error.notConnect') : strings('error.notCorrectAdress')}
			</Text>;
  }

  editLoginInput(char: string) {
	this.setState({login: char});
    AuthApi.setError(null);
    AuthApi.setFetchingStatus(EFetchingStatus.done);
  }

  editPasswordInput(char: string) {
	this.setState({password: char});
	AuthApi.setError(null);
    AuthApi.setFetchingStatus(EFetchingStatus.done);
  }

  renderForm() {
	const authError = AuthApi.fetchingStatus === EFetchingStatus.error;
	const error     = !AuthApi.error ? false : true;

	return (
      <View style={[styles.container]}>
		<Image style={[styles.logo]} source={{uri: `data:image/gif;base64,${logo}`}} />
        <Text style={[styles.greeting]}>{strings('entry.welcome')}</Text>
        <TextInput onChangeText={(char) => this.editLoginInput(char)}
                   placeholder={strings('entry.login')}
				   value={this.state.login}
				   style={[styles.input, styles.login, error ? styles.error : null]} />
        <TextInput onChangeText={(char) => this.editPasswordInput(char)}
                   placeholder={strings('entry.password')}
                   secureTextEntry={true}
				   value={this.state.password}
				   style={[styles.input, styles.password, error ? styles.error : null]} />
		<TouchableOpacity onPress={() => this.login()}> 
			<Text style={[styles.buttonEntry]}>
				{strings('entry.singIn')}
			</Text>
		</TouchableOpacity>
		<TouchableOpacity onPress={() => this.goSettings()}> 
			<Text style={[styles.buttonSettings]}>
				{strings('entry.settings')}
			</Text>
		</TouchableOpacity>
		{authError ? this.renderError() : null}
      </View>
    );
  }

  renderLoading() {
    return (
      <View style={[styles.container]}>
        <Image style={[styles.logo]} source={{uri: `data:image/gif;base64,${logo}`}} />
        <Text style={[styles.authorization]}>{strings('entry.auth')}</Text>
        <View style={[styles.horizontal]}>
          <ActivityIndicator size="large" color={Colors.grey} style={styles.activityIndicator} />
        </View>
      </View>
    );
  }

  render() {
    const authProgress = AuthApi.fetchingStatus === EFetchingStatus.inProg;
    const authDone = AuthApi.fetchingStatus === EFetchingStatus.done;
	const authNone = AuthApi.fetchingStatus === EFetchingStatus.none;
	const authError = AuthApi.fetchingStatus === EFetchingStatus.error;

    return (
      <Fragment>
        {authProgress ? this.renderLoading() : null}
		{authDone || authNone || authError ? this.renderForm() : null}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: Colors.white,
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	},
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		marginBottom: 80,
	},
	logo: {
		resizeMode: "contain",
		width: Device.widthPercentageToDP('100%'),
		height: Device.heightPercentageToDP('20%'),
	},
	logoAuth: {
		marginBottom: 10
	},
	authorization: {
		textAlign: 'center',
		fontSize: 28,
		color: Colors.grey,
		marginBottom: 40,
	},
	greeting: {
		textAlign: 'center',
		fontSize: 28,
		color: Colors.grey,
		marginTop: 20,
		marginBottom: 40
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
	},
	error: {
		borderColor: Colors.warning
	},
	notError: {
		borderColor: Colors.black
	},
	login: {
		marginBottom: 20,
	},
	password: {
		marginBottom: 40,
	},
	buttonEntry: {
		marginRight: Device.widthPercentageToDP('20%'),
		marginLeft: Device.widthPercentageToDP('20%'),
		marginBottom: 10,
		textAlign: 'center',
		fontSize: 24,
		color: Colors.white,
		backgroundColor: Colors.blue,
		paddingTop: 5,
		paddingBottom: 5,
		borderRadius: 5,
	},
	buttonSettings: {
		textAlign: 'center',
		fontSize: 16,
		color: Colors.grey,
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: 5,
		marginBottom: 50,
	}
}); 
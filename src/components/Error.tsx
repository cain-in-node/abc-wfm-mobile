import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Localization
import { strings } from '../../i18n/i18n';

// Interfaces
import IErrorsProps from '../interfaces/IErrorProps'

// Utils
import Colors from '../services/Colors';

export default class Error extends Component<IErrorsProps> {
    render() {
        const { errorConnect, error } = this.props;

		return(
			<View>
				<Text style={[styles.error, !errorConnect ? styles.hide : null]}>{strings('error.tryAgainLater')}</Text>
				<Text style={[styles.error, !error ? styles.hide : null]}>{strings('error.notCorrectData')}</Text>
			</View>
		)
    }
}

const styles = StyleSheet.create({
    hide: {
		display: 'none'
	},
	error: {
		color: Colors.warning,
		fontSize: 16,
		textAlign: 'center',
		marginTop: 30,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 0,
	},
});

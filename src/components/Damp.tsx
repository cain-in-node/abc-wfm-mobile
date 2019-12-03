import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Localization
import { strings } from '../../i18n/i18n';

// Utils
import Colors from '../services/Colors'; 

export default class Damp extends Component {
    render() {
        return (
        <View style={[styles.container]}>
            <Text style={styles.text}>{strings('helpers.damp')}</Text>
        </View>
        );
    }
}

const styles = StyleSheet.create({
	container: {
        backgroundColor: Colors.general,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    text: {
        fontSize: 26,
        color: Colors.white,
        padding: 0,
        margin: 20,
        marginTop: 0
    }
});

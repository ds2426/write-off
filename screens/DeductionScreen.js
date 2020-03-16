import React, { useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function DeductionScreen()  {
    const [accessToken, setAccessToken] = useState();
    return (
        <View style = { styles.container }>
            <Text> You are on deduction screen</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
});

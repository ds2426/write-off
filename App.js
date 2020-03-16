import React, { useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Auth0 from 'react-native-auth0';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import CameraContainer from './screens/CameraContainer';
import HomeScreen from './screens/HomeScreen';
import DeductionScreen from './screens/DeductionScreen';


const credentials = require('./auth0-configuration');
const auth0 = new Auth0(credentials);

export default function App()  {
    const [accessToken, setAccessToken] = useState();
    const Tab = createMaterialBottomTabNavigator();
    const onLogin = () => {
        auth0.webAuth
            .authorize({
                scope: 'openid profile email'
            })
            .then(credentials => {
                setAccessToken(credentials.accessToken);
                auth0.auth
                    .userInfo({token: credentials.accessToken})
                    .then((user) => console.log(user))
                    .catch((error) => console.error(error));
            })
            .catch(error => console.log(error));
    };

    const onLogout = () => {
        auth0.webAuth
            .clearSession({})
            .then(success => {
                Alert.alert('Logged out!');
                setAccessToken(null)
            })
            .catch(error => {
                console.log('Log out cancelled');
            });
    };

    return (
        <>
            { !accessToken && <View>
                <Text> You are{ accessToken ? ' ' : ' not ' }logged in . </Text>
            <Button onPress = { accessToken ? onLogout : onLogin } title = { accessToken ? 'Log Out' : 'Log In' }/>
            </View >
}
            {
                accessToken && 
                <>
                <NavigationContainer>
                    <Tab.Navigator
                        initialRouteName="Camera"
                        activeColor="#fff"
                        inactiveColor="#555"
                        barStyle={{ backgroundColor: 'tomato' }}
                    >
                        <Tab.Screen
                            name="Camera"
                            component={CameraContainer}
                            options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="home" color={color} size={size} />
                            ),
                            }}
                        />
                        <Tab.Screen name="Deductions" component={DeductionScreen} 
                            options={{
                            tabBarLabel: 'Deductions',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="archive" color={color} size={size} />
                            ),
                            }} />
                            
                        </Tab.Navigator>
                    </NavigationContainer>
                </>
            }
        
        </>
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


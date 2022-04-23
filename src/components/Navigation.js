import React, {useContext} from 'react';
import {Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {AuthContext} from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import GameScreen from '../screens/GameScreen';
import LobbyScreen from '../screens/LobbyScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {userInfo, splashLoading} = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
        ) : userInfo.token ? (
          <>
            <Stack.Screen
            name="Home" 
            component={HomeScreen} 
            options={{headerShown: false}}
            />
            <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen
            name="Lobby"
            component={LobbyScreen}
            options={{headerShown: false}}
            />
			<Stack.Screen
            name="Replay"
            component={ReplayScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen
            name="Library" 
            component={LibraryScreen} 
            options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
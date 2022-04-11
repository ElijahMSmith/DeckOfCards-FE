import React, {useContext} from 'react';
import {Button, StyleSheet, Text, View, TouchableOpacity, Pressable} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const HomeScreen = () => {
  const {userInfo, isLoading, logout} = useContext(AuthContext);

  return (
    <View style={styles.container}>

      <Text style={styles.welcome}>Welcome, {userInfo.user.username}</Text>

      <Pressable style={styles.button}>
        <Text style= {styles.buttonText}>Create Game</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style= {styles.buttonText}>Join Game</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style= {styles.buttonText}>View Replays</Text>
      </Pressable>

      <Pressable style={styles.logoutbutton} onPress={logout}>
      <Text style= {styles.logoutbuttonText}>Log Out</Text>
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#35654d',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'white',
    width: '50%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    padding: 15
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16
  },
  logoutbutton: {
    backgroundColor: 'red',
    width: '50%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    padding: 15
  },
  logoutbuttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },

});

export default HomeScreen;
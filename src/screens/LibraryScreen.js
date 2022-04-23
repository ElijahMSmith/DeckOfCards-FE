import React, {useContext, useState, useEffect} from 'react';
import {Button, StyleSheet, Text, View, TouchableOpacity, Pressable, TextInput} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import io from 'socket.io-client';

const LibraryScreen = ({navigation}) => {
  const {userInfo} = useContext(AuthContext);

  const openReplay1 = () => {
    navigation.navigate("Replay", {num: 0})
  }

  const openReplay2 = () => {
    navigation.navigate("Replay", {num: 1})
  }

  const openReplay3 = () => {
    navigation.navigate("Replay", {num: 2})
  }

  const openReplay4 = () => {
    navigation.navigate("Replay", {num: 3})
  }

  const openReplay5 = () => {
    navigation.navigate("Replay", {num: 4})
  }

  const exitReplay = () => {
    navigation.navigate("Home");
  }

  let replay1 = false;
  let replay2 = false;
  let replay3 = false;
  let replay4 = false;
  let replay5 = false;

  if (userInfo.user.replays[0] != null) {
    replay1 = true
  }
  if (userInfo.user.replays[1] != null) {
    replay2 = true
  }
  if (userInfo.user.replays[2] != null) {
    replay3 = true
  }
  if (userInfo.user.replays[3] != null) {
    replay4 = true
  }
  if (userInfo.user.replays[4] != null) {
    replay5 = true
  }
  
  return (
    <View style={styles.container}>
      {replay1 && replay2 && replay3 && replay4 && replay5 ? (
        <>
        <Pressable style={styles.button} onPress={openReplay1}>
          <Text style= {styles.buttonText}>Replay 1</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay2}>
          <Text style= {styles.buttonText}>Replay 2</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay3}>
          <Text style= {styles.buttonText}>Replay 3</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay4}>
          <Text style= {styles.buttonText}>Replay 4</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay5}>
          <Text style= {styles.buttonText}>Replay 5</Text>
        </Pressable>
        </>
        
      ) : replay1 && replay2 && replay3 && replay4 ? (
        <>
        <Pressable style={styles.button} onPress={openReplay1}>
          <Text style= {styles.buttonText}>Replay 1</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay2}>
          <Text style= {styles.buttonText}>Replay 2</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay3}>
          <Text style= {styles.buttonText}>Replay 3</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay4}>
          <Text style= {styles.buttonText}>Replay 4</Text>
        </Pressable>
        </>
      ) : replay1 && replay2 && replay3 ? (
        <>
        <Pressable style={styles.button} onPress={openReplay1}>
          <Text style= {styles.buttonText}>Replay 1</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay2}>
          <Text style= {styles.buttonText}>Replay 2</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay3}>
          <Text style= {styles.buttonText}>Replay 3</Text>
        </Pressable>
        </>
        
      ) : replay1 && replay2 ? (
        <>
        <Pressable style={styles.button} onPress={openReplay1}>
          <Text style= {styles.buttonText}>Replay 1</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={openReplay2}>
          <Text style= {styles.buttonText}>Replay 2</Text>
        </Pressable>
        </>
      ) : (
        <Pressable style={styles.button} onPress={openReplay1}>
          <Text style= {styles.buttonText}>Replay 1</Text>
        </Pressable>
      )
      }
    <Pressable style={styles.button} onPress={exitReplay}>
          <Text style= {styles.buttonText}>Exit</Text>
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
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 14,
    backgroundColor: 'white',
  },
});

export default LibraryScreen;
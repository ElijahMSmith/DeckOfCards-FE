import React, {useContext, useState, useEffect} from 'react';
import {Button, StyleSheet, Text, View, TouchableOpacity, Pressable, TextInput} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import {BASE_URL} from '../config';

const ReplayScreen = ({route, navigation}) => {
  const {userInfo} = useContext(AuthContext);
  const [socket, setSocket] = useState({});
  const [replay, setReplay] = useState("");

  const {num} = route.params;
  useEffect(() => {
    axios.get
      (`${BASE_URL}/replay/retrieve`, {
        headers: {'Authorization': 'Bearer ' + `${userInfo.token}`},
        params: {
          replayID: `${userInfo.user.replays[num]}`, 
          playerID: `${userInfo.user._id}`
        }
      })
      .then(res => setReplay(res.data.actionLog))
      .catch(e => console.log(e));
  }, [])

  console.log(replay)

  var actions = [];
  for (var i = 0; i < replay.length; i += 4) {
    actions.push(replay.substring(i, i + 4));
  }
  console.log(actions);

  const exitReplay = () => {
    navigation.navigate("Home");
  }

  return (
    <View style={styles.container}>
      <Text style= {styles.buttonText}>{actions}</Text>
        <Pressable style={styles.button} onPress={exitReplay}>
        <Text style={styles.buttonText}>Exit</Text>
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

export default ReplayScreen;
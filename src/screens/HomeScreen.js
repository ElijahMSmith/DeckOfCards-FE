import React, {useContext, useState, useEffect} from 'react';
import {Button, StyleSheet, Text, View, TouchableOpacity, Pressable, TextInput} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import io from 'socket.io-client';

class Rules {
  constructor () {
      this.excludeDealer = false;
      this.withoutHearts = false;
      this.withoutDiamonds = false;
      this.withoutClubs = false;
      this.withoutSpades = false;
      this.jokersEnabled = false;
      this.autoAbsorbCards = false;
      this.playFacedDown = false;
  }
}

const HomeScreen = ({navigation}) => {
  const {userInfo, isLoading, logout} = useContext(AuthContext);
  const [state, setState] = useState({});
  const [joinCode, setJoinCode] = useState("");
  const [socket, setSocket] = useState({});
  // connect to server
  useEffect(() => {
    setSocket(io.connect('https://mobiledeckofcards.azurewebsites.net', {
      auth : {
        token: userInfo.token,
      },
    }));
  }, []);

  const createGame = () => {
    socket.emit('create', new Rules(), (state) => {
      console.log("From createGame in Home")
      console.log(state);
      navigation.navigate('Game', {state, socket});
    });
  }
  const joinGame = () => {
    if (socket == null)
    {
      console.log("socket is null")
      return "";
    }
    socket.emit('join', joinCode, (state) => {
      if ('error' in state)
      {
        console.log(state.error);
        return state.error;
      }
      console.log("From joinGame in Home")
      console.log(state);
      if (!('currentState' in state))
      {
        console.log("Cannot join game")
        return "Cannot join game";
      }

      state.code = joinCode;

      navigation.navigate('Game', {state, socket});
    });
  }
  
  return (
    <View style={styles.container}>

      <Text style={styles.welcome}>Welcome, {userInfo.user.username}</Text>

      <Pressable style={styles.button} onPress={createGame}>
        <Text style= {styles.buttonText}>Create Game</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={joinGame}>
        <Text style= {styles.buttonText}>Join Game</Text>
      </Pressable>
      <TextInput
        style={styles.input}
        value={joinCode}
        placeholder="Game Code"
        onChangeText={text => setJoinCode(text)}
      />
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
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 14,
    backgroundColor: 'white',
  },
});

export default HomeScreen;
import React, {useContext, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {isLoading, login} = useContext(AuthContext);

  return (
    
    <View style={styles.container}>
      <Image source = {require('../../assets/title.png')}/>
      <Text style = {styles.title}>
            Mobile Deck of Cards
        </Text>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          value={password}
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />

        <Button
          title="Login"
          color="red"
          onPress={() => {
            login(email, password);
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'center'}}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 14,
    backgroundColor: 'white',
  },
  link: {
    color: '#FF0000',
  },
  button: {
    color: '#FF0000',
    backgroundColor: '#FF0000'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20
  },
});

export default LoginScreen;
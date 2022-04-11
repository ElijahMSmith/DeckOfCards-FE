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

const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {isLoading, register} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image source = {require('../../assets/title.png')}/>
      <Text style = {styles.title}>
            Mobile Deck of Cards
        </Text>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={username}
          placeholder="Username"
          onChangeText={text => setUsername(text)}
        />

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
          title="Register"
          color="red"
          onPress={() => {
            register(username, email, password);
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'center'}}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
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
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20
},
});

export default RegisterScreen;
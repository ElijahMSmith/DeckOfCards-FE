import React from 'react'
import {StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image} from 'react-native'
import { useState } from 'react'
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <KeyboardAvoidingView
            style = {styles.container}
            behavior = "padding"
        >
        <View style = {styles.image}>
            <Image
                source = {require('../assets/title.png')}
            />
        </View>
        <Text style = {styles.title}>
            Mobile Deck of Cards
        </Text>
        <View style = {styles.inputContainer}>
            <TextInput
                placeholder="Username"
                style = {styles.input} 
                value = {username}
                onChangeText = {text => setUsername(text)}
            />
            <TextInput
                placeholder="Password"
                style = {styles.input}
                secureTextEntry
                value = {password}
                onChangeText = {text => setPassword(text)} 
            />
        </View> 

        <View style = {styles.buttonContainer}>
            <TouchableOpacity
                onPress = {() => { }}
                style = {styles.button}
            >
            <Text style = {styles.buttonText}>
                Login
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress = {() => { }}
                style = {[styles.button, styles.buttonOutline]}
            >
            <Text style = {[styles.buttonOutlineText]}>
                Register
            </Text>
            </TouchableOpacity>

        </View> 
        </KeyboardAvoidingView>
        
    )
}

export default Login
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#35654d',
        marginBottom: 1
    },
    image: {

    },
    title: {
        fontSize: 24,
        fontWeight: '700'
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#FF0000',
        borderWidth: 2,
    },
    buttonText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText: {
        color: '#FF0000',
        fontWeight: '700',
        fontSize: 16
    },

})
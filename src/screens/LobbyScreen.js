import React, { useContext, useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Switch, Pressable, Button } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';
import io from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LobbyScreen = ({ navigation }) => {
    const {userInfo, isLoading, logout, gameStateC, setGameStateC, socketC, setSocketC} = useContext(AuthContext);
    const [state, setState] = useState({});
    const [joinCode, setJoinCode] = useState("");
    const [socket, setSocket] = useState(socketC);
    const [presetName, setName] = useState('');

    const startGame = () => {
        socket.emit(
            'create',
            {
                excludeDealer: isDealer,
                withoutHearts: isHearts,
                withoutDiamonds: isDiamonds,
                withoutClubs: isClubs,
                withoutSpades: isSpades,
                jokersEnabled: isJokers,
                autoAbsorbCards: isAbsorb,
                playFacedDown: isFaceDown
            },
            (state) => {
                console.log("From startGame in Lobby")
                console.log(state);
                setGameStateC(state);
                navigation.navigate('Game');
        });
    }

    const savePreset = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(presetName, jsonValue)
          console.log("HUZZAH")
        } catch (e) {
            // saving error
            console.log(e)
        }
    };

    const findPreset = async () => {
        try {
            if (presetName == "")
                return
            const jsonValue = await AsyncStorage.getItem(presetName)
            if (jsonValue != null)
            {
                console.log(jsonValue)
                setDealer(jsonValue.excludeDealer)
                setHearts(jsonValue.withoutHearts)
                setDiamonds(jsonValue.withoutDiamonds)
                setClubs(jsonValue.withoutClubs)
                setSpades(jsonValue.withoutSpades)
                setJokers(jsonValue.jokersEnabled)
                setAbsorb(jsonValue.autoAbsorbCards)
                setFaceDown(jsonValue.playFacedDown)
            }
        } catch(e) {
            // error reading value
            console.log(e)
        }
    };

    

    const [isDealer, setDealer] = useState(false);
    const toggleDealer = () => setDealer(previousState => !previousState);
    console.log(isDealer)
    
    const [isAbsorb, setAbsorb] = useState(false);
    const toggleAbsorb = () => setAbsorb(previousState => !previousState);
    console.log(isAbsorb)

    const [isFaceDown, setFaceDown] = useState(false);
    const toggleFaceDown = () => setFaceDown(previousState => !previousState);
    console.log(isFaceDown)

    const [isJokers, setJokers] = useState(false);
    const toggleJokers = () => setJokers(previousState => !previousState);
    console.log(isJokers)

    const [isHearts, setHearts] = useState(false);
    const toggleHearts = () => setHearts(previousState => !previousState);
    console.log(isHearts)

    const [isDiamonds, setDiamonds] = useState(false);
    const toggleDiamonds = () => setDiamonds(previousState => !previousState);
    console.log(isDiamonds)

    const [isSpades, setSpades] = useState(false);
    const toggleSpades = () => setSpades(previousState => !previousState);
    console.log(isSpades)

    const [isClubs, setClubs] = useState(false);
    const toggleClubs = () => setClubs(previousState => !previousState);
    console.log(isClubs)

    return (
        <View style={styles.container}>

            <Text style={styles.welcome}>Creating a new Game (You'll be the host!)</Text>
            <Text style={styles.question}>Will dealer not deal to themselves?</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDealer ? "red" : "black"}
                onValueChange={toggleDealer}
                value={isDealer}
            />
            <Text style={styles.question}>Will drawn cards get absorbed back in the deck?</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isAbsorb ? "red" : "black"}
                onValueChange={toggleAbsorb}
                value={isAbsorb}
            />
            <Text style={styles.question}>Should the cards be face down?</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isFaceDown ? "red" : "black"}
                onValueChange={toggleFaceDown}
                value={isFaceDown}
            />
            <Text style={styles.question}>Does the deck include jokers?</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isJokers ? "red" : "black"}
                onValueChange={toggleJokers}
                value={isJokers}
            />
            <Text style={styles.question}>Would you like to exclude the Heart suit?</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isHearts ? "red" : "black"}
                onValueChange={toggleHearts}
                value={isHearts}
            />
            <Text style={styles.question}>Would you like to exclude the Diamond suit?</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDiamonds ? "red" : "black"}
                onValueChange={toggleDiamonds}
                value={isDiamonds}
            />
            <Text style={styles.question}>Would you like to exclude the Spades suit?</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isSpades ? "red" : "black"}
                onValueChange={toggleSpades}
                value={isSpades}
            />
            <Text style={styles.question}>Would you like to exclude the Clubs suit?</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isClubs ? "red" : "black"}
                onValueChange={toggleClubs}
                value={isClubs}
            />

            <TextInput
                style={styles.input}
                value={presetName}
                placeholder="Rule Preset Name"
                onChangeText={text => setName(text)}
            />

            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                <Pressable style={styles.smallButton} onPress={() => savePreset({
                    excludeDealer: isDealer,
                    withoutHearts: isHearts,
                    withoutDiamonds: isDiamonds,
                    withoutClubs: isClubs,
                    withoutSpades: isSpades,
                    jokersEnabled: isJokers,
                    autoAbsorbCards: isAbsorb,
                    playFacedDown: isFaceDown
                })}>
                    <Text style= {styles.smallButtonText}>Save Preset</Text>
                </Pressable>
                <Pressable style={styles.smallButton} onPress={findPreset}>
                    <Text style= {styles.smallButtonText}>Get Preset</Text>
                </Pressable>
            </View>

            <Pressable style={styles.button} onPress={startGame}>
               <Text style= {styles.buttonText}>Start the Game!</Text>
            </Pressable>

            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                <Text>Return to </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.link}>Home?</Text>
                </TouchableOpacity>
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
    welcome: {
        fontSize: 18,
        marginBottom: 15,
        color: 'white',
    },
    question: {
        fontSize: 16,
        marginBottom: 4,
        color: 'white',
    },
    button: {
        backgroundColor: 'red',
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
    smallButton: {
        backgroundColor: 'red',
        width: '25%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
        padding: 15
    },
    smallButtonText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 14
    },
    link: {
        color: 'red',
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


export default LobbyScreen;
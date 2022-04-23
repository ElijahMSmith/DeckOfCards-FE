import React, { useContext, useState, useEffect } from "react";
import {
	Text,
	TextInput,
	TouchableOpacity,
	View,
	StyleSheet,
	Switch,
	Pressable,
	Button,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LobbyScreen = ({ navigation }) => {
	const {
		userInfo,
		isLoading,
		logout,
		gameStateC,
		setGameStateC,
		socketC,
		setSocketC,
	} = useContext(AuthContext);
	const [state, setState] = useState({});
	const [joinCode, setJoinCode] = useState("");
	const [socket, setSocket] = useState(socketC);
	const [presetName, setName] = useState("");

	const startGame = () => {
		socket.emit(
			"create",
			{
				excludeDealer: isDealer,
				withoutHearts: isHearts,
				withoutDiamonds: isDiamonds,
				withoutClubs: isClubs,
				withoutSpades: isSpades,
				jokersEnabled: isJokers,
				autoAbsorbCards: isAbsorb,
				playFacedDown: isFaceDown,
			},
			(state) => {
				console.log("From startGame in Lobby");
				console.log(state);
				setGameStateC(state);
				navigation.navigate("Game");
			}
		);
	};

	const savePreset = async (value) => {
		try {
			const jsonValue = JSON.stringify(value);
			await AsyncStorage.setItem(presetName, jsonValue);
			console.log("HUZZAH");
		} catch (e) {
			// saving error
			console.log(e);
		}
	};

	const findPreset = async () => {
		try {
			if (presetName == "") return;
			const jsonValue = await AsyncStorage.getItem(presetName);
			const preset = JSON.parse(jsonValue);
			if (jsonValue != null) {
				setDealer(preset.excludeDealer);
				setHearts(preset.withoutHearts);
				setDiamonds(preset.withoutDiamonds);
				setClubs(preset.withoutClubs);
				setSpades(preset.withoutSpades);
				setJokers(preset.jokersEnabled);
				setAbsorb(preset.autoAbsorbCards);
				setFaceDown(preset.playFacedDown);
			}
		} catch (e) {
			// error reading value
			console.log(e);
		}
	};

	const [isDealer, setDealer] = useState(false);
	const toggleDealer = () => setDealer((previousState) => !previousState);

	const [isAbsorb, setAbsorb] = useState(false);
	const toggleAbsorb = () => setAbsorb((previousState) => !previousState);

	const [isFaceDown, setFaceDown] = useState(false);
	const toggleFaceDown = () => setFaceDown((previousState) => !previousState);

	const [isJokers, setJokers] = useState(false);
	const toggleJokers = () => setJokers((previousState) => !previousState);

	const [isHearts, setHearts] = useState(false);
	const toggleHearts = () => setHearts((previousState) => !previousState);

	const [isDiamonds, setDiamonds] = useState(false);
	const toggleDiamonds = () => setDiamonds((previousState) => !previousState);

	const [isSpades, setSpades] = useState(false);
	const toggleSpades = () => setSpades((previousState) => !previousState);

	const [isClubs, setClubs] = useState(false);
	const toggleClubs = () => setClubs((previousState) => !previousState);

	return (
		<View style={styles.container}>
			<Text style={styles.welcome}>
				Creating a new Game (You'll be the host!)
			</Text>
			<Text style={styles.question}>
				Should the dealer also receive cards when dealing to all
				players?
			</Text>
			<Switch
				trackColor={{ false: "#767577", true: "#81b0ff" }}
				thumbColor={isDealer ? "red" : "black"}
				onValueChange={toggleDealer}
				value={isDealer}
			/>
			<Text style={styles.question}>
				Should hand and table cards be discarded when players leave?
			</Text>

			<Switch
				trackColor={{ false: "#767577", true: "#81b0ff" }}
				thumbColor={isAbsorb ? "red" : "black"}
				onValueChange={toggleAbsorb}
				value={isAbsorb}
			/>
			<Text style={styles.question}>
				Should the cards played to the table be faced-down by default?
			</Text>

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
			<Text style={styles.question}>
				Should the deck exclude the Heart suit?
			</Text>

			<Switch
				trackColor={{ false: "#767577", true: "#81b0ff" }}
				thumbColor={isHearts ? "red" : "black"}
				onValueChange={toggleHearts}
				value={isHearts}
			/>
			<Text style={styles.question}>
				Should the deck exclude the Diamond suit?
			</Text>

			<Switch
				trackColor={{ false: "#767577", true: "#81b0ff" }}
				thumbColor={isDiamonds ? "red" : "black"}
				onValueChange={toggleDiamonds}
				value={isDiamonds}
			/>
			<Text style={styles.question}>
				Should the deck exclude the Spades suit?
			</Text>

			<Switch
				trackColor={{ false: "#767577", true: "#81b0ff" }}
				thumbColor={isSpades ? "red" : "black"}
				onValueChange={toggleSpades}
				value={isSpades}
			/>
			<Text style={styles.question}>
				Should the deck exclude the Clubs suit?
			</Text>

			<Switch
				trackColor={{ false: "#767577", true: "#81b0ff" }}
				thumbColor={isClubs ? "red" : "black"}
				onValueChange={toggleClubs}
				value={isClubs}
			/>

			<Pressable style={styles.button} onPress={startGame}>
				<Text style={styles.buttonText}>Start the Game!</Text>
			</Pressable>

			<TextInput
				style={styles.input}
				value={presetName}
				placeholder="Rule Preset Name"
				onChangeText={(text) => setName(text)}
			/>

			<View
				style={{
					flexDirection: "row",
					marginTop: 20,
					justifyContent: "center",
				}}
			>
				<Pressable
					style={styles.smallButton}
					onPress={() =>
						savePreset({
							excludeDealer: isDealer,
							withoutHearts: isHearts,
							withoutDiamonds: isDiamonds,
							withoutClubs: isClubs,
							withoutSpades: isSpades,
							jokersEnabled: isJokers,
							autoAbsorbCards: isAbsorb,
							playFacedDown: isFaceDown,
						})
					}
				>
					<Text style={styles.smallButtonText}>Save Preset</Text>
				</Pressable>
				<Pressable style={styles.smallButton} onPress={findPreset}>
					<Text style={styles.smallButtonText}>Get Preset</Text>
				</Pressable>
			</View>

			<View
				style={{
					flexDirection: "row",
					marginTop: 20,
					justifyContent: "center",
				}}
			>
				<Text>Return to </Text>
				<TouchableOpacity onPress={() => navigation.navigate("Home")}>
					<Text style={styles.link}>Home?</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#35654d",
	},
	welcome: {
		fontSize: 18,
		marginBottom: 15,
		color: "white",
	},
	question: {
		fontSize: 16,
		marginBottom: 4,
		color: "white",
		textAlign: "center",
		paddingHorizontal: 15,
	},
	button: {
		backgroundColor: "red",
		width: "50%",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 20,
		borderRadius: 10,
		padding: 15,
		marginVertical: 5,
	},
	buttonText: {
		color: "black",
		fontWeight: "700",
		fontSize: 16,
	},
	smallButton: {
		backgroundColor: "red",
		width: "25%",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 20,
		borderRadius: 10,
		padding: 15,
		marginVertical: 5,
	},
	smallButtonText: {
		color: "black",
		fontWeight: "700",
		fontSize: 14,
	},
	link: {
		color: "red",
	},
	input: {
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 5,
		paddingHorizontal: 14,
		backgroundColor: "white",
	},
});

export default LobbyScreen;

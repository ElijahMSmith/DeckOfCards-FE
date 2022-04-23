import React, { useContext, useState, useEffect } from "react";
import {
	Button,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Pressable,
	TextInput,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";

const HomeScreen = ({ navigation }) => {
	const {
		userInfo,
		isLoading,
		logout,
		gameStateC,
		setGameStateC,
		socketC,
		setSocketC,
	} = useContext(AuthContext);
	const [joinCode, setJoinCode] = useState("");

	const PROD = "https://mobiledeckofcards.azurewebsites.net";
	const LOCAL = "http://localhost:8080";
	// connect to server
	useEffect(() => {
		setSocketC(
			io.connect(PROD, {
				auth: {
					token: userInfo.token,
				},
			})
		);
	}, []);

	const createGame = () => {
		navigation.navigate("Lobby");
	};

	const joinGame = () => {
		if (socketC == null) {
			console.log("socket is null");
			return "";
		}
		socketC.emit("join", joinCode, (state) => {
			if ("error" in state) {
				console.log(state.error);
				return state.error;
			}
			console.log("From joinGame in Home");
			console.log(state);
			if (!("currentState" in state)) {
				console.log("Cannot join game");
				return "Cannot join game";
			}

			state.code = joinCode;
			setGameStateC(state);
			navigation.navigate("Game");
		});
	};

	const ReplayLibrary = () => {
		navigation.navigate('Library')
	  }
	return (
		<View style={styles.container}>
			<Text style={styles.welcome}>
				Welcome, {userInfo.user.username}
			</Text>

			<Pressable style={styles.button} onPress={createGame}>
				<Text style={styles.buttonText}>Create Game</Text>
			</Pressable>

			<Pressable style={styles.button} onPress={joinGame}>
				<Text style={styles.buttonText}>Join Game</Text>
			</Pressable>
			<TextInput
				style={styles.input}
				value={joinCode}
				placeholder="Game Code"
				onChangeText={(text) => setJoinCode(text)}
			/>
			<Pressable style={styles.button} onPress={ReplayLibrary}>
				<Text style={styles.buttonText}>View Replays</Text>
			</Pressable>

			<Pressable style={styles.logoutbutton} onPress={logout}>
				<Text style={styles.logoutbuttonText}>Log Out</Text>
			</Pressable>
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
		marginBottom: 8,
	},
	button: {
		backgroundColor: "white",
		width: "50%",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 20,
		borderRadius: 10,
		padding: 15,
	},
	buttonText: {
		color: "black",
		fontWeight: "700",
		fontSize: 16,
	},
	logoutbutton: {
		backgroundColor: "red",
		width: "50%",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 20,
		borderRadius: 10,
		padding: 15,
	},
	logoutbuttonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
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

export default HomeScreen;

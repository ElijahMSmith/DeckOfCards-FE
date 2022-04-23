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

const LibraryScreen = ({ navigation }) => {
	const { userInfo } = useContext(AuthContext);

	const openReplay = (num) => {
		navigation.navigate("Replay", { num: num - 1 });
	};

	const exitReplay = () => {
		navigation.navigate("Home");
	};

	let replay1 = false;
	let replay2 = false;
	let replay3 = false;
	let replay4 = false;
	let replay5 = false;

	if (userInfo.user.replays[0] != null) {
		replay1 = true;
	}
	if (userInfo.user.replays[1] != null) {
		replay2 = true;
	}
	if (userInfo.user.replays[2] != null) {
		replay3 = true;
	}
	if (userInfo.user.replays[3] != null) {
		replay4 = true;
	}
	if (userInfo.user.replays[4] != null) {
		replay5 = true;
	}

	return (
		<View style={styles.container}>
			{replay1 ? (
				<>
					<Pressable
						style={styles.button}
						onPress={() => openReplay(1)}
					>
						<Text style={styles.buttonText}>Replay 1</Text>
					</Pressable>
				</>
			) : null}
			{replay2 ? (
				<>
					<Pressable
						style={styles.button}
						onPress={() => openReplay(2)}
					>
						<Text style={styles.buttonText}>Replay 2</Text>
					</Pressable>
				</>
			) : null}
			{replay3 ? (
				<>
					<Pressable
						style={styles.button}
						onPress={() => openReplay(3)}
					>
						<Text style={styles.buttonText}>Replay 3</Text>
					</Pressable>
				</>
			) : null}
			{replay4 ? (
				<>
					<Pressable
						style={styles.button}
						onPress={() => openReplay(4)}
					>
						<Text style={styles.buttonText}>Replay 4</Text>
					</Pressable>
				</>
			) : null}
			{replay5 ? (
				<>
					<Pressable
						style={styles.button}
						onPress={() => openReplay(5)}
					>
						<Text style={styles.buttonText}>Replay 5</Text>
					</Pressable>
				</>
			) : null}
			<Pressable style={styles.button} onPress={exitReplay}>
				<Text style={styles.buttonText}>Exit</Text>
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

export default LibraryScreen;

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
import axios from "axios";
import { BASE_URL } from "../config";

const ReplayScreen = ({ route, navigation }) => {
	const { userInfo } = useContext(AuthContext);
	const [socket, setSocket] = useState({});
	const [replay, setReplay] = useState(null);
	const [actionLog, setActionLog] = useState(null);
	const [action, setAction] = useState("");
	const [count, setCount] = useState(0);

	const { num } = route.params;
	useEffect(() => {
		axios
			.get(`${BASE_URL}/replay/retrieve`, {
				headers: { Authorization: "Bearer " + `${userInfo.token}` },
				params: {
					replayID: `${userInfo.user.replays[num]}`,
					playerID: `${userInfo.user._id}`,
				},
			})
			.then((res) => {
				setActionLog(res.data.actionLog);
				setReplay(res.data);
			})
			.catch((e) => console.log(e));
	}, []);

	console.log("replay = ", replay);
	console.log("actionLog = ", actionLog);

	const exitReplay = () => {
		navigation.navigate("Home");
	};

	return (
		<View style={styles.container}>
			{replay ? (
				<ActionDisplay
					actionLog={actionLog}
					clearReplay={() => {
						setReplay(null);
						setActionLog(null);
					}}
				/>
			) : null}
			<Pressable style={styles.button} onPress={exitReplay}>
				<Text style={styles.buttonText}>Exit</Text>
			</Pressable>
		</View>
	);
};

const ActionDisplay = (props) => {
	const [data, setData] = useState({ action: "", index: 0 });
	const { actionLog } = props;

	setTimeout(() => {
		const index = data.index;
		if (index >= actionLog.length) return;

		setData({
			action:
				index + 4 >= actionLog.length
					? "T   "
					: actionLog.substring(index, index + 4),
			index: index + 4,
		});
	}, 1500);

	const getSuit = (card) => {
		if (card === "+" || card === "-") return "No Suit";
		const code = card.charCodeAt(0);
		if (code >= 110) return "Spades";
		else if (code >= 97) return "Clubs";
		else if (code >= 78) return "Diamonds";
		else return "Hearts";
	};

	// Ace = 1, 2, 3, ..., 10, Jack = 11, Queen = 12, King = 13
	const getNumericVal = (card) => {
		if (card === "+" || card === "-") return 0;
		const code = card.charCodeAt(0);
		const fromZero = (code >= 97 ? code - 6 : code) - 65;
		return (fromZero % 13) + 1;
	};

	const pileName = (id) => {
		if (id === "F") return "Deck";
		if (id === "P") return "Faceup";
		if (id === "D") return "Discard";
		if (id === "H") return "Hand";
		if (id === "T") return "Table";
		return "?";
	};

	function isNumeric(str) {
		if (typeof str != "string") return false; // we only process strings!
		return (
			!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
			!isNaN(parseFloat(str))
		); // ...and ensure strings of whitespace fail
	}

	const translate = (action) => {
		console.log(action);
		const arg = action.split(""); // length of 4
		if (arg[0] === "D") {
			// Draw
			return (
				"Player " +
				arg[1] +
				" Draws From " +
				pileName(arg[2]) +
				(arg[3] != " " ? " Onto " + pileName(arg[3]) : "")
			);
		} else if (arg[0] === "P") {
			// Play
			return (
				"Player " +
				arg[1] +
				" Plays " +
				getNumericVal(arg[2]) +
				" Of " +
				getSuit(arg[2]) +
				" To " +
				(isNumeric(arg[3]) ? "Player " + arg[3] : pileName(arg[3]))
			);
		} else if (arg[0] === "F") {
			// Flip
			return (
				"Player " +
				arg[1] +
				" Flips " +
				getNumericVal(arg[2]) +
				" Of " +
				getSuit(arg[2])
			);
		} else if (arg[0] === "S") {
			// Shuffle
			if (arg[1] != " ")
				return (
					"" +
					pileName(arg[1]) +
					(arg[2] != " " ? ", " + pileName(arg[2]) + " " : "") +
					" Shuffled Into Deck"
				);
			else return "Shuffled Deck";
		} else if (arg[0] === "J") {
			// Join
			return "Player Joins Slot " + arg[1];
		} else if (arg[0] === "L") {
			// Leave
			return (
				"Player " +
				(arg[2] == "K" ? "Kicked From " : "Leaves ") +
				"Slot " +
				arg[1]
			);
		} else if (arg[0] === "A") {
			// Absorb
			return "Absorb Player " + arg[1] + " Cards Into Discard";
		} else if (arg[0] === "G") {
			// Give/deal
			if (arg[1] == "0")
				return "Dealt " + (arg[2] + arg[3]) + " Cards to All";
			else return "Dealt " + (arg[2] + arg[3]) + " Player " + arg[1];
		} else if (arg[0] === "N") {
			// Change Dealer
			return "Changed Dealer to Player " + arg[1];
		} else if (arg[0] === "R") {
			// Reset Game
			return "Reset All Cards to Deck";
		} else if (arg[0] === "T") {
			// Terminate
			return "Game Terminated!";
		}
	};

	return (
		<>
			<Text style={styles.bigText}>Action Number: {data.index / 4}</Text>
			<Text style={styles.bigText}>Encoded Action: {data.action}</Text>
			<Text style={styles.bigText}>
				Translation: {translate(data.action)}
			</Text>
		</>
	);
};

const styles = StyleSheet.create({
	bigText: {
		fontSize: "20px",
		marginVertical: "15px",
		textAlign: "center",
		paddingHorizontal: "10px",
	},
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

export default ReplayScreen;

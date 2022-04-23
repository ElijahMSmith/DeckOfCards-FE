import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

var playerNum = -1;

const cardStrToCardCode = (cardStr) => {
	var suit = "";
	var num = 0;
	if (cardStr.length < 2 || cardStr.length > 3)
	{
		return "err";
	}

	if (cardStr.length == 2)
	{
		suit = cardStr.charAt(1);
	}
	else
	{
		suit = cardStr.charAt(2);
	}

	num = parseInt(cardStr);

	if (cardStr.length == 2 && ((cardStr.charAt(0)).toUpperCase()) == 'J')
	{
		num = 11;
	}
	if (cardStr.length == 2 && ((cardStr.charAt(0)).toUpperCase()) == 'Q')
	{
		num = 12;
	}
	if (cardStr.length == 2 && ((cardStr.charAt(0)).toUpperCase()) == 'K')
	{
		num = 13;
	}
	if (cardStr.length == 2 && ((cardStr.charAt(0)).toUpperCase()) == 'A')
	{
		num = 1;
	}

	if (num > 13 || num < 1)
	{
		return "err";
	}

	if (suit.toUpperCase() == 'S')
	{
		num += 109;
	}
	else if (suit.toUpperCase() == 'H')
	{
		num += 64;
	}
	else if (suit.toUpperCase() == 'D')
	{
		num += 77;
	}
	else if (suit.toUpperCase() == 'C')
	{
		num += 96;
	}
	else
	{
		return "err";
	}

	return (String.fromCharCode(num))
}

const getSuit = (card) => {
	if (card.value === '+' || card.value === '-')
			return 'No Suit';
	const code = card.value.charCodeAt(0);
	if (code >= 110)
			return 'Spades';
	else if (code >= 97)
			return 'Clubs';
	else if (code >= 78)
			return 'Diamonds';
	else
			return 'Hearts';
}
// Ace = 1, 2, 3, ..., 10, Jack = 11, Queen = 12, King = 13
const getNumericVal = (card) => {
	if (card.value === '+' || card.value === '-')
			return 0;
	const code = card.value.charCodeAt(0);
	const fromZero = (code >= 97 ? code - 6 : code) - 65;
	return (fromZero % 13) + 1;
}

const genCard = (card, owner) => {

	if (card.revealed == false && owner > 0 && owner != playerNum)
	{
		return (
			<View key={card.value} style={styles.card}>
				<Text style={styles.cardNum}>?</Text>
				<Text style={styles.cardSuit}>?</Text>
			</View>)
	}

	var isRed = false;
	var num = getNumericVal(card);
	var suit = getSuit(card);

	if (num == 1)
	{
		num = 'A';
	}
	else if (num >= 11)
	{  
		if (num == 11)
		{
			num = 'J';
		}
		else if (num == 12)
		{
			num = 'Q';
		}
		else if (num == 13)
		{
			num = 'K';
		}
		else
		{
			num = 'Err';
		}
	}

	if (suit == 'S' || suit == 's' || suit == 'Spades')
	{
		suit = '♠';
	}
	else if (suit == 'H' || suit == 'h' || suit == 'Hearts')
	{
		suit = '♥';
		isRed = true;
	}
	else if (suit == 'D' || suit == 'd' || suit == 'Diamonds')
	{
		suit = '♦';
		isRed = true;
	}
	else if (suit == 'C' || suit == 'c' || suit == 'Clubs')
	{
		suit = '♣';
	}
	else
	{
		suit = 'J';
		num = card.value;
	}
	

	
	if (isRed) {
		return (
			<View key={card.value} style={[styles.card, styles.redBorder]}>
				<Text style={[styles.cardNum, styles.redText]}>{num}</Text>
				<Text style={[styles.cardSuit, styles.redText]}>{suit}</Text>
			</View>
		)
	}
	return (
		<View key={card.value} style={styles.card}>
			<Text style={styles.cardNum}>{num}</Text>
			<Text style={styles.cardSuit}>{suit}</Text>
		</View>
	)
};

const genPlayerTitle = (num) => {
	if (num == playerNum)
	{
		return (
			<Text>Player {num} <Text style={styles.accent}>(You)</Text></Text>
		)
	}
	return (
		<Text>Player {num}</Text>
	)
}

function genTableCards (player, num) {

	// do not render if no cards on table
	if (player.table.contents.length == 0)
	{
		return (null);
	}

	const cards = player.table.contents.map(element => genCard(element, num));
	// render with same rules as the hand cards if any on table
	return (
	<View key={num + 400}>
		<Text style={styles.title}>{genPlayerTitle(num)} Table Cards:</Text>
		<View style={styles.hand}>{cards}</View>
	</View>
	);
}

function genHand (player, num) {
	if (player.hand.contents.length == 0)
	{
		return (
		<View key={num+100}>
			<Text style={styles.title}>{genPlayerTitle(num)}:</Text>
			<View style={styles.hand}>
				<View style={styles.card}>
					<Text style={styles.emptyPileTitle}>No Cards</Text>
				</View>
			</View>
		</View>
		);
	}
	else {
	const cards = player.hand.contents.map(element => genCard(element, num));

	return (
		<View key={num+200}>
			<Text style={styles.title}>{genPlayerTitle(num)}:</Text>
			<View style={styles.hand}>{cards}</View>
		</View>
		)
	}
}
// gen jsx for pile
function genPile (pile, name) {
	{
		var cardTitle = name;
		// shorten certain names
		if (name == "Discard")
		{
			cardTitle = "Disc."
		}

		if (pile.contents.length == 0)
		{
			return (
				<View>
					<Text style={styles.title}>{name}:</Text>
					<View style={styles.hand}>
						<View style={styles.card}>
							<Text style={styles.emptyPileTitle}>No Cards</Text>
						</View>
					</View>
				</View>
			)
		}

		// if facedown
		if (pile.pileID == "F")
		{
			return (
				<View>
					<Text style={styles.title}>{name}:</Text>
					<View style={styles.hand}>
						<View style={styles.card}>
							<Text style={styles.pileTitle}>{cardTitle}</Text>
							<Text style={styles.cardSuit}>{pile.contents.length}</Text>
						</View>
					</View>
				</View>
			)
		}

		// render if face up and not empty
		const cards = pile.contents.map(n => genCard(n, -1));

		return (
			<View>
				<Text style={styles.title}>{name}:</Text>
				<View style={styles.hand}>{cards}</View>
			</View>
		)
	}
}

const GameScreen = ({navigation}) => {
	const {gameStateC, socketC} = useContext(AuthContext);
	console.log(socketC);
	const [gameState, setGameState] = useState(gameStateC);
	// react is evil and does not detect changes in the properties of an object as a 'real' change
	// so this jank setup forces the page to reload, I've spent too long looking for a pretty fix.
	const [, setReload] = useState();
	const [source, setSource] = useState("");
	const [target, setTarget] = useState("");
	const [lobbyTarget, setLobbyTarget] = useState("");
	const [showHelp, setShowHelp] = useState(true);
	
	var gameCode = gameState.code;
	playerNum = gameState.playerNumber;
	const socket = socketC;
	
	useEffect(() => {
		socket.on('update', (obj) => {
			var tmp = gameState;
			tmp.currentState = Object.assign(gameState.currentState, obj);
			setGameState(tmp);
			console.log(gameState);
			setReload({});
		});

		socket.on('kicked', () => {
			console.log("kicked");
			navigation.navigate('Home');
		});
	}, []);

	if (gameState == null)
	{
		return (
			<View style={styles.container}>
				<Text>Couldn't Connect to server</Text>
				<View>
					<TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate('Home')}>
						<Text style={styles.link}>Leave Game</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
	

	const wordToCode = (str) => {
		if (str.toUpperCase() == "DECK")
		{
			return "F";
		}
		if (str.toUpperCase() == "DISCARD" || str.toUpperCase() == "DIS" )
		{
			return "D";
		}
		if (str.toUpperCase() == "TABLE" || str.toUpperCase() == "TAB")
		{
			return "T";
		}
		if (str.toUpperCase() == "HAND")
		{
			return "H";
		}
		if (str.toUpperCase() == "FACE UP" || str.toUpperCase() == "UP" || str.toUpperCase() == "FACE")
		{
			return "P";
		}
		return (str);
	}

	const draw = () => {
		var to = target;
		var from = source;
		if (target == "")
		{
			to = 'H';
		}
		if (from == "")
		{
			// F: face down deck
			from = 'F'
		}


		var actionCode = "";
		if (to == playerNum)
		{
			actionCode = "D" + playerNum + wordToCode(from) + " ";
		}
		else
		{
		// gen action code
		actionCode = "D" + playerNum + wordToCode(from) + wordToCode(to);
		}

		console.log("Draw: " + actionCode)
		
		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			return "err";
		}
		// draw card
		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const play = () => {
		// in this context source is a card
		if (target == "" || source == "")
		{
			console.log("Target and/or source cannot be empty");
			return "err";
		}

		var cardCode = cardStrToCardCode(source);

		if (cardCode == "err")
		{
			console.log("error in card code, bad input")
			return "err";
		}

		// gen action code
		var actionCode = "P" + playerNum + cardCode + wordToCode(target);

		console.log("Play: " + actionCode)

		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			return "err";
		}

		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const flip = () => {
		// in this context source is a card
		if (source == "")
		{
			console.log("source cannot be empty");
			return null;
		}

		var cardCode = cardStrToCardCode(source);

		if (cardCode == "err")
		{
			console.log("error in card code, bad input")
			return "err";
		}

		// gen action code
		var actionCode = "F" + playerNum + cardCode + " ";

		console.log("Flip: " + actionCode)

		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			return "err";
		}
		
		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const shuffle = () => {
		// both target and source are piles/hands
		var pile1 = wordToCode(source);
		var pile2 = wordToCode(target);
		
		if (source == "")
		{
			pile1 = " ";
		}
		if (target == "")
		{
			pile2 = " ";
		}

		// gen action code
		var actionCode = "S" + pile1 + pile2 + " ";

		console.log("shuffle: " + actionCode)

		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			
			socket.emit('action', gameCode, "S   ", (state) => {
				console.log(state);
			});
			return "";
		}

		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const deal = () => {
		// target is a player num, 0 for all
		// source is # of cards to be given to each player
		// deals 1 to all in case of improper input
		var toPlayer = parseInt(target);
		var numCards = parseInt(source);
		
		if (target == "" || toPlayer == NaN || toPlayer > 8 || toPlayer < 0)
		{
			toPlayer = 0;
		}
		if (source == "" || numCards == NaN || numCards < 0)
		{
			numCards = 1;
		}

		// gen action code
		if (numCards >= 100) {
			numCards = 99
		}
		var actionCode = "";
		if (numCards < 10)
		{
			actionCode = "G" + toPlayer + "0" + numCards;
		}
		else
		{
			actionCode = "G" + toPlayer + numCards;
		}

		console.log("Deal: " + actionCode)

		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			return "";
		}

		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const leaveGame = () => {

		// gen action code
		var actionCode = "L" + playerNum + " " + " ";

		console.log("Left: " + actionCode)

		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			return "err";
		}
		
		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});

		navigation.navigate('Home');
	}

	const isHost = () => {
		if (playerNum == 1)
		{
			return true;
		}
		return false;
	}

	const isDealer = () => {
		if (playerNum == gameState.currentState.currentDealer)
		{
			return true;
		}
		return false;
	}

	const kickPlayer = () => {
		if (lobbyTarget == "")
		{
			console.log("player cannot be empty");
			return null;
		}

		if (lobbyTarget > 8 || lobbyTarget < 1)
		{
			console.log("Invalid player, must be from 1-8")
			return null;
		}

		// gen action code
		var actionCode = "L" + lobbyTarget + "K" + " ";

		console.log("Kick: " + actionCode)

		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			return "err";
		}
		
		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const absorbHand = () => {
		if (lobbyTarget == "")
		{
			console.log("player cannot be empty");
			return null;
		}

		if (lobbyTarget > 8 || lobbyTarget < 1)
		{
			console.log("Invalid player, must be from 1-8")
			return null;
		}

		// gen action code
		var actionCode = "A" + lobbyTarget + " " + " ";

		console.log("absorb: " + actionCode)

		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			return "err";
		}
		
		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const assignDealer = () => {
		if (lobbyTarget == "")
		{
			console.log("player cannot be empty");
			return null;
		}

		if (lobbyTarget > 8 || lobbyTarget < 1)
		{
			console.log("Invalid player, must be from 1-8")
			return null;
		}

		// gen action code
		var actionCode = "N" + lobbyTarget + " " + " ";

		console.log("assign dealer: " + actionCode)

		if (actionCode.length != 4) {
			console.log("error in action code, invalid code:" + actionCode);
			return "err";
		}
		
		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const resetGame = () => {
		// gen action code
		var actionCode = "R   ";

		console.log("reset game: " + actionCode)
		
		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});
	}

	const endGame = () => {
		// gen action code
		var actionCode = "T   ";

		console.log("end game: " + actionCode)
		
		socket.emit('action', gameCode, actionCode, (state) => {
			console.log(state);
		});

		navigation.navigate('Home')
	}

	const genHands = (state) => {
		const hands = [];
			if ('_id' in state.currentState.player8) {
				hands.push(genHand(state.currentState.player8, 8));
				hands.push(genTableCards(state.currentState.player8, 8));
			}
			if ('_id' in state.currentState.player7) {
				hands.push(genHand(state.currentState.player7, 7));
				hands.push(genTableCards(state.currentState.player7, 7));
			}
			if ('_id' in state.currentState.player6) {
				hands.push(genHand(state.currentState.player6, 6));
				hands.push(genTableCards(state.currentState.player6, 6));
			}
			if ('_id' in state.currentState.player5) {
				hands.push(genHand(state.currentState.player5, 5));
				hands.push(genTableCards(state.currentState.player5, 5));
			}
			if ('_id' in state.currentState.player4) {
				hands.push(genHand(state.currentState.player4, 4));
				hands.push(genTableCards(state.currentState.player4, 4));
			}
			if ('_id' in state.currentState.player3) {
				hands.push(genHand(state.currentState.player3, 3));
				hands.push(genTableCards(state.currentState.player3, 3));
			}
			if ('_id' in state.currentState.player2) {
				hands.push(genHand(state.currentState.player2, 2));
				hands.push(genTableCards(state.currentState.player2, 2));
			}
			if ('_id' in state.currentState.player1) {
				hands.push(genHand(state.currentState.player1, 1));
				hands.push(genTableCards(state.currentState.player1, 1));
			}

		return hands;
	}
	const genHelp = () => {
		if (!showHelp)
		{
			return(null);
		}
		return (
			<View style={styles.helpContainer}>
				<Text style={styles.help}>Pile codes:</Text>
				<Text style={styles.help}><Text style={styles.accent}>Deck:</Text> "Deck", "F"</Text>
				<Text style={styles.help}><Text style={styles.accent}>Discard:</Text> "Discard", "Dis", "D"</Text>
				<Text style={styles.help}><Text style={styles.accent}>Face Up:</Text> "Face Up", "Face", "P"</Text>
				<Text style={styles.help}><Text style={styles.accent}>Your Hand:</Text> "Hand", "H"</Text>
				<Text style={styles.help}><Text style={styles.accent}>Player #'s Hand:</Text> "#"</Text>
				<Text style={styles.help}><Text style={styles.accent}>Card:</Text> string of form "[Num][Suit]"</Text>
				<Text style={styles.help}><Text style={styles.accent}>Example:</Text> 10 of spades : 10S, Queen of Diamonds : QD</Text>
			</View>
		);
	}

	const genControls = () => {
		if (!showHelp)
		{
			return (
				<View>
					<TouchableOpacity style={styles.touchable} onPress={() => draw()}>
						<Text style={styles.link}>Draw Card</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.touchable} onPress={() => play()}>
						<Text style={styles.link}>Play Card</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.touchable} onPress={() => shuffle()}>
						<Text style={styles.link}>Shuffle/Shuffle in</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.touchable} onPress={() => flip()}>
						<Text style={styles.link}>reveal/hide card</Text>
					</TouchableOpacity>
					<TouchableOpacity style={isDealer() ? styles.touchable : styles.touchableDisabled} disabled={!isDealer()} onPress={() => deal()}>
						<Text style={styles.link}>Deal Cards</Text>
					</TouchableOpacity>
				</View>
			)
		}
		
		return (
			<View>
				<TouchableOpacity style={styles.touchable} onPress={() => draw()}>
					<Text style={styles.link}>Draw Card</Text>
				</TouchableOpacity>
				<Text style={styles.help}>Move the top card of <Text style={styles.accent}>souce</Text> (pile) to <Text style={styles.accent}>target</Text> (pile/hand)</Text>
				<TouchableOpacity style={styles.touchable} onPress={() => play()}>
					<Text style={styles.link}>Play Card</Text>
				</TouchableOpacity>
				<Text style={styles.help}>Move <Text style={styles.accent}>souce</Text> (card) to <Text style={styles.accent}>target</Text> (pile/hand)</Text>
				<TouchableOpacity style={styles.touchable} onPress={() => shuffle()}>
					<Text style={styles.link}>Shuffle/Shuffle in</Text>
				</TouchableOpacity>
				<Text style={styles.help}>Shuffle <Text style={styles.accent}>souce and target</Text> (piles) into deck (if none specified only shuffle deck)</Text>
				<TouchableOpacity style={styles.touchable} onPress={() => flip()}>
					<Text style={styles.link}>reveal/hide card</Text>
				</TouchableOpacity>
				<Text style={styles.help}>Toggle visibility of <Text style={styles.accent}>souce</Text> (card) to other players</Text>
				<TouchableOpacity style={isDealer() ? styles.touchable : styles.touchableDisabled} disabled={!isDealer()} onPress={() => deal()}>
					<Text style={styles.link}>Deal Cards</Text>
				</TouchableOpacity>
				<Text style={styles.help}>Deal <Text style={styles.accent}>souce</Text> (number) cards to <Text style={styles.accent}>target</Text> (player #, if blank or zero deal to all player)</Text>
			</View>
		)
	}
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Game Code: {gameState.code}</Text>
			{genHelp()}
			<TextInput
				style={styles.input}
				value={source}
				placeholder="Source"
				onChangeText={text => setSource(text)}
			/>
			<TextInput
				style={styles.input}
				value={target}
				placeholder="Target"
				onChangeText={text => setTarget(text)}
			/>
			{genControls()}
			<View>
				{genPile(gameState.currentState.deck, "Deck")}
				{genPile(gameState.currentState.discard, "Discard")}
				{genPile(gameState.currentState.faceUp, "Face Up")}
				{genHands(gameState)}
			</View>
			<View>
				<TextInput
					style={styles.input}
					value={lobbyTarget}
					placeholder="user #"
					onChangeText={text => setLobbyTarget(text)}
				/>
				<TouchableOpacity style={styles.touchable} onPress={() => leaveGame()}>
        	<Text style={styles.link}>Leave Game</Text>
        </TouchableOpacity>
				<TouchableOpacity style={styles.touchable} onPress={() => {showHelp ? setShowHelp(false) : setShowHelp(true)}}>
        	<Text style={styles.link}>Toggle Action Info</Text>
        </TouchableOpacity>
				<TouchableOpacity style={isHost() ? styles.touchable : styles.touchableDisabled} disabled={!isHost()} onPress={() => kickPlayer()}>
        	<Text style={styles.link}>Kick Player</Text>
        </TouchableOpacity>
				<TouchableOpacity style={isHost() ? styles.touchable : styles.touchableDisabled} disabled={!isHost()} onPress={() => absorbHand()}>
        	<Text style={styles.link}>Absorb Hand</Text>
        </TouchableOpacity>
				<TouchableOpacity style={(isHost() || isDealer()) ? styles.touchable : styles.touchableDisabled} disabled={!(isHost() || isDealer())} onPress={() => assignDealer()}>
        	<Text style={styles.link}>Set Dealer</Text>
        </TouchableOpacity>
				<TouchableOpacity style={isHost() ? styles.touchable : styles.touchableDisabled} disabled={!isHost()} onPress={() => resetGame()}>
        	<Text style={styles.link}>Reset Game</Text>
        </TouchableOpacity>
				<TouchableOpacity style={isHost() ? styles.touchable : styles.touchableDisabled} disabled={!isHost()} onPress={() => endGame()}>
        	<Text style={styles.link}>End Game</Text>
        </TouchableOpacity>
			</View>

			<StatusBar style="auto" />
		</View>
	);
}

export default GameScreen;

const styles = StyleSheet.create({
	touchable: {
		backgroundColor: '#FFFFFF',
		padding: 10,
		borderWidth: 2,
		borderRadius: 25,
		margin: 2,
		color: '#000000',
	},
	touchableDisabled: {
		backgroundColor: '#888888',
		padding: 10,
		borderWidth: 2,
		borderRadius: 25,
		margin: 2,
		color: '#000000',
	},
	help: {
		color: '#FFFFFF',
		fontSize: 20,
	},
	helpContainer: {
		alignItems: 'center',
	},
	accent: {
		color: '#ff97ea',
	},
	container: {
		backgroundColor: '#35654d',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '100vh', 
	},
	buttonContainer: {
		backgroundColor: '#35654d',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '100vh', 
	},
	hand: {
		backgroundColor: '#35654d',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: "row",
		flexWrap: "wrap",
		flex: 1,
		flexShrink: 1,
	},
	card: {
		backgroundColor: '#FFFFFF',
		width: 100,
		height: 140,
		borderWidth: 2,
		margin: 3,
		color: '#000000',
	},

	cardNum: {
		textAlign: 'right',
		fontSize: 30,
		padding: 10,
		paddingTop: 0,
		marginTop: 0,
		marginBottom: 0,
		paddingBottom: 0,
	},
	pileTitle: {
		textAlign: 'center',
		fontSize: 30,
		padding: 10,
		paddingTop: 0,
		marginTop: 0,
		marginBottom: 0,
		paddingBottom: 0,
	},
	emptyPileTitle: {
		textAlign: 'center',
		textAlignVertical: 'bottom',
		fontSize: 30,
		padding: 10,
		paddingTop: 0,
		marginTop: 20,
		marginBottom: 0,
		paddingBottom: 0,
	},
	title: {
		color: '#FFFFFF',
		textAlign: 'center',
		fontSize  : 30,
		padding: 5,
	},
	cardSuit: {
		textAlign: 'center',
		textAlignVertical: 'top',
		fontSize: 50,
		padding: 0,
		paddingTop: 0,
		marginTop: 0,
		justifyContent: 'center',
	},

	redBorder: {
		borderColor: '#dd0000',
		borderWidth: 2,
	},

	redText: {
		color: '#dd0000',
	},

	input: {
		margin: 5,
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 5,
		paddingHorizontal: 14,
		backgroundColor: 'white',
	},
});

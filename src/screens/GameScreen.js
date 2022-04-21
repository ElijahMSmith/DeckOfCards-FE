import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Button } from 'react-native-web';
import io from 'socket.io-client';

// ♠ ♥ ♦ ♣

const socket = io.connect('https://mobiledeckofcards.azurewebsites.net', {
  auth : {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ1MjQ1ZTA5ZTM1ZmJmYjEyODg4NDYiLCJpYXQiOjE2NDg2OTg0NjJ9.uczJG3tl-wh6V646zX_i2CcTp1pWYNOT57ndedUzOJg',
  },
});

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
      <View style={styles.card}>
        <Text style={styles.cardNum}>?</Text>
        <Text style={styles.cardSuit}>?</Text>
      </View>
    )
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
    num = 'Jkr';
  }
  

  
  if (isRed) {
    return (
      <View style={[styles.card, styles.redBorder]}>
      <Text style={[styles.cardNum, styles.redText]}>{num}</Text>
      <Text style={[styles.cardSuit, styles.redText]}>{suit}</Text>
      </View>
    )
  }
  return (
    <View style={styles.card}>
    <Text style={styles.cardNum}>{num}</Text>
    <Text style={styles.cardSuit}>{suit}</Text>
    </View>
  )
};

function genTableCards (player, num) {

  // do not render if no cards on table
  if (player.table.contents.length == 0)
  {
    return (<View key={player + num} style={{visibility: 'hidden'}}></View>);
  }

  const cards = player.table.contents.map(element => genCard(element, num));
  // render with same rules as the hand cards if any on table
  return (
  <View key={player + num}>
    <Text style={styles.title}>Player {num} Table Cards:</Text>
    <View style={styles.hand}>
      { cards }
    </View>
  </View>
  );
}

function genHand (player, num) {
  if (player.hand.contents.length == 0)
  {
    return (
    <View key={player}>
      <Text style={styles.title}>Player {num}:</Text>
      <View style={styles.hand}>
        <View style={styles.card}>
          <Text style={styles.emptyPileTitle}>No Cards</Text>
          <Text style={styles.cardSuit}></Text>
        </View>
      </View>
    </View>
    );
  }
  else {
  const cards = player.hand.contents.map(element => genCard(element, num));

  return (
    <View key={player}>
      <Text style={styles.title}>Player {num}:</Text>
      <View style={styles.hand}>
        { cards }
      </View>
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
              <Text style={styles.cardSuit}></Text>
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
        <View style={styles.hand}>
          { cards }
        </View>
      </View>
    )
  }
}


var code = null;
var playerNum = null;
var initalState = null;
// new game
socket.emit('create', new Rules(), (state) => {
    initalState = state;
    playerNum = state.playerNumber;
    code = state.code;
    console.log(state);
});

export default function GameScreen({navigation}) {
  const [gameState, setGameState] = useState(initalState);
  // react is evil and does not detect changes in the properties of an object as a 'real' change
  // so this jank setup forces the page to reload, I've spent too long looking for a pretty fix.
  const [, setReload] = useState();
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [lobbyTarget, setLobbyTarget] = useState("");

  if (gameState == null)
  {
    return (
      <View style={styles.container}>
        <Text>Couldn't Connect to server</Text>
      </View>
    )
  }
  
  useEffect(() => {
    socket.on('update', (obj) => {
      
      var tmp = gameState;
      tmp.currentState = Object.assign(gameState.currentState, obj);
      setGameState(tmp);
      console.log(gameState)
      setReload({})
    });
  }, []);

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
    
    if (target == "" || source == "")
    {
      console.log("Target and/or source cannot be empty");
      return null;
    }


    var actionCode = "";
    if (target == playerNum)
    {
      actionCode = "D" + playerNum + wordToCode(source) + " ";
    }
    else
    {
    // gen action code
    actionCode = "D" + playerNum + wordToCode(source) + wordToCode(target);
    }

    console.log("Draw: " + actionCode)
    
    if (actionCode.length != 4) {
      console.log("error in action code, invalid code:" + actionCode);
      return "err";
    }
    // draw card
    socket.emit('action', code, actionCode, (state) => {
      console.log(state);
    });
  }

  const play = () => {
    // in this context source is a card
    if (target == "" || source == "")
    {
      console.log("Target and/or source cannot be empty");
      return null;
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

    socket.emit('action', code, actionCode, (state) => {
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
    
    socket.emit('action', code, actionCode, (state) => {
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
      
      socket.emit('action', code, "S   ", (state) => {
        console.log(state);
      });
      return "";
    }

    socket.emit('action', code, actionCode, (state) => {
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

    socket.emit('action', code, actionCode, (state) => {
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
    
    socket.emit('action', code, actionCode, (state) => {
      console.log(state);
    });

    navigation.navigate('Login');
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
    
    socket.emit('action', code, actionCode, (state) => {
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
    
    socket.emit('action', code, actionCode, (state) => {
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
    
    socket.emit('action', code, actionCode, (state) => {
      console.log(state);
    });
  }

  const resetGame = () => {
    // gen action code
    var actionCode = "R   ";

    console.log("reset game: " + actionCode)
    
    socket.emit('action', code, actionCode, (state) => {
      console.log(state);
    });
  }

  const endGame = () => {
    // gen action code
    var actionCode = "T   ";

    console.log("end game: " + actionCode)
    
    socket.emit('action', code, actionCode, (state) => {
      console.log(state);
    });
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

  return (
    <View style={styles.container}>
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
      <View>
        <Button
            title="Draw Card"
            color="red"
            onPress={() => {
              draw();
            }}
        />
        <Button
            title="Play Card"
            color="blue"
            onPress={() => {
              play();
            }}
        />
        <Button
            title="Flip Card"
            color="purple"
            onPress={() => {
              flip();
            }}
        />
        <Button
            title="Shuffle/Shuffle in"
            color="gray"
            onPress={() => {
              shuffle();
            }}
        />
        <Button
            title="Deal Cards"
            color="green"
            onPress={() => {
              deal();
            }}
        />
      </View>
      {genPile(gameState.currentState.deck, "Deck")}
      {genPile(gameState.currentState.discard, "Discard")}
      {genPile(gameState.currentState.faceUp, "Face Up")}
      {genHands(gameState)}
      <View>
        <TextInput
          style={styles.input}
          value={lobbyTarget}
          placeholder="user #"
          onChangeText={text => setLobbyTarget(text)}
        />
        <Button
            title="Leave Game"
            color="red"
            onPress={() => {
              leaveGame();
            }}
        />
        <Button
            title="Kick Player"
            color="blue"
            onPress={() => {
              kickPlayer();
            }}
        />
        <Button
            title="Absorb Hand"
            color="purple"
            onPress={() => {
              absorbHand();
            }}
        />
        <Button
            title="Set Dealer"
            color="black"
            onPress={() => {
              assignDealer();
            }}
        />
        <Button
            title="Reset Game"
            color="grey"
            onPress={() => {
              resetGame();
            }}
        />
        <Button
            title="End Game"
            color="green"
            onPress={() => {
              endGame();
            }}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
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
    fontSize: 30,
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

import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-web';
import io from 'socket.io-client';

// ♠ ♥ ♦ ♣



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
    <View style={styles.card}>
      <Text style={styles.cardNum}>?</Text>
      <Text style={styles.cardSuit}>?</Text>
    </View>
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

function genHand (player, num) {
  {
    if (player.hand.contents.length == 0)
    {
      return (
      <View key={num}>
        <Text style={styles.title}>Player {num}</Text>
        <View style={styles.hand}>
          <View style={styles.card}>
            <Text style={styles.emptyPileTitle}>No Cards</Text>
            <Text style={styles.cardSuit}></Text>
          </View>
        </View>
      </View>
      )
    }

    const cards = player.hand.contents.map(element => genCard(element, num));

    return (
    <View>
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

function getNumPlayers(game) {
  if ('_id' in game.currentState.player8) {
    return 8;
  }
  if ('_id' in game.currentState.player7) {
    return 7;
  }
  if ('_id' in game.currentState.player6) {
    return 6;
  }
  if ('_id' in game.currentState.player5) {
    return 5;
  }
  if ('_id' in game.currentState.player4) {
    return 4;
  }
  if ('_id' in game.currentState.player3) {
    return 3;
  }
  if ('_id' in game.currentState.player2) {
    return 2;
  }
  if ('_id' in game.currentState.player1) {
    return 1;
  }
  
  return -1;
}

const socket = io.connect('https://mobiledeckofcards.azurewebsites.net', {
  auth : {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ1MjQ1ZTA5ZTM1ZmJmYjEyODg4NDYiLCJpYXQiOjE2NDg2OTg0NjJ9.uczJG3tl-wh6V646zX_i2CcTp1pWYNOT57ndedUzOJg',
  },
});

var code = null;
var playerNum = null;
var initalState = null;
var numPlayers = null;
// new game
socket.emit('create', new Rules(), (state) => {
    initalState = state;
    playerNum = state.playerNumber;
    code = state.code;
    numPlayers = getNumPlayers(state);
    console.log(state);
});

export default function GameScreen() {
  const [gameState, setGameState] = useState(initalState);
  // react is evil and does not detect changes in the properties of an object as a 'real' change
  // so this jank setup forces the page to reload, I've spent too long looking for a pretty fix.
  const [, setReload] = useState();
  // use effect with empty dependencies only runs once, running this multiple times results polynomially increacing state updates
  useEffect(() => {
    socket.on('update', (obj) => {
      var tmp = gameState;
      tmp.currentState = Object.assign(gameState.currentState, obj);
      setGameState(tmp);
      console.log(gameState)
      setReload({})
    });
  }, []);

  const draw = () => {
    // draw 1 card
    socket.emit('action', code, 'D1F ', (state) => {
      console.log(state);
    });
  }

  const genHands = (state, num) => {
    const hands = [];
    switch (num)
    {
      case 8:
        hands.push(genHand(state.currentState.player8, 8));
      case 7:
        hands.push(genHand(state.currentState.player7, 7));
      case 6:
        hands.push(genHand(state.currentState.player6, 6));
      case 5:
        hands.push(genHand(state.currentState.player5, 5));
      case 4:
        hands.push(genHand(state.currentState.player4, 4));
      case 3:
        hands.push(genHand(state.currentState.player3, 3));
      case 2:
        hands.push(genHand(state.currentState.player2, 2));
      case 1:
        hands.push(genHand(state.currentState.player1, 1));
    }

    return hands;
  }

  return (
    <View style={styles.container}>
      {genPile(gameState.currentState.deck, "Deck")}
      {genPile(gameState.currentState.discard, "Discard")}
      {genHands(gameState, numPlayers)}
      <Button
          title="Draw Card"
          color="red"
          onPress={() => {
            draw();
          }}
        />
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexWrap: 'nowrap',
    padding: 5,
    backgroundColor: '#35654d',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
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
    userSelect: 'none',
  },
  pileTitle: {
    textAlign: 'center',
    fontSize: 30,
    padding: 10,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    userSelect: 'none',
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
    userSelect: 'none',
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 30,
    padding: 5,
    userSelect: 'none',
  },
  cardSuit: {
    textAlign: 'center',
    textAlignVertical: 'top',
    fontSize: 50,
    padding: 0,
    paddingTop: 0,
    marginTop: 0,
    justifyContent: 'center',
    userSelect: 'none',
  },

  redBorder: {
    borderColor: '#dd0000',
    borderWidth: 2,
  },

  redText: {
    color: '#dd0000',
  },
});

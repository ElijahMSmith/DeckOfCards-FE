import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

const socket = io.connect('https://mobiledeckofcards.azurewebsites.net', {
  auth : {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ1MjQ1ZTA5ZTM1ZmJmYjEyODg4NDYiLCJpYXQiOjE2NDg2OTg0NjJ9.uczJG3tl-wh6V646zX_i2CcTp1pWYNOT57ndedUzOJg',
  },
});

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

const genCard = (card) => {

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

function Hand (player, num) {
  {
    if (player.hand.contents.length == 0)
    {
      return (
      <View>
        <Text>player {num}</Text>
        <View style={styles.hand}>
          <Text>Hand Empty</Text>
        </View>
      </View>
      )
    }

    const cards = player.hand.contents.map(genCard);

    return (
      <View>
      <Text>player {num}:</Text>
      <View style={styles.hand}>
        { cards }
      </View>
    </View>
    )
  }
}

function genDeck (deck) {
  {
    if (deck.contents.length == 0)
    {
      return (
      <View>
        <Text>Deck:</Text>
        <View style={styles.hand}>
          <Text>Deck Empty</Text>
        </View>
      </View>
      )
    }

    const cards = deck.contents.map(genCard);

    return (
      <View>
      <Text>Deck:</Text>
      <View style={styles.hand}>
        { cards }
      </View>
    </View>
    )
  }
}


var initalState = null;

socket.emit('create', new Rules(), (game) => {
  initalState = game;
  console.log(initalState);
});



export default function GameScreen() {
  const [gameState, setGameState] = useState(initalState);

  console.log('here')
  return (
    <View style={styles.container}>
      <Text>Hand</Text>
      {Hand(gameState.currentState.player1, 1)}
      {genDeck(gameState.currentState.deck)}
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#35654d',
    alignItems: 'center',
    justifyContent: 'center',
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

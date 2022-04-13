import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// ♠ ♥ ♦ ♣

const Card = (num, suit) => {

  var isRed = false;

  if (suit == 'S' || suit == 's')
  {
    suit = '♠';
  }
  else if (suit == 'H' || suit == 'h')
  {
    suit = '♥';
    isRed = true;
  }
  else if (suit == 'D' || suit == 'd')
  {
    suit = '♦';
    isRed = true;
  }
  else if (suit == 'C' || suit == 'c')
  {
    suit = '♣';
  }
  else
  {
    suit = '?';
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

const Hand = () => {
  return (
    <View style={styles.hand}>
    {Card('A', 'D')}
    {Card('2', 'S')}
    {Card('5', 'H')}
    {Card('J', 'C')}
    {Card('K', 'C')}
    {Card('9', 'D')}
    {Card('10', 'S')}
    </View>
  )
}
  
export default function App() {
  var card1 = Card('9', 'h');
  var card2 = Card('J', 'D');
  return (
    <View style={styles.container}>
      <Text>Hand</Text>
      {Hand()}
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {  
    flex: 1,
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

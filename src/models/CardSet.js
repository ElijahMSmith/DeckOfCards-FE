"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardSet = void 0;
const Card_1 = require("./Card");
class CardSet {
    // initialState = [char]
    constructor(initContents = []) {
        this.contents = []; // [Card]
        for (let cardCode of initContents)
            this.contents.push(new Card_1.Card(cardCode));
    }
    // times = Number
    shuffle(times = this.contents.length * 5) {
        while (--times > 0) {
            const rand1 = Math.floor(Math.random() * this.contents.length);
            const rand2 = Math.floor(Math.random() * this.contents.length);
            const temp = this.contents[rand1];
            this.contents[rand1] = this.contents[rand2];
            this.contents[rand2] = temp;
        }
    }
    hideAll() {
        for (let card of this.contents)
            card.hide();
    }
    revealAll() {
        for (let card of this.contents)
            card.show();
    }
    // val = char (what to find)
    indexOf(val) {
        for (let i = 0; i < this.contents.length; i++)
            if (this.contents[i].value === val)
                return i;
        return -1;
    }
    // toReveal = char (value)
    // returns whether the card was found or not
    revealCard(toReveal) {
        const index = this.indexOf(toReveal);
        if (index === -1)
            return false;
        this.contents[index].show();
        return true;
    }
    hideCard(toHide) {
        const index = this.indexOf(toHide);
        if (index === -1)
            return false;
        this.contents[index].hide();
        return true;
    }
    // toRemove = char (value)
    // Returns the card object removed
    removeCard(toRemove) {
        const index = this.indexOf(toRemove);
        return index === -1 ? null : this.contents.splice(index, 1)[0];
    }
    // value = char
    // position = Number (optional)
    insertCard(card, showing = false, position = this.contents.length) {
        if (showing)
            card.show();
        else
            card.hide();
        this.contents.splice(position ?? this.contents.length, 0, card);
    }
    toString() {
        return this.contents.reduce((previousValue, currentCard) => previousValue + currentCard.value, '');
    }
    size() {
        return this.contents.length;
    }
    combineInto(other) {
        other.contents = other.contents.concat(this.contents);
        this.clear();
    }
    static merge(set1, set2) {
        const merged = new CardSet();
        merged.contents = set1.contents.concat(set2.contents);
        return merged;
    }
    clear() {
        this.contents = [];
    }
}
exports.CardSet = CardSet;

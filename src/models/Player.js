"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const CardSet_1 = require("./CardSet");
class Player {
    constructor(initialHand, initialTable) {
        this.hand = initialHand ?? new CardSet_1.CardSet([]);
        this.table = initialTable ?? new CardSet_1.CardSet([]);
    }
    removeCard(value) {
        let removed = this.hand.removeCard(value);
        if (!removed)
            removed = this.table.removeCard(value);
        return removed;
    }
    receiveCard(card) {
        this.hand.insertCard(card, false);
    }
    vacant() {
        return !this.username && !this._id;
    }
    cleanUp(autoAbsorb = false) {
        this.username = this._id = null;
        return autoAbsorb ? this.absorbCards() : null;
    }
    absorbCards() {
        const merged = CardSet_1.CardSet.merge(this.hand, this.table);
        this.hand.clear();
        this.table.clear();
        return merged;
    }
}
exports.Player = Player;

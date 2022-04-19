"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pile = void 0;
const CardSet_1 = require("./CardSet");
class Pile extends CardSet_1.CardSet {
    constructor(pileID, faceUp = false) {
        super();
        if (faceUp)
            this.revealAll();
        this.pileID = pileID;
    }
    addToTop(card) {
        this.insertCard(card, this.faceUp);
    }
    removeFromTop() {
        return this.contents.pop();
    }
}
exports.Pile = Pile;

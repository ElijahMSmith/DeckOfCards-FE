"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayObject = void 0;
class ReplayObject {
    constructor(playerIDs, deckArrangements, actionLog, rules) {
        this.dateCreated = new Date();
        this.playerIDs = playerIDs;
        this.deckArrangements = deckArrangements;
        this.actionLog = actionLog;
        this.excludeDealer = rules.excludeDealer;
        this.withoutHearts = rules.withoutHearts;
        this.withoutDiamonds = rules.withoutDiamonds;
        this.withoutClubs = rules.withoutClubs;
        this.withoutSpades = rules.withoutSpades;
        this.jokersEnabled = rules.jokersEnabled;
        this.autoAbsorbCards = rules.autoAbsorbCards;
        this.playFacedDown = rules.playFacedDown;
    }
}
exports.ReplayObject = ReplayObject;

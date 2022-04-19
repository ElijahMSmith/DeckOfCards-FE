"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rules = void 0;
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
exports.Rules = Rules;

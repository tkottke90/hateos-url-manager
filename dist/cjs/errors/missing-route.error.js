"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingRouteError = void 0;
class MissingRouteError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'MissingRouteError';
    }
}
exports.MissingRouteError = MissingRouteError;

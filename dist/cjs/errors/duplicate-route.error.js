"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateRouteError = void 0;
class DuplicateRouteError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'DuplicateRouteError';
    }
}
exports.DuplicateRouteError = DuplicateRouteError;

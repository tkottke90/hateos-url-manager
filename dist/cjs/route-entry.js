"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const missing_route_error_1 = require("./errors/missing-route.error");
class Route {
    constructor(path, relativePath) {
        // Both the `path` and `relativePath` getters add
        // their own leading slash.  So we do not need one
        // in the setup
        if (path.startsWith('/')) {
            console.warn(`[HATEOS-ROUTES] Leading slash is handled by the class and not required, may result in unusual paths [${path}]`);
        }
        this._path = path;
        this._relativePath = relativePath !== null && relativePath !== void 0 ? relativePath : path;
    }
    get path() {
        return `/${this._relativePath}`;
    }
    get fullPath() {
        return `/${this._path}`;
    }
    nest(path) {
        // Throw an error if the path string is empty
        this.pathPresentCheck(path);
        const combinedPath = `${this._path}/${path}`;
        return new Route(combinedPath, path);
    }
    url(params, options) {
        let output = `/${this._path}`;
        if (params) {
            for (const key of Object.keys(params !== null && params !== void 0 ? params : {})) {
                const value = params[key];
                output = output.replace(`:${key}`, value);
            }
        }
        if (options === null || options === void 0 ? void 0 : options.query) {
            const query = new URLSearchParams();
            for (const qItem in options.query) {
                query.append(qItem, options.query[qItem].toString());
            }
            output += encodeURI(`?${query.toString()}`);
        }
        if (options === null || options === void 0 ? void 0 : options.hash) {
            output += encodeURI(`#${options.hash}`);
        }
        return output;
    }
    pathPresentCheck(path) {
        if (path.length === 0) {
            throw new missing_route_error_1.MissingRouteError('A route path must be provided');
        }
    }
}
exports.Route = Route;
// Note: Location Anatomy: https://developer.mozilla.org/en-US/docs/Web/API/Location
//
// https://example.org:8080/foo/bar?q=baz#bang
// ^1      ^2              ^3      ^4    ^5
//
// 1: Protocol
// 2: Host (hostname + port)
// 3: Pathname
// 4: Search
// 5: Hash

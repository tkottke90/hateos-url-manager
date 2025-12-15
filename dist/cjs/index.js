var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Route: () => Route
});
module.exports = __toCommonJS(index_exports);

// src/errors/missing-route.error.ts
var MissingRouteError = class extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "MissingRouteError");
  }
};

// src/route-entry.ts
var Route = class _Route {
  constructor(path, relativePath) {
    __publicField(this, "_path");
    __publicField(this, "_relativePath");
    if (path.startsWith("/")) {
      console.warn(
        `[HATEOS-ROUTES] Leading slash is handled by the class and not required, may result in unusual paths [${path}]`
      );
    }
    this._path = path;
    this._relativePath = relativePath != null ? relativePath : path;
  }
  get path() {
    return `/${this._relativePath}`;
  }
  get fullPath() {
    return `/${this._path}`;
  }
  nest(path) {
    this.pathPresentCheck(path);
    const combinedPath = `${this._path}/${path}`;
    return new _Route(combinedPath, path);
  }
  url(params, options) {
    let output = `/${this._path}`;
    if (params) {
      for (const key of Object.keys(params != null ? params : {})) {
        const value = params[key];
        output = output.replace(`:${key}`, value);
      }
    }
    if (options == null ? void 0 : options.query) {
      const query = new URLSearchParams();
      for (const qItem in options.query) {
        query.append(qItem, options.query[qItem].toString());
      }
      output += encodeURI(`?${query.toString()}`);
    }
    if (options == null ? void 0 : options.hash) {
      output += encodeURI(`#${options.hash}`);
    }
    return output;
  }
  pathPresentCheck(path) {
    if (path.length === 0) {
      throw new MissingRouteError("A route path must be provided");
    }
  }
};
//# sourceMappingURL=index.js.map

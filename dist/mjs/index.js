// src/errors/missing-route.error.ts
var MissingRouteError = class extends Error {
  name = "MissingRouteError";
};

// src/route-entry.ts
var Route = class _Route {
  _path;
  _relativePath;
  constructor(path, relativePath) {
    if (path.startsWith("/")) {
      console.warn(
        `[HATEOS-ROUTES] Leading slash is handled by the class and not required, may result in unusual paths [${path}]`
      );
    }
    this._path = path;
    this._relativePath = relativePath ?? path;
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
      for (const key of Object.keys(params ?? {})) {
        const value = params[key];
        output = output.replace(`:${key}`, String(value));
      }
    }
    if (options?.query) {
      const query = new URLSearchParams();
      for (const qItem in options.query) {
        query.append(qItem, options.query[qItem].toString());
      }
      output += encodeURI(`?${query.toString()}`);
    }
    if (options?.hash) {
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
export {
  Route
};
//# sourceMappingURL=index.js.map

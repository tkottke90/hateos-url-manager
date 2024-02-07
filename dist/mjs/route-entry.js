export class Route {
    _path;
    _relativePath;
    constructor(path, relativePath) {
        // Both the `path` and `relativePath` getters add
        // their own leading slash.  So we do not need one
        // in the setup
        if (path.startsWith('/')) {
            console.warn(`Leading slash is handled by the class and not required, may result in unusual paths [${path}]`);
        }
        this._path = path;
        this._relativePath = relativePath ?? path;
    }
    get path() {
        return `/${this._path}`;
    }
    get relativePath() {
        return `/${this._relativePath}`;
    }
    createNested(path) {
        const combinedPath = `${this._path}/${path}`;
        return new Route(combinedPath, path);
    }
    url(params) {
        let output = this._path;
        if (!params)
            return output;
        for (const key of Object.keys(params ?? {})) {
            const value = params[key];
            output = output.replace(`:${key}`, value);
        }
        return output;
    }
}

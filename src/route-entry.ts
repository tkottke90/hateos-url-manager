import { MissingRouteError } from './errors/missing-route.error';

type RouteParamValue = string | number;

// Combines 2 string literals delimited by a forward slash: users/:userId
// while maintaining the literal types.  This allows us to create strictly
// types strings which work with the Route Class
type MergedRoutes<
  ParentPath extends string,
  ChildPath
> = ChildPath extends string ? `${ParentPath}/${ChildPath}` : never;

type PathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof PathParams<Rest>]: RouteParamValue }
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: RouteParamValue }
      : undefined;

type URLInputs = {
  query?: Record<string, RouteParamValue>;
  hash?: string;
};

export class Route<T extends string> {
  private readonly _path: T;
  private readonly _relativePath: string;

  constructor(path: T, relativePath?: string) {
    // Both the `path` and `relativePath` getters add
    // their own leading slash.  So we do not need one
    // in the setup
    if (path.startsWith('/')) {
      console.warn(
        `[HATEOS-ROUTES] Leading slash is handled by the class and not required, may result in unusual paths [${path}]`
      );
    }

    this._path = path;
    this._relativePath = relativePath ?? path;
  }

  get path(): string {
    return `/${this._relativePath}`;
  }

  get fullPath(): string {
    return `/${this._path}`;
  }

  nest<NestedPath extends string>(path: NestedPath) {
    // Throw an error if the path string is empty
    this.pathPresentCheck(path);

    const combinedPath = `${this._path}/${path}` as MergedRoutes<T, NestedPath>;

    return new Route(combinedPath, path);
  }

  url<Params extends PathParams<T> = PathParams<T>>(
    params?: keyof Params extends never ? undefined : Params,
    options?: URLInputs
  ): string {
    let output = `/${this._path}` as string;

    if (!params) return output;

    for (const key of Object.keys(params ?? {})) {
      const value = params[key];
      output = output.replace(`:${key}`, value);
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

  private pathPresentCheck(path: string) {
    if (path.length === 0) {
      throw new MissingRouteError('A route path must be provided');
    }
  }
}

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

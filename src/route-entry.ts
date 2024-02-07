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

export class Route<T extends string> {
  private readonly _path: T;
  private readonly _relativePath: string;

  constructor(path: T, relativePath?: string) {
    // Both the `path` and `relativePath` getters add
    // their own leading slash.  So we do not need one
    // in the setup
    if (path.startsWith('/')) {
      console.warn(
        `Leading slash is handled by the class and not required, may result in unusual paths [${path}]`
      );
    }

    this._path = path;
    this._relativePath = relativePath ?? path;
  }

  get path(): string {
    return `/${this._path}`;
  }

  get relativePath(): string {
    return `/${this._relativePath}`;
  }

  createNested<NestedPath extends string>(path: NestedPath) {
    const combinedPath = `${this._path}/${path}` as MergedRoutes<T, NestedPath>;

    return new Route(combinedPath, path);
  }

  url<Params extends PathParams<T> = PathParams<T>>(
    params?: keyof Params extends never ? undefined : Params
  ): string {
    let output = this._path as string;

    if (!params) return output;

    for (const key of Object.keys(params ?? {})) {
      const value = params[key];
      output = output.replace(`:${key}`, value);
    }

    return output;
  }
}

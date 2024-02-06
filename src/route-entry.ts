// Combines 2 string literals delimited by a forward slash: users/:userId
type MergedRoutes<
  ParentPath extends string,
  ChildPath
> = ChildPath extends string ? `${ParentPath}/${ChildPath}` : never;

type PathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof PathParams<Rest>]: string | number }
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : Record<string, never>;

export class Route<T extends string> {
  private readonly _path: T;
  private readonly _relativePath: string;

  constructor(path: T, relativePath?: string) {
    this._path = path;
    this._relativePath = relativePath ?? path;
  }

  get path(): string {
    return `/${this._path}`;
  }

  get relativePath(): string {
    return `/${this._relativePath}`;
  }

  createChild<ChildPath extends string>(path: ChildPath) {
    const combinedPath = `${this._path}/${path}` as MergedRoutes<T, ChildPath>;

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

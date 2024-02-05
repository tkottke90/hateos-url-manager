// Extract query parameters from a query string
type ExtractParam<Path, NextPart> = Path extends `:${infer Param}`
  ? Record<Param, string> & NextPart
  : NextPart;

// Parse each segment of a string (delimited by a forward slash) and return
// a map of any query parameters
type ExtractParts<Path> = Path extends `${infer Segment}/${infer Rest}`
  ? ExtractParam<Segment, ExtractParts<Rest>>
  : ExtractParam<Path, object>;

// Combines 2 string literals delimited by a forward slash: users/:userId
type MergedRoutes<
  ParentPath extends string,
  ChildPath
> = ChildPath extends string ? `${ParentPath}/${ChildPath}` : never;

const combined: MergedRoutes<'users', ':usersId'> = 'users/:usersId';
//    ^?

export class Route<T extends string> {
  constructor(readonly path: T) {}

  createChild<ChildPath extends string>(path: ChildPath) {
    const combinedPath = `${this.path}/${path}` as MergedRoutes<T, ChildPath>; // this.path + delimiter + path;

    return new Route(combinedPath);
  }

  url(params: Record<keyof ExtractParts<T>, string>) {
    return params;
  }
}

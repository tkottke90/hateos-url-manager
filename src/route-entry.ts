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
  ChildPath extends string
> = ChildPath extends string ? `${ParentPath}/${ChildPath}` : never;

let combined: MergedRoutes<'users', ':usersId'>;
//    ^?

export class Route<T extends string> {
  constructor(readonly path: T) {}

  createChild<ChildPath extends string>(path: ChildPath) {
    const combinedPath: MergedRoutes<T, ChildPath> = `${this.path}/${path}`; // this.path + delimiter + path;

    return new Route(combinedPath);
  }

  url(params: Record<keyof ExtractParts<T>, string>) {
    return params;
  }
}

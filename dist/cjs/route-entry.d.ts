type RouteParamValue = string | number;
type MergedRoutes<ParentPath extends string, ChildPath> = ChildPath extends string ? `${ParentPath}/${ChildPath}` : never;
type PathParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}` ? {
    [K in Param | keyof PathParams<Rest>]: RouteParamValue;
} : T extends `${string}:${infer Param}` ? {
    [K in Param]: RouteParamValue;
} : undefined;
type URLInputs = {
    query?: Record<string, RouteParamValue>;
    hash?: string;
};
export declare class Route<T extends string> {
    private readonly _path;
    private readonly _relativePath;
    constructor(path: T, relativePath?: string);
    get path(): string;
    get relativePath(): string;
    createNested<NestedPath extends string>(path: NestedPath): Route<MergedRoutes<T, NestedPath>>;
    url<Params extends PathParams<T> = PathParams<T>>(params?: keyof Params extends never ? undefined : Params, options?: URLInputs): string;
}
export {};
